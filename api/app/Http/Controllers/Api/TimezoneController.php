<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Models\Timezone;
use App\Http\Resources\TimezoneResource;
use App\Http\Resources\TimezoneCollection;

class TimezoneController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return TimezoneCollection
     */
    public function index(Request $request)
    {
        return new TimezoneCollection(Timezone::filter($request)->get());
    }
}
