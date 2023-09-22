<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\TrialEditResource;
use App\Models\Service;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Models\Trial;
use App\Http\Resources\TrialResource;
use App\Http\Resources\TrialCollection;
use Illuminate\Support\Facades\Auth;
use Jenssegers\Agent\Agent;

class TrialController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return TrialCollection
     */
    public function index(Request $request)
    {
        $trials = Trial::with('sponsor','countries','languages','services')->filter($request);
        if($request->has('per_page')){
            $trials = $trials->paginate($request->per_page ?? 10);
        }else{
            $trials = $trials->get();
        }
        return new TrialCollection($trials);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @return TrialResource
     */
    public function store(Request $request)
    {
        $requestData = $request->all();
        $trial = Trial::create($requestData);
        return (new TrialResource($trial))->setMessage('Created!');
    }

    /**
     * Display the specified resource.
     *
     * @param Trial $trial
     * @return TrialResource
     */
    public function show(Trial $trial)
    {
        $trial->load('sponsor','countries','languages','services');
        return new TrialResource($trial);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param Request $request
     * @param Trial $trial
     * @return TrialResource
     */
    public function update(Request $request, Trial $trial)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'sponsor_id' => 'required',
            'recruitment_url' => 'sometimes',
            'study_number' => 'sometimes',
            'email' => 'required|string|email:rfc,dns|max:255',
            'countries' => 'required|array',
            'contact_number' => 'sometimes|numeric|digits:10',
            'languages' => 'required|array',
            'short_code' => 'required',
            'app_name' => 'required',
            'app_store_url' => 'sometimes',
            'play_store_url' => 'sometimes',
            'description' => 'sometimes',
            'services' => 'required|array',
            'has_appointment_locations' => 'required',
        ]);
        $requestData = $request->all();

        //Get changelog data before update
        $activity_data = fetch_change_log_from_requested_data_and_model($requestData, $trial);

        $trial->update($requestData);

        //Save changelog data after updated on server
        save_change_log($activity_data);

        if(isset($requestData['countries'])){
            $trial->countries()->detach();
            foreach($requestData['countries'] as $country){
                $trial->countries()->attach($country);
            }
        }
        if(isset($requestData['languages'])){
            $trial->languages()->detach();
            foreach($requestData['languages'] as $language){
                $trial->languages()->attach($language);
            }
        }
        if(isset($requestData['services'])){
            $trial->services()->detach();
            foreach($requestData['services'] as $service){
                $trial->services()->attach($service);
            }
        }
        $trial->load('sponsor','countries','languages','services');
        return (new TrialResource($trial))->setMessage(trans('text.updated',['attribute' => 'Trial']));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Trial $trial
     * @return JsonResponse
     * @throws Exception
     */
    public function destroy(Trial $trial)
    {
        $trial->delete();
        //record Activity log
        save_activity_log([
            "user_id"=>auth()->id(),
            "event"=>'Trial '.config('constants.EVENT_DATA_DELETED'),
            "description"=>'Trial '.config('constants.EVENT_DATA_DELETED'),
            "model_name"=>Trial::class,
            "model_id" => $trial->id,
            "activity_date"=>Carbon::now()->setTimezone(current_user_time_zone())->format("Y-m-d H:i:s O")
        ]);
        return response()->json([
            'success' => true,
            'message' => trans('text.deleted',['attribute' => 'Trial']),
            'meta' => null,
            'errors' => null
        ], 200);
    }

    public function changeStatus(Request $request,Trial $trial)
    {
        $request->validate([
            'status' => 'required'
        ]);
        $requestData = $request->all();
        $status = $request->status == 'active' ? true : false;
        //Get changelog data before update
        $activity_data = fetch_change_log_from_requested_data_and_model($requestData, $trial);
        $trial->update([
            'active' => $status
        ]);
        //Save changelog data after updated on server
        save_change_log($activity_data);
        return response()->json([
            'success' => true,
            'message' => 'Status changed successfully.',
            'meta' => null,
            'errors' => null
        ], 200);
    }

    public function edit(Trial $trial)
    {
        $languages = [];
        $countries = [];
        $services = [];
        if($trial->languages->count() > 0){
            foreach($trial->languages as $language){
                $languages[] = $language->id;
            }
            $trial->languages = $languages;
        }
        if($trial->countries->count() > 0){
            foreach($trial->countries as $country){
                $countries[] = $country->id;
            }
            $trial->countries = $countries;
        }
        if($trial->services->count() > 0){
            foreach($trial->services as $service){
                $services[] = $service->id;
            }
            $trial->services = $services;
        }
        return new TrialEditResource($trial);
    }
}
