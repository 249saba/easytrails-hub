<?php
/**
 * Created by PhpStorm.
 * User: Tariq
 * Date: 4/12/2023
 * Time: 5:36 AM
 */

namespace App\Helpers\Activity;


use App\Models\Activity;
use App\Models\CustomRole;
use App\Models\Language;
use App\Models\Service;
use App\Models\Sponsor;
use App\Models\Trial;
use App\Models\TrialSiteLocation;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Jenssegers\Agent\Agent;
use Spatie\Permission\Models\Role;

class ActivityHelpers
{
    public static function createActivity($data){

        try{
            if(!is_array($data))
                return;

            if(empty($data['user_id']) && !$data['auto_added'])
                return;

            $data['ip_address'] = isset($data["ip_address"])?:request()->ip();
            $data['ip_info'] =  self::getIpInfo($data['ip_address']);
            $data['device_info'] =  self::getDeviceInfo();

            Activity::create($data);

        }catch (\Exception $exception){
            Log::error("Error Method createActivity". $exception);
            return false;
        }
    }

    public static function saveChangeLogs($data_array){
        try{

            if(!is_array($data_array))
                return;

            foreach ($data_array as $data)
                Activity::create($data);

        }catch (\Exception $e){
            Log::error("Error Method saveChangeLog". $e);
        }
    }

    public static function fetchChangeLogDataFromRequestDataAndModel($request_data, $current_data, $optional = array())
    {

        try {
            $change_log = [];
            $model = get_class($current_data);
            $current_data = $current_data->toArray();

            if (!is_array($current_data) || !is_array($request_data))
                return $change_log;

           //IP Adress and info for request
            $ip_address = isset($optional["ip_address"]) ?: request()->ip();
            $ip_info = self::getIpInfo($ip_address);

            foreach ($request_data as $key => $value) {
                if (isset($current_data[$key]) && $current_data[$key] != $value) {
                    $change_log[] = array(
                        "type" => config('constants.TYPE_CHANGE_LOG'),
                        "event" => self::getChangeLogDataForm($model) . " Updated",
                        "original_value" => $current_data[$key],
                        "new_value" => $value,
                        "model_name" => $model,
                        "model_id" => $current_data['id'],
                        "trial_id" => isset($optional['trial_id']) ?: null,
                        "user_id" => Auth::user()->id,
                        "data_form" => self::getChangeLogDataForm($model),
                        "data_field" => $key,
                        "description" => self::getChangeLogCustomDescription($model, $key, $current_data[$key], $value),
                        "reason" => isset($optional['reason']) ?: null,
                        "activity_date" => Carbon::now()->setTimezone(current_user_time_zone())->format("Y-m-d H:i:s O"),
                        "ip_address" => $ip_address,
                        "ip_info" => $ip_info

                    );
                }
            }
            return $change_log;
        }catch (\Exception $exception){
            Log::error("Error Method saveChangeLog". $exception);
            return [];

        }
    }

    public static function getChangeLogCustomDescription($model, $field, $current_value, $new_value){
        $description = str_replace("_", " ", $field)." has been updated from ".$current_value." to ".$new_value;
        try{
//            any custom messages for any field will go here
            switch ($model)
            {
                case Trial::class:
                        // Any custom message will go here
                    break;

            }

            return $description;
        }catch (\Exception $e){
            return $description;
        }
    }

    public static function getChangeLogDataForm($model){
        switch ($model){
            case  Trial::class;
                return "Trial Management";
            case  Language::class;
                return "Language Management";
            case  Role::class;
                return "Role Management";
            case  Sponsor::class;
                return "Sponsor Management";
            case  TrialSiteLocation::class;
                return "Trial Site Location Management";
            case  User::class;
                return "User Management";
        }

        return $model;
    }

    public static function getIpInfo($ip_address){

        try{
           return json_decode(file_get_contents("http://ipinfo.io/{$ip_address}/json"));
        }catch (\Exception $exception){
            Log::error("Error Method getIpInfo". $exception);
            return "";
        }
    }

    public static function getDeviceInfo(){

        try{
            $agent = new Agent();
            $agent->setUserAgent(request()->header('Custom-User-Agent'));
            $browserPlatform = null;
            if($agent->browser() && $agent->platform()){
                $browserPlatform = $agent->browser() . ' on ' .  $agent->platform();
            }
            return [
                'device' => $agent->device() == false ? null : $agent->device(),
                'platform' => $agent->platform() == false ? null : $agent->platform(),
                'browser' => $agent->browser() == false ? null : $agent->browser(),
                'browser_platform' => $browserPlatform,
            ];
        }catch (\Exception $exception){
            Log::error("Error Method getDeviceInfo". $exception);
            return "";
        }
    }

    public static function getName($id,$class)
    {
        $response = $data = null;
        switch ($class)
        {
            case 'role':
                $data = CustomRole::whereId($id)->first();
                break;
            case 'trial':
                $data = Trial::whereId($id)->first();
                break;
            case 'service':
                $data = Service::whereId($id)->first();
                break;
        }
        if(!empty($data)){
            $response = $data->name;
        }
        return $response;
    }

}
