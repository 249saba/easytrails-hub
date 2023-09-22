<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\RoleCollection;
use App\Http\Resources\RoleResource;
use App\Models\CustomRole;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Exception;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return RoleCollection
     */
    public function index(Request $request)
    {
        $roles = CustomRole::filter($request)->with('service', 'permissions');
        if($request->has('per_page')){
            $roles = $roles->paginate($request->per_page ?? 10);
        }else{
            $roles = $roles->get();
        }
        return new RoleCollection($roles);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @return RoleResource
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'service_id' => 'required',
            'permissions' => 'required|array',
        ]);
        $requestData = $request->all();
        $requestData['label'] = strtolower(str_replace(' ','-',$request->name));
        $requestData['guard_name'] = 'api';
        $requestData['active'] = true;
        $requestData['created_by'] = auth()->id();
        $role = CustomRole::create($requestData);
        if($request->permissions){
            $role->syncPermissions($request->permissions);
        }
        //record Activity log
        save_activity_log([
            "user_id"=>auth()->id(),
            "event"=>'Role '.config('constants.EVENT_NEW_DATA_ADDED'),
            "description"=>'Role '.config('constants.EVENT_NEW_DATA_ADDED'),
            "model_name"=>CustomRole::class,
            "model_id" => $role->id,
            "activity_date"=>Carbon::now()->setTimezone(current_user_time_zone())->format("Y-m-d H:i:s O")
        ]);
        return (new RoleResource($role))->setMessage(trans('text.created',['attribute' => 'Role']));
    }

    /**
     * Display the specified resource.
     *
     * @param CustomRole $role
     * @return RoleResource
     */
    public function show(CustomRole $role)
    {
        $role->load('service', 'permissions');
        return new RoleResource($role);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param Request $request
     * @param CustomRole $role
     * @return RoleResource
     */
    public function update(Request $request, CustomRole $role)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'service_id' => 'required',
            'permissions' => 'required|array',
        ]);
        $requestData = $request->all();
        $requestData['updated_by'] = auth()->id();
        //Get changelog data before update
        $activity_data = fetch_change_log_from_requested_data_and_model($requestData, $role);
        $role->update($requestData);
        if($request->permissions){
            $role->syncPermissions($request->permissions);
        }
        //Save changelog data after updated on server
        save_change_log($activity_data);
        return (new RoleResource($role))->setMessage(trans('text.updated',['attribute' => 'Role']));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param CustomRole $role
     * @return JsonResponse
     * @throws Exception
     */
    public function destroy(CustomRole $role)
    {
        $role->delete();
        //record Activity log
        save_activity_log([
            "user_id"=>auth()->id(),
            "event"=>'Role '.config('constants.EVENT_DATA_DELETED'),
            "description"=>'Role '.config('constants.EVENT_DATA_DELETED'),
            "model_name"=>CustomRole::class,
            "model_id" => $role->id,
            "activity_date"=>Carbon::now()->setTimezone(current_user_time_zone())->format("Y-m-d H:i:s O")
        ]);
        return response()->json([
            'success' => true,
            'message' => trans('text.deleted',['attribute' => 'Role']),
            'meta' => null,
            'errors' => null
        ], 200);
    }

    public function getPermissions()
    {
        $permissions = Permission::orderBy('order_number')->get();
        return api_json_response(200, true, null, $permissions);
    }

    public function changeStatus(Request $request,CustomRole $role)
    {
        $request->validate([
            'status' => 'required'
        ]);
        $requestData = $request->all();
        $status = $request->status == 'active' ? true : false;
        //Get changelog data before update
        $activity_data = fetch_change_log_from_requested_data_and_model($requestData, $role);
        $role->update([
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
