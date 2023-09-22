<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\AsArrayObject;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\DB;

class Activity extends Model
{
    use HasFactory, SoftDeletes;

    protected $casts = [
        'ip_info' => AsArrayObject::class,
        'device_info' => 'array',
    ];

    protected $fillable = ['user_id', 'trial_id', 'description','event', 'type','activity_date','title', 'model_name', 'model_id', 'data_form', 'data_field', 'ip_address', 'ip_info'
    ,'original_value', 'new_value', 'reason' , 'device_info'];

    protected $appends = ['user_data','model_data'];

    public function getUserDataAttribute()
    {
        $userData = [];
        if(!empty($this->user_id)){
            $user = User::where('id',$this->user_id)->first();
            if(!empty($user)){
                $userData = [
                    'name' => $user->name,
                    'avatar' => $user->avatar ?? null,
                ];
            }
        }
        return $userData;
    }

    public function getModelDataAttribute()
    {
        $modelData = [];
        if(!empty($this->model_id) && !empty($this->model_name)){
            if($this->model_name == 'App\Models\User'){
                $user = User::where('id',$this->model_id)->first();
                if(!empty($user)){
                    $modelData = [
                        'name' => $user->name,
                        'avatar' => $user->avatar ?? null,
                    ];
                }
            }
        }
        return $modelData;
    }


    public function scopeFilter($query, $request = null)
    {
        $requestData = $request->all();
        DB::enableQueryLog();
        if (!empty($request->user_id) && $request->user_id != 'null' ) {
            //$query = $query->where('user_id',$request->user_id);
            $query = $query->where('user_id', $request->user_id)
                ->orWhere(function ($query) use ($request) {
                $query->where('model_name', 'App\Models\User')
                    ->where('model_id', $request->user_id);
            });
        }
        /*$query->get();
        dd(DB::getQueryLog());*/
        return $query;
    }

}
