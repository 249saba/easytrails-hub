<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Models\Language;
use App\Http\Resources\LanguageResource;
use App\Http\Resources\LanguageCollection;

class LanguageController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return LanguageCollection
     */
    public function index(Request $request)
    {
        $languages = Language::filter($request);
        if($request->has('per_page')){
            $languages = $languages->paginate($request->per_page ?? 10);
        }else{
            $languages = $languages->get();
        }
        return new LanguageCollection($languages);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @return LanguageResource
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:255',
        ]);
        $requestData = $request->all();
        $requestData['created_by'] = auth()->id();
        $language = Language::create($requestData);
        //record Activity log
        save_activity_log([
            "user_id"=>auth()->id(),
            "event"=>'Language '.config('constants.EVENT_NEW_DATA_ADDED'),
            "description"=>'Language '.config('constants.EVENT_NEW_DATA_ADDED'),
            "model_name"=>Language::class,
            "model_id" => $language->id,
            "activity_date"=>Carbon::now()->setTimezone(current_user_time_zone())->format("Y-m-d H:i:s O")
        ]);
        return (new LanguageResource($language))->setMessage(trans('text.created',['attribute' => 'Language']));
    }

    /**
     * Display the specified resource.
     *
     * @param Language $language
     * @return LanguageResource
     */
    public function show(Language $language)
    {
        return new LanguageResource($language);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param Request $request
     * @param Language $language
     * @return LanguageResource
     */
    public function update(Request $request, Language $language)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:255',
        ]);
        $requestData = $request->all();
        $requestData['updated_by'] = auth()->id();
        //Get changelog data before update
        $activity_data = fetch_change_log_from_requested_data_and_model($requestData, $language);
        $language->update($requestData);
        //Save changelog data after updated on server
        save_change_log($activity_data);
        return (new LanguageResource($language))->setMessage(trans('text.updated',['attribute' => 'Language']));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param Language $language
     * @return JsonResponse
     * @throws Exception
     */
    public function destroy(Language $language)
    {
        $language->delete();
        //record Activity log
        save_activity_log([
            "user_id"=>auth()->id(),
            "event"=>'Language '.config('constants.EVENT_DATA_DELETED'),
            "description"=>'Language '.config('constants.EVENT_DATA_DELETED'),
            "model_name"=>Language::class,
            "model_id" => $language->id,
            "activity_date"=>Carbon::now()->setTimezone(current_user_time_zone())->format("Y-m-d H:i:s O")
        ]);
        return response()->json([
            'success' => true,
            'message' => trans('text.deleted',['attribute' => 'Language']),
            'meta' => null,
            'errors' => null
        ], 200);
    }
}
