<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Models\Sponsor;
use App\Http\Resources\SponsorResource;
use App\Http\Resources\SponsorCollection;

class SponsorController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return SponsorCollection
     */
    public function index(Request $request)
    {
        $sponsors = Sponsor::withCount('trials')->filter($request);
        if($request->has('per_page')){
            $sponsors = $sponsors->paginate($request->per_page ?? 10);
        }else{
            $sponsors = $sponsors->get();
        }
        return new SponsorCollection($sponsors);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @return SponsorResource
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:sponsors',
        ]);
        $requestData = $request->all();
        $requestData['active'] = true;
        $requestData['created_by'] = auth()->id();
        $sponsor = Sponsor::create($requestData);
        //record Activity log
        save_activity_log([
            "user_id"=>auth()->id(),
            "event"=>'Sponsor '.config('constants.EVENT_NEW_DATA_ADDED'),
            "description"=>'Sponsor '.config('constants.EVENT_NEW_DATA_ADDED'),
            "model_name"=>Sponsor::class,
            "model_id" => $sponsor->id,
            "activity_date"=>Carbon::now()->setTimezone(current_user_time_zone())->format("Y-m-d H:i:s O")
        ]);
        return (new SponsorResource($sponsor))->setMessage(trans('text.created',['attribute' => 'Sponsor']));
    }

    /**
     * Display the specified resource.
     *
     * @param Sponsor $sponsor
     * @return SponsorResource
     */
    public function show(Sponsor $sponsor)
    {
        $sponsor->loadCount('trials');
        return new SponsorResource($sponsor);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param Request $request
     * @param Sponsor $sponsor
     * @return SponsorResource
     */
    public function update(Request $request, Sponsor $sponsor)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:sponsors,name,' . $sponsor->id,
        ]);
        $requestData = $request->all();
        $requestData['updated_by'] = auth()->id();
        //Get changelog data before update
        $activity_data = fetch_change_log_from_requested_data_and_model($requestData, $sponsor);
        $sponsor->update($requestData);
        //Save changelog data after updated on server
        save_change_log($activity_data);
        return (new SponsorResource($sponsor))->setMessage(trans('text.updated',['attribute' => 'Sponsor']));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Sponsor $sponsor
     * @return JsonResponse
     * @throws Exception
     */
    public function destroy(Sponsor $sponsor)
    {
        $sponsor->delete();
        //record Activity log
        save_activity_log([
            "user_id"=>auth()->id(),
            "event"=>'Sponsor '.config('constants.EVENT_DATA_DELETED'),
            "description"=>'Sponsor '.config('constants.EVENT_DATA_DELETED'),
            "model_name"=>Sponsor::class,
            "model_id" => $sponsor->id,
            "activity_date"=>Carbon::now()->setTimezone(current_user_time_zone())->format("Y-m-d H:i:s O")
        ]);
        return response()->json([
            'success' => true,
            'message' => trans('text.deleted',['attribute' => 'Sponsor']),
            'meta' => null,
            'errors' => null
        ], 200);
    }

    public function changeStatus(Request $request,Sponsor $sponsor)
    {
        $request->validate([
            'status' => 'required'
        ]);
        $requestData = $request->all();
        $status = $request->status == 'active' ? true : false;
        //Get changelog data before update
        $activity_data = fetch_change_log_from_requested_data_and_model($requestData, $sponsor);
        $sponsor->update([
            'active' => $status
        ]);
        //Save changelog data after updated on server
        save_change_log($activity_data);
        return response()->json([
            'success' => true,
            'message' => 'Status changed successfully.',
            'meta' => null,
            'errors' => null
        ], 200);
    }

}
