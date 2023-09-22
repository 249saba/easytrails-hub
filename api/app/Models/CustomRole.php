<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Role;

class CustomRole extends Role
{
    use HasFactory, SoftDeletes;

    protected $table = 'roles';

    public function service()
    {
        return $this->belongsTo(Service::class);
    }

    public function scopeFilter($query, $request = null)
    {
        $requestData = $request->all();
        DB::enableQueryLog();
        if (!empty($request->service_id)) {
            $query = $query->where('service_id',$request->service_id);
        }
        /*$query->get();
        dd(DB::getQueryLog());*/
        return $query;
    }
}
