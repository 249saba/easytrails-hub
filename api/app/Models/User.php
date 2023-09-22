<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Notifications\ResetPasswordNotification;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\DB;
use Laravel\Passport\HasApiTokens;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable implements HasMedia
{
    use HasApiTokens, HasFactory, Notifiable, HasRoles, SoftDeletes, InteractsWithMedia;

    protected $guard_name = 'api';
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'first_name', 'last_name', 'email', 'password', 'country_id', 'timezone_id',
        'active', 'hub_admin', 'phone_number', 'last_login', 'login_attempts',
        'created_by', 'updated_by', 'pin_code', 'invited_by', 'invited_at', 'invite_token'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'invite_token'
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    protected $appends = [
        'status','name','avatar','services_count'
    ];

    public function country()
    {
        return $this->belongsTo(Country::class,'country_id');
    }

    public function timezone()
    {
        return $this->belongsTo(Timezone::class,'timezone_id');
    }

    public function roles(): BelongsToMany
    {
        $relation = $this->morphToMany(
            config('permission.models.role'),
            'model',
            config('permission.table_names.model_has_roles'),
            config('permission.column_names.model_morph_key'),
            PermissionRegistrar::$pivotRole
        )->withPivot('trial_id', 'service_id');

        if (!PermissionRegistrar::$teams) {
            return $relation;
        }

        return $relation->wherePivot(PermissionRegistrar::$teamsKey, getPermissionsTeamId())
            ->where(function ($q) {
                $teamField = config('permission.table_names.roles') . '.' . PermissionRegistrar::$teamsKey;
                $q->whereNull($teamField)->orWhere($teamField, getPermissionsTeamId());
            });
    }

    public function services()
    {
        return $this->belongsToMany('App\Models\Service',
            'model_has_roles',
            'model_id',
            'service_id')->distinct();
    }

    public function trials()
    {
        return $this->belongsToMany('App\Models\Trial',
            'model_has_roles',
            'model_id',
            'trial_id')->distinct();
    }

    public function sendPasswordResetNotification($token)
    {
        $url = env('APP_URL').'/reset-password/'.$token;
        $this->notify(new ResetPasswordNotification($url));
    }

    public function scopeFilter($query, $request = null)
    {
        $requestData = $request->all();
        DB::enableQueryLog();
        if (!empty($request->keyword)) {
            $query = $query->where(function ($query) use ($request) {
                $query->orWhere('first_name', 'LIKE', '%'.$request->keyword.'%')
                    ->orWhere('last_name', 'LIKE', '%'.$request->keyword.'%')
                    ->orWhere('email', 'LIKE', '%'.$request->keyword.'%');
            });
        }
        if (!empty($request->status) && $request->status != 'null' && $request->status != 'all') {
            if($request->status == 'active' || $request->status == 'inactive'){
                $request->status = $request->status == 'active' ? true : false;
                $query = $query->whereNotNull('password')->where('active',$request->status);
            }else if($request->status == 'never-logged-in'){
                $query = $query->whereNotNull('password')->whereNull('last_login');
            }else if($request->status == 'invited'){
                $query = $query->whereNull('password');
            }
        }
        if (!empty($request->service_id) && $request->service_id != 'all' ) {
            $query = $query->where(function ($query) use ($request) {
                $query->whereHas('services',function ($query) use ($request){
                    $query->where('service_id', '=', $request->service_id);
                });
            });
        }
        if (!empty($request->sort_column) && !empty($request->sort_order)
            && $request->sort_column != '' && $request->sort_order != '' && $request->sort_column != 'status') {
            $query = $query->orderBy($request->sort_column,$request->sort_order);
        }
        /*$query->get();
        dd(DB::getQueryLog());*/
        return $query;
    }

    public function getStatusAttribute()
    {
        $status = null;
        if(empty($this->password)){
            $status = 'invited';
        }else{
            if(empty($this->last_login))
            {
                $status = 'never-logged-in';
            }else{
                $status = $this->active == true ? 'active' : 'inactive';
            }
        }
        return $status;
    }

    public function getNameAttribute()
    {
        return $this->first_name.' '.$this->last_name;
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('avatar')
            ->acceptsMimeTypes(['image/jpeg'])
            ->singleFile();
    }

    public function getAvatarAttribute()
    {
        return $this->getFirstMediaUrl('avatar');
    }

    public function getServicesCountAttribute()
    {
        return count($this->services);
    }
}
