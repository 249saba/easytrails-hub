<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Permission\Models\Role;

class Service extends Model
{
    use HasFactory, SoftDeletes;

    public function trials()
    {
        return $this->belongsToMany(Trial::class,'trial_services');
    }

    public function roles()
    {
        return $this->hasMany(Role::class,'service_id');
    }

    public function domains()
    {
        return $this->hasMany(ServiceDomain::class);
    }

    public function domain()
    {
        return $this->hasOne(ServiceDomain::class);
    }
}
