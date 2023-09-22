<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\DB;

class TrialSiteLocation extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'trial_id', 'code', 'title', 'address', 'country_id', 'timezone_id',
        'email_address', 'consent_type', 'manual_enrollment', 'phone_number',
    ];

    public function trial()
    {
        return $this->belongsTo(Trial::class,'trial_id');
    }

    public function country()
    {
        return $this->belongsTo(Country::class,'country_id');
    }

    public function timezone()
    {
        return $this->belongsTo(Timezone::class,'timezone_id');
    }

    public function scopeFilter($query, $request = null)
    {
        $requestData = $request->all();
        DB::enableQueryLog();
        if (!empty($request->trial_id) && $request->trial_id != 'all' ) {
            $query = $query->where('trial_id', '=', $request->trial_id);
        }
        return $query;
    }
}
