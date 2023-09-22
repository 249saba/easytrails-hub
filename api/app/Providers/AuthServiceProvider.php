<?php

namespace App\Providers;

// use Illuminate\Support\Facades\Gate;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Jenssegers\Agent\Agent;
use Laravel\Passport\Passport;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        // 'App\Models\Model' => 'App\Policies\ModelPolicy',
    ];

    /**
     * Register any authentication / authorization services.
     *
     * @return void
     */
    public function boot()
    {
        $this->registerPolicies();
        $agent = new Agent();
        $value = 60;
        if($agent->isPhone()){
            $value = 20;
        }
        Passport::tokensExpireIn(now()->addMinutes($value));
        Passport::refreshTokensExpireIn(now()->addMinutes($value));
        Passport::personalAccessTokensExpireIn(now()->addMinutes($value));
    }
}
