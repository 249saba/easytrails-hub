<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Models\TrialSiteLocation;
use App\Http\Resources\TrialSiteLocationResource;
use App\Http\Resources\TrialSiteLocationCollection;

class TrialSiteLocationController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return TrialSiteLocationCollection
     */
    public function index(Request $request)
    {
        $trialSites = TrialSiteLocation::with('trial','country','timezone')->filter($request);
        if($request->has('per_page')){
            $trialSites = $trialSites->paginate($request->per_page ?? 10);
        }else{
            $trialSites = $trialSites->get();
        }
        return new TrialSiteLocationCollection($trialSites);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @return TrialSiteLocationResource
     */
    public function store(Request $request)
    {
        $request->validate([
            'trial_id' => 'required',
            'code' => 'required|string|max:255',
            'title' => 'required|string|max:255',
            'address' => 'required',
            'country_id' => 'required',
            'timezone_id' => 'required',
            'email_address' => 'required|string|email:rfc,dns|max:255',
            'consent_type' => 'required',
            'manual_enrollment' => 'required',
            'phone_number' => 'required|digits:10',
        ]);
        $requestData = $request->all();
        $trialSiteLocation = TrialSiteLocation::create($requestData);
        //record Activity log
        save_activity_log([
            "user_id"=>auth()->id(),
            "event"=>'Trial Site Location '.config('constants.EVENT_NEW_DATA_ADDED'),
            "description"=>'Trial Site Location '.config('constants.EVENT_NEW_DATA_ADDED'),
            "model_name"=>TrialSiteLocation::class,
            "model_id" => $trialSiteLocation->id,
            "activity_date"=>Carbon::now()->setTimezone(current_user_time_zone())->format("Y-m-d H:i:s O")
        ]);
        return (new TrialSiteLocationResource($trialSiteLocation))->setMessage(trans('text.created',['attribute' => 'Trial Site Location']));
    }

    /**
     * Display the specified resource.
     *
     * @param TrialSiteLocation $trialSiteLocation
     * @return TrialSiteLocationResource
     */
    public function show(TrialSiteLocation $trialSiteLocation)
    {
        $trialSiteLocation->load('trial','country','timezone');
        return new TrialSiteLocationResource($trialSiteLocation);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param Request $request
     * @param TrialSiteLocation $trialSiteLocation
     * @return TrialSiteLocationResource
     */
    public function update(Request $request, TrialSiteLocation $trialSiteLocation)
    {
        $request->validate([
            'trial_id' => 'required',
            'code' => 'required|string|max:255',
            'title' => 'required|string|max:255',
            'address' => 'required',
            'country_id' => 'required',
            'timezone_id' => 'required',
            'email_address' => 'required|string|email:rfc,dns|max:255',
            'consent_type' => 'required',
            'manual_enrollment' => 'required',
            'phone_number' => 'required|digits:10',
        ]);
        $requestData = $request->all();
        //Get changelog data before update
        $activity_data = fetch_change_log_from_requested_data_and_model($requestData, $trialSiteLocation);
        $trialSiteLocation->update($requestData);
        //Save changelog data after updated on server
        save_change_log($activity_data);
        return (new TrialSiteLocationResource($trialSiteLocation))->setMessage(trans('text.updated',['attribute' => 'Trial Site Location']));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param TrialSiteLocation $trialSiteLocation
     * @return JsonResponse
     * @throws Exception
     */
    public function destroy(TrialSiteLocation $trialSiteLocation)
    {
        $trialSiteLocation->delete();
        //record Activity log
        save_activity_log([
            "user_id"=>auth()->id(),
            "event"=>'Trial Site Location '.config('constants.EVENT_DATA_DELETED'),
            "description"=>'Trial Site Location '.config('constants.EVENT_DATA_DELETED'),
            "model_name"=>TrialSiteLocation::class,
            "model_id" => $trialSiteLocation->id,
            "activity_date"=>Carbon::now()->setTimezone(current_user_time_zone())->format("Y-m-d H:i:s O")
        ]);
        return response()->json([
            'success' => true,
            'message' => trans('text.deleted',['attribute' => 'Trial Site Location']),
            'meta' => null,
            'errors' => null
        ], 200);
    }
}
