<?php

namespace App\Http\Controllers\Api;

use App\Helpers\Activity\ActivityHelpers;
use App\Http\Controllers\Controller;
use App\Models\Service;
use App\Models\ServiceDomain;
use App\Models\Trial;
use App\Models\User;
use App\Models\PasswordReset;
use App\Notifications\ResetPasswordNotification;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\Rules\Password as RulesPassword;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Auth\Events\PasswordReset as PasswordResetEvent;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $requestData = $request->json()->all();
        $validator = Validator::make($requestData, [
            'email' => 'required|string|email',
            'password' => 'required|string'
        ]);
        if($validator->fails()){
            return api_json_response(422, false, trans('validation.custom.invalid-data'), [], $validator->errors());
        }
        $credentials = $requestData;
        if (!Auth::attempt($credentials)) {
            return api_json_response(401, false, trans('validation.custom.email-password'), [], []);
        }
        $user = Auth::user();
        if (!$user->active) {
            return api_json_response(401, false, 'You account is inactive, please contact admin!', [], []);
        }
        $token = $user->createToken(config('app.name'));
        $user->last_login = Carbon::now();
        $user->save();
        $user->load('roles','country','timezone','services');

        //record Activity log
        save_activity_log([
            "user_id"=>$user->id,
            "event"=>config('constants.EVENT_LOGGED_IN'),
            "description"=>"User Logged In",
            "model_name"=>User::class,
            "model_id" => $user->id,
            "activity_date"=>Carbon::now()->setTimezone(current_user_time_zone())->format("Y-m-d H:i:s O")
        ]);

        return api_json_response(200, true, null, [
            'access_token' => $token->accessToken,
            'token_type' => 'Bearer',
            'token_id' => $token->token->id,
            'user' => $user,
        ]);
    }

    public function logout(Request $request)
    {
        Auth::user()->token()->delete();
        //record Activity log
        save_activity_log([
            "user_id"=>$request->user()->id,
            "event"=>config('constants.EVENT_LOGGED_OUT'),
            "description"=>"User Logged Out",
            "model_name"=>User::class,
            "model_id" => $request->user()->id,
            "activity_date"=>Carbon::now()->setTimezone(current_user_time_zone())->format("Y-m-d H:i:s O")
        ]);
        return api_json_response(200, true, trans('auth.logout'));
    }

    public function forgotPwd(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);
        $user = User::where('email', $request->email)->first();
        if (!$user){
            return api_json_response(401, false, "We can't find a user with that e-mail address.");
        }
        PasswordReset::whereEmail($user->email)->delete();
        $passwordReset = PasswordReset::create(
            [
                'email' => $user->email,
                'token' => base64_encode(Str::random(60))
            ]
        );
        if ($user && $passwordReset) {
            $url = env('APP_URL').'/reset-password/'.$passwordReset->token;
            $user = User::whereEmail($request->email)->first();
            $user->notify(new ResetPasswordNotification($url));
            //record Activity log
            save_activity_log([
                "user_id"=>$user->id,
                "event"=>config('constants.EVENT_FORGOT_PWD'),
                "description"=>"User has requested for reset password.",
                "model_name"=>User::class,
                "model_id" => $user->id,
                "activity_date"=>Carbon::now()->setTimezone(current_user_time_zone())->format("Y-m-d H:i:s O")
            ]);
            return api_json_response(200, true, 'We have e-mailed your password reset link!');
        }else{
            return api_json_response(401, false, 'Password reset link cannot be send!');
        }
    }

    public function resetPwd(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => ['required', 'confirmed', RulesPassword::defaults()],
        ]);
        $tokenData = PasswordReset::where('token',$request->token)
            ->where('created_at','>',Carbon::now()->subDay())
            ->first();
        if(empty($tokenData)){
            return api_json_response(401, false, 'Invalid token!');
        }else{
            if($tokenData->email != $request->email){
                return api_json_response(401, false, 'Invalid user!');
            }
        }
        $user = User::whereEmail($request->email)->first();
        if(!$user){
            return api_json_response(401, false, 'User not found!');
        }
        $user->forceFill([
            'password' => Hash::make($request->password),
            'remember_token' => Str::random(60),
        ])->save();
        $user->tokens()->delete();
        event(new PasswordResetEvent($user));
        //record Activity log
        save_activity_log([
            "user_id"=>$user->id,
            "event"=>config('constants.EVENT_RESET_PWD'),
            "description"=>"User has changed its password.",
            "model_name"=>User::class,
            "model_id" => $user->id,
            "activity_date"=>Carbon::now()->setTimezone(current_user_time_zone())->format("Y-m-d H:i:s O")
        ]);
        return api_json_response(200, true, 'Password reset successfully');
    }

    public function setPwd(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'password' => ['required', 'confirmed', RulesPassword::defaults()],
        ]);
        $user = User::where('invite_token',$request->token)
                ->where('invited_at','>',Carbon::now()->subDay())->first();
        if(empty($user)){
            return api_json_response(401, false, 'Invalid token!');
        }
        $user->update([
            'password' => Hash::make($request->password),
            'invite_token' => null,
            'active' => true
        ]);
        //record Activity log
        save_activity_log([
            "user_id"=>$user->id,
            "event"=>config('constants.EVENT_SET_PWD'),
            "description"=>"User has accepted invitation and set password.",
            "model_name"=>User::class,
            "model_id" => $user->id,
            "activity_date"=>Carbon::now()->setTimezone(current_user_time_zone())->format("Y-m-d H:i:s O")
        ]);
        return api_json_response(200, true, 'Password set successfully.');
    }


    /*
     *
     */
    public function loginToService($id, $type){
        try{
            if(!in_array($type, ['service', 'trial'])){
                return response()->json([
                    'success' => false,
                    'message' => 'Service type not found!',
                    'meta' => null,
                    'errors' => null
                ], 404);
            }
            $subdomain = "";
            if($type == "service"){
                $service  = Service::find($id);
                $domain = ServiceDomain::where("service_id", $id)->first();
                if(isset($domain->api_sub_domain))
                    $subdomain = $domain->api_sub_domain;
            }else if($type == "trial"){
                $service  = Trial::find($id);
                $domain = ServiceDomain::where("trial_id", $id)->first();
                if(isset($domain->api_sub_domain))
                    $subdomain = $domain->api_sub_domain;
            }
            $user = Auth::user();
            if($service){

                $url = $subdomain . '/api/add-login-token';

                $login_token = Hash::make(Str::random(64).Carbon::now()->timestamp);

                $login_token = str_replace(array("/", "?"), "", $login_token);

                $api_data = [
                    'email'=>$user->email,
                    'login_token'=>$login_token
                ];
                $response = Http::post($url, $api_data);

                if($response->body() == true){

                    //Login to service with access token response
                    $login_response = Http::get($subdomain.'/api/login-via-token/'.$login_token);
                    if($login_response->status() == 200){
                        $user_data = json_decode($login_response->body());
                        return api_json_response(200, true, null, [
                            'login_token' => $login_token,
                            'service_login_url' => $subdomain.'/api/login-via-token/'.$login_token,
                            'access_token'=>$user_data->data->access_token
                        ]);
                    }else{
                        return response()->json([
                            'success' => false,
                            'message' => 'Error in login to service!',
                            'meta' => null,
                            'errors' => null
                        ], 500);
                    }
                }else{
                    return response()->json([
                        'success' => false,
                        'message' => 'Connection to subdomain failed!',
                        'meta' => null,
                        'errors' => null
                    ], 404);
                }
            }else{
                return response()->json([
                    'success' => false,
                    'message' => 'No Service found!',
                    'meta' => null,
                    'errors' => null
                ], 500);
            }
        }catch (\Exception $e){
            return response()->json([
                'success' => false,
                'message' => 'Something went wrong, please try again later.',
                'meta' => null,
                'errors' => null
            ], 500);
        }
    }

    public function findToken(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'type' => 'required'
        ]);
        if($request->type == 'reset') {
            $token = PasswordReset::where('token',$request->token)
                ->where('created_at','>',Carbon::now()->subDay())
                ->first();
        }else {
            $token = User::where('invite_token',$request->token)
                ->where('invited_at','>',Carbon::now()->subDay())
                ->first();
        }
        if(empty($token)){
            return api_json_response(401, false, 'Invalid token!');
        }
        return api_json_response(200, true, 'Token matched.');
    }
}
