<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/
Route::group(['namespace' => 'Api'], function () {
    Route::post('login', 'AuthController@login');
    Route::post('forgot-password', 'AuthController@forgotPwd');
    Route::post('reset-password', 'AuthController@resetPwd');
    Route::post('set-password', 'AuthController@setPwd');
    Route::get('find-token', 'AuthController@findToken');
    Route::group(['middleware' => ['auth:api']], function () {
        Route::post('logout', 'AuthController@logout');
        Route::get('users/export', 'UserController@export');
        Route::apiResource('users', UserController::class);
        Route::apiResource('countries', CountryController::class);
        Route::apiResource('timezones', TimezoneController::class);
        Route::get('service-data/{service}','ServiceController@getServiceData');
        Route::apiResource('services', ServiceController::class);
        Route::apiResource('trials', TrialController::class);
        Route::apiResource('sponsors', SponsorController::class);
        Route::apiResource('trial-site-locations', TrialSiteLocationController::class);
        Route::apiResource('activities', ActivityController::class);
        Route::apiResource('languages', LanguageController::class);
        Route::apiResource('roles', RoleController::class);
        Route::get('all-permissions', 'RoleController@getPermissions');
        Route::get('user-list-count', 'UserController@getUserStatusCount');
        Route::post('change-password/{user}', 'UserController@changePwd');
        Route::post('user-image-upload/{user}', 'UserController@uploadImage');
        Route::get('users/edit/{user}', 'UserController@edit');
        Route::put('users/change-status/{user}', 'UserController@changeStatus');
        Route::put('sponsors/change-status/{sponsor}', 'SponsorController@changeStatus');
        Route::put('trials/change-status/{trial}', 'TrialController@changeStatus');
        Route::put('roles/change-status/{role}', 'RoleController@changeStatus');
        Route::get('trials/edit/{trial}', 'TrialController@edit');
        Route::post('users/re-invite/{user}', 'UserController@reInvite');
        Route::get('users/trial-services/{user}', 'UserController@trialServices');
        Route::get('service-login/{id}/{type}', 'AuthController@loginToService');
    });
});
