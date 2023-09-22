<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Models\Activity;
use App\Http\Resources\ActivityResource;
use App\Http\Resources\ActivityCollection;

class ActivityController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return ActivityCollection
     */
    public function index(Request $request)
    {
        $activities = Activity::filter($request)->orderByDesc('created_at');
        if($request->has('per_page')){
            $activities = $activities->paginate($request->per_page ?? 10);
        }else{
            $activities = $activities->get();
        }
        return new ActivityCollection($activities);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @return ActivityResource
     */
    public function store(Request $request)
    {
        $requestData = $request->all();
        $activity = Activity::create($requestData);
        return (new ActivityResource($activity))->setMessage('Created!');
    }

    /**
     * Display the specified resource.
     *
     * @param Activity $activity
     * @return ActivityResource
     */
    public function show(Activity $activity)
    {
        return new ActivityResource($activity);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param Request $request
     * @param Activity $activity
     * @return ActivityResource
     */
    public function update(Request $request, Activity $activity)
    {
        $requestData = $request->all();
        $activity->update($requestData);
        return (new ActivityResource($activity))->setMessage('Updated!');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Activity $activity
     * @return JsonResponse
     * @throws Exception
     */
    public function destroy(Activity $activity)
    {
        $activity->delete();
        return response()->json([
            'success' => true,
            'message' => 'Deleted!',
            'meta' => null,
            'errors' => null
        ], 200);
    }
}
