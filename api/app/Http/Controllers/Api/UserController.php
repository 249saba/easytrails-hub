<?php

namespace App\Http\Controllers\Api;

use App\Exports\ExportUser;
use App\Http\Controllers\Controller;
use App\Mail\AcceptInvitationMail;
use App\Models\Service;
use App\Models\ServiceDomain;
use App\Models\Trial;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Models\User;
use App\Http\Resources\UserResource;
use App\Http\Resources\UserCollection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password as RulesPassword;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Database\Eloquent\Builder;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return UserCollection
     */
    public function index(Request $request)
    {
        $users = User::with('roles','country','timezone','services')
                ->filter($request)
                ->paginate($request->per_page ?? 10);
        if($request->sort_column == 'status'){
            if($request->sort_order == 'ASC') {
                $users = $users->sortBy($request->sort_column);
            }else{
                $users = $users->sortByDesc($request->sort_column);
            }
        }
        return new UserCollection($users);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @return UserResource
     */
    public function store(Request $request)
    {
        $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|string|email:rfc,dns|max:255|unique:users',
            'phone_number' => 'required|numeric|digits:10',
            'hub_admin' => 'required',
            'country_id' => 'required',
            'timezone_id' => 'required',
            'service_trials' => 'required',
        ]);
        $requestData = $request->all();
        $requestData['created_by'] = auth()->id();
        $requestData['invite_token'] = Str::random(36);
        $requestData['invited_by'] = auth()->id();
        $requestData['invited_at'] = Carbon::now();

        $insert_to_services = self::insertUserIntoService($request);
        if(!$insert_to_services){
            return response()->json([
                'success' => false,
                'message' => 'Connection to services failed!',
                'meta' => null,
                'errors' => null
            ], 500);
        }

        $user = User::create($requestData);
        // user service & trial-wise role stuff
        if(isset($request->service_trials)){
            foreach($request->service_trials as $data){
                foreach($data['trials'] as $trialData){
                    $user->roles()->attach($trialData['role_id'],[
                        'trial_id' => $trialData['trial_id'],
                        'service_id' => $data['service_id'],
                    ]);
                }
            }
        }
        $user->load('roles','country','timezone');
        Mail::to($user->email)->send(new AcceptInvitationMail($user));
        //record Activity log
        save_activity_log([
            "user_id"=>auth()->id(),
            "event"=>'User '.config('constants.EVENT_NEW_DATA_ADDED'),
            "description"=>'User '.config('constants.EVENT_NEW_DATA_ADDED'),
            "model_name"=>User::class,
            "model_id" => $user->id,
            "activity_date"=>Carbon::now()->setTimezone(current_user_time_zone())->format("Y-m-d H:i:s O")
        ]);
        return (new UserResource($user))->setMessage(trans('text.created',['attribute' => 'User']));
    }

    /**
     * Display the specified resource.
     *
     * @param User $user
     * @return UserResource
     */
    public function show(User $user)
    {
        $user->load('roles','country','timezone','services')->loadCount('trials');
        return new UserResource($user);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param Request $request
     * @param User $user
     * @return UserResource
     */
    public function update(Request $request, User $user)
    {
        $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'phone_number' => 'required|numeric|digits:10',
            'hub_admin' => 'required',
            'country_id' => 'required',
            'timezone_id' => 'required',
        ]);
        $requestData = $request->all();
        $requestData['updated_by'] = auth()->id();
        //Get changelog data before update
        $activity_data = fetch_change_log_from_requested_data_and_model($requestData, $user);
        $user->update($requestData);
        // user service & trial-wise role stuff
        if(isset($request->service_trials)){
            $oldServiceData = DB::table('model_has_roles')
                ->where('model_type','App\Models\User')
                ->where('model_id', $user->id)
                ->get();
            $removed = false;
            foreach($oldServiceData as $oldData){
                $newServiceData = collect($request->service_trials)->pluck('service_id')->toArray();
                if(in_array($oldData->service_id,$newServiceData)){
                    $newServiceTrials = collect(collect(collect($request->service_trials)
                        ->where('service_id',$oldData->service_id)->pluck('trials'))
                        ->toArray()[0])->pluck('trial_id')->toArray();
                    if(in_array($oldData->trial_id,$newServiceTrials)){
                        $newRole = collect(collect(collect($request->service_trials)
                            ->where('service_id',$oldData->service_id)->pluck('trials'))
                            ->toArray()[0])->where('trial_id',$oldData->trial_id)->first();
                        if($oldData->role_id != $newRole['role_id']){
                            // data is modified
                            //record Activity log
                            save_activity_log([
                                "type" => config('constants.TYPE_CHANGE_LOG'),
                                "user_id"=>auth()->id(),
                                "event"=> "User Service Trial's Role Updated",
                                "original_value" => $oldData->role_id,
                                "new_value" => $newRole['role_id'],
                                "description"=> get_name($oldData->service_id,'service')." - " . get_name($oldData->role_id,'role') . " role has been updated with " . get_name($newRole['role_id'],'role') . " role for "  . get_name($oldData->trial_id,'trial') ." trial in ". $user->name . " user.",
                                "model_name"=>User::class,
                                "model_id" => $user->id,
                                "activity_date"=>Carbon::now()->setTimezone(current_user_time_zone())->format("Y-m-d H:i:s O")
                            ]);
                        }
                        // data is same
                    }else{
                        // data is modified $oldData->trial_id removed in update user
                        //record Activity log
                        save_activity_log([
                            "type" => config('constants.TYPE_CHANGE_LOG'),
                            "user_id"=>auth()->id(),
                            "event"=> "User Service Trial Updated",
                            "original_value" => $oldData->trial_id,
                            "description"=> get_name($oldData->service_id,'service')." - " . get_name($oldData->trial_id,'trial') ." trial has been removed from ". $user->name . " user.",
                            "model_name"=>User::class,
                            "model_id" => $user->id,
                            "activity_date"=>Carbon::now()->setTimezone(current_user_time_zone())->format("Y-m-d H:i:s O")
                        ]);
                    }
                }else{
                    //$oldData->service_id removed in update user
                    if (!$removed) {
                        //record Activity log
                        save_activity_log([
                            "type" => config('constants.TYPE_CHANGE_LOG'),
                            "user_id"=>auth()->id(),
                            "event"=> "User Service Updated",
                            "original_value" => $oldData->service_id,
                            "description"=> get_name($oldData->service_id,'service')." service has been removed from ". $user->name . " user.",
                            "model_name"=>User::class,
                            "model_id" => $user->id,
                            "activity_date"=>Carbon::now()->setTimezone(current_user_time_zone())->format("Y-m-d H:i:s O")
                        ]);
                    }
                    $removed = true;
                }
            }
            $user->roles()->detach();
            foreach($request->service_trials as $data){
                $oldServiceTrials = $oldServiceData
                    ->where('service_id',$data['service_id'])
                    ->pluck('trial_id')->toArray();
                if(empty($oldServiceTrials)){
                    save_activity_log([
                        "type" => config('constants.TYPE_CHANGE_LOG'),
                        "user_id"=>auth()->id(),
                        "event"=> "User Service Updated",
                        "new_value" => $data['service_id'],
                        "description"=> get_name($data['service_id'],'service')." service has been added into ". $user->name . " user.",
                        "model_name"=>User::class,
                        "model_id" => $user->id,
                        "activity_date"=>Carbon::now()->setTimezone(current_user_time_zone())->format("Y-m-d H:i:s O")
                    ]);
                }
                foreach($data['trials'] as $trialData){
                    if(!empty($oldServiceTrials)){
                        if(!in_array($trialData['trial_id'],$oldServiceTrials)){
                            //record Activity log
                            save_activity_log([
                                "type" => config('constants.TYPE_CHANGE_LOG'),
                                "user_id"=>auth()->id(),
                                "event"=> "User Service Trial Updated",
                                "description"=> get_name($data['service_id'],'service')." - ". get_name($trialData['trial_id'],'trial') ." trial with ". get_name($trialData['role_id'],'role') ." role has been added into ". $user->name . " user.",
                                "model_name"=>User::class,
                                "model_id" => $user->id,
                                "activity_date"=>Carbon::now()->setTimezone(current_user_time_zone())->format("Y-m-d H:i:s O")
                            ]);
                        }
                    }
                    $user->roles()->attach($trialData['role_id'],[
                        'trial_id' => $trialData['trial_id'],
                        'service_id' => $data['service_id'],
                    ]);
                }
            }
        }
        $user->load('roles','country','timezone');
        //Save changelog data after updated on server

        //Insert user into services if newly assinged
        self::insertUserIntoService($request);
        save_change_log($activity_data);
        return (new UserResource($user))->setMessage(trans('text.updated',['attribute' => 'User']));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param User $user
     * @return JsonResponse
     * @throws Exception
     */
    public function destroy(User $user)
    {
        $user->delete();
        return response()->json([
            'success' => true,
            'message' => trans('text.deleted',['attribute' => 'User']),
            'meta' => null,
            'errors' => null
        ], 200);
    }

    public function getUserStatusCount(Request $request)
    {
        $totalUsersCount = User::count();
        $totalActiveUsersCount = User::whereNotNull('password')->whereActive(true)->count();
        $totalInactiveUsersCount = User::whereNotNull('password')->whereActive(false)->count();
        $totalNeverLoggedInUsersCount = User::whereNotNull('password')->whereNull('last_login')->count();
        return api_json_response(200, true, null, [
            'total_users' => $totalUsersCount,
            'total_active_users' => $totalActiveUsersCount,
            'total_inactive_users' => $totalInactiveUsersCount,
            'total_never_logged_in_users' => $totalNeverLoggedInUsersCount,
        ]);
    }

    public function changePwd(Request $request, User $user)
    {
        $request->validate([
            'password' => ['required', 'confirmed', RulesPassword::defaults()],
        ]);
        if(auth()->id() != $user->id){
            return api_json_response(401, false, 'Unauthorized!');
        }
        $user->update([
            'password' => Hash::make($request->password)
        ]);
        //record Activity log
        save_activity_log([
            "user_id"=>$user->id,
            "event"=>config('constants.EVENT_CHANGE_PWD'),
            "description"=>"User has changed its password.",
            "model_name"=>User::class,
            "model_id" => $user->id,
            "activity_date"=>Carbon::now()->setTimezone(current_user_time_zone())->format("Y-m-d H:i:s O")
        ]);
        return api_json_response(200, true, 'Password changed successfully.');
    }

    public function export(Request $request)
    {
        $request->validate([
            'type' => 'required'
        ]);
        $fileName = 'Hub-Users-List-'.strtoupper(Carbon::now()->format('d-M-Y-G-i-A'));
        switch ($request->type){
            case 'xlsx' :
                $excelReport = Excel::download(new ExportUser, $fileName.'.xlsx', \Maatwebsite\Excel\Excel::XLSX);
                break;
            case 'csv' :
                $excelReport = Excel::download(new ExportUser, $fileName.'.csv', \Maatwebsite\Excel\Excel::CSV);
                break;
            case 'pdf' :
                $excelReport = Excel::download(new ExportUser, $fileName.'.pdf', \Maatwebsite\Excel\Excel::DOMPDF);
                break;
        }
        return $excelReport;
    }

    public function uploadImage(Request $request,User $user)
    {
        if ($user->id !== auth()->id()) {
            return api_json_response(401, false, 'Unauthorized', [], []);
        }
        $request->validate([
            'avatar' => 'required',
        ]);
        if($request->hasFile('avatar') && $request->file('avatar')->isValid()){
            $user->addMediaFromRequest('avatar')->toMediaCollection('avatar');
        }
        //record Activity log
        save_activity_log([
            "user_id"=>auth()->id(),
            "event"=>'User Avatar Upload',
            "description"=>'User Avatar Upload Successfully',
            "model_name"=>User::class,
            "model_id" => $user->id,
            "activity_date"=>Carbon::now()->setTimezone(current_user_time_zone())->format("Y-m-d H:i:s O")
        ]);
        return api_json_response(200, true, 'User Avatar uploaded successfully');
    }

    public function edit(User $user)
    {
        $serviceTrials = [];
        $serviceData = DB::table('model_has_roles')
            ->where('model_type','App\Models\User')
            ->where('model_id', $user->id)
            ->get();
        if(!empty($serviceData)){
            foreach($serviceData as $service){
                $serviceTrials[$service->service_id]['service_id'] = $service->service_id;
                $serviceTrials[$service->service_id]['trials'][] = [
                    'trial_id' => $service->trial_id,
                    'role_id' => $service->role_id,
                ];
            }
        }
        $user->service_trials = $serviceTrials;
        $user->load('roles','country','timezone','services')->loadCount('services','trials');
        return new UserResource($user);
    }

    public function changeStatus(Request $request,User $user)
    {
        $request->validate([
            'status' => 'required'
        ]);
        $requestData = $request->all();
        $status = $request->status == 'active' ? true : false;
        //Get changelog data before update
        $activity_data = fetch_change_log_from_requested_data_and_model($requestData, $user);
        $user->update([
            'active' => $status
        ]);
        //Save changelog data after updated on server
        save_change_log($activity_data);
        return api_json_response(200, true, 'Status changed successfully.');
    }

    public function trialServices(User $user)
    {
        if(auth()->id() != $user->id){
            return api_json_response(401, false, 'Unauthorized!');
        }
        $responseData = [];
        $userServices = null;
        $trials = null;
        if(!empty($user->services)){
            $userServices = $user->services()->where('short_code','!=', 'trial')->with('domain')->get();
            $serviceTrials = [];
            $serviceData = DB::table('model_has_roles')
                ->where('model_type','App\Models\User')
                ->where('model_id', $user->id)
                ->whereNotIn('service_id', $userServices->pluck('id'))
                ->get();
            if(!empty($serviceData)){
                foreach($serviceData as $service){
                    $serviceTrials[] = $service->trial_id;
                }
            }
            $userServices = $userServices->toArray();
            $trials = Trial::select('id','name','email','active','short_code')
                ->whereIn('id',$serviceTrials)->with('domain')->get()->toArray();
        }
        $responseData['services'] = $userServices;
        $responseData['trials'] = $trials;
        return api_json_response(200, true, null,$responseData);
    }

    public function reInvite(User $user)
    {
        $requestData = [
            'invite_token' => Str::random(36),
            'invited_by' => auth()->id(),
            'invited_at' => Carbon::now(),
        ];
        $user->update($requestData);
        Mail::to($user->email)->send(new AcceptInvitationMail($user));
        //record Activity log
        save_activity_log([
            "type" => config('constants.TYPE_CHANGE_LOG'),
            "user_id"=>auth()->id(),
            "event"=>config('constants.EVENT_REINVITE'),
            "description"=>'User is re-invited by '. auth()->user()->name. ' at '.Carbon::now()->setTimezone(current_user_time_zone())->format("Y-m-d H:i:s O"),
            "model_name"=>User::class,
            "model_id" => $user->id,
            "activity_date"=>Carbon::now()->setTimezone(current_user_time_zone())->format("Y-m-d H:i:s O")
        ]);
        return response()->json([
            'success' => true,
            'message' => 'User re-invited successfully.',
            'meta' => null,
            'errors' => null
        ], 200);
    }


    /**
     * @param User $user
     */
    private static function insertUserIntoService($request_data)
    {
        try {
            $user = Auth::user();
            $services_short_codes = array();

            $trial_service = Service::where("short_code", "trial")->first();
            if(isset($request_data->service_trials)){
                foreach($request_data->service_trials as $data){
                    if($trial_service->id == $data['service_id']){
                        foreach($data['trials'] as $trialData){
                            $trial  = Trial::find($trialData['trial_id']);
                            if($trial && !in_array($trial->short_code, $services_short_codes)){
                                $services_short_codes[] =$trial->short_code;
                            }
                        }
                    }else{
                        $service = Service::find($data['service_id']);
                        if(!in_array($service->short_code, $services_short_codes)){
                            $services_short_codes[]= $service->short_code;
                        }
                    }
                }
            }
            foreach ($services_short_codes as $services_short_code) {

                $userData = [
                    'first_name' => $request_data['first_name'],
                    'last_name' => $request_data['last_name'],
                    'email' => $request_data['email'],
                ];

                $subdomain = "";
                $domain = ServiceDomain::where("slug", $services_short_code)->first();
                if (isset($domain->api_sub_domain))
                    $subdomain = $domain->api_sub_domain;

                $url = $subdomain . '/api/add-user';

                $response = Http::post($url, $userData);
                return $response->body();

            }
            return true;
        }catch (\Exception $e){
//            dd($e);
            Log::error("insertUserIntoService" . $e);
            return false;
        }
    }
}
