<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\DB;

class Trial extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name', 'sponsor_id', 'email', 'recruitment_url', 'study_number', 'contact_number',
        'active', 'short_code', 'app_name', 'app_store_url', 'play_store_url',
        'description', 'has_appointment_locations'
    ];

    public function sponsor()
    {
        return $this->belongsTo(Sponsor::class,'sponsor_id');
    }

    public function services()
    {
        return $this->belongsToMany(Service::class,'trial_services');
    }

    public function countries()
    {
        return $this->belongsToMany(Country::class,'trial_countries');
    }

    public function languages()
    {
        return $this->belongsToMany(Language::class,'trial_languages');
    }

    public function domain()
    {
        return $this->hasOne(ServiceDomain::class);
    }

    public function scopeFilter($query, $request = null)
    {
        $requestData = $request->all();
        DB::enableQueryLog();
        if (!empty($request->keyword)) {
            $query = $query->where(function ($query) use ($request) {
                $query->orWhere('name', 'LIKE', '%'.$request->keyword.'%')
                    ->orWhere('study_number', 'LIKE', '%'.$request->keyword.'%')
                    ->orWhere(function ($query) use ($request) {
                        $query->whereHas('sponsor',function ($query) use ($request){
                            $query->orWhere('name', 'LIKE', '%'.$request->keyword.'%');
                        });
                    });
            });
        }
        if (!empty($request->sort_column) && !empty($request->sort_order)
            && $request->sort_column != '' && $request->sort_order != '')
        {
            if($request->sort_column != 'status'){
                $query = $query->orderBy('active',$request->sort_order);
            }else{
                $query = $query->orderBy($request->sort_column,$request->sort_order);
            }
        }
        /*$query->get();
        dd(DB::getQueryLog());*/
        return $query;
    }
}
