<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Models\Service;
use App\Http\Resources\ServiceResource;
use App\Http\Resources\ServiceCollection;

class ServiceController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return ServiceCollection
     */
    public function index(Request $request)
    {
        return new ServiceCollection(Service::all());
    }

    public function getServiceData(Service $service)
    {
        return api_json_response(200, true, trans('text.fetched',['attribute'=>'Service Data']), [
            'trials' => $service->trials,
            'roles' => $service->roles,
        ]);
    }
}
