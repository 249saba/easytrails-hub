<?php

if (!function_exists('api_json_response')) {
    function api_json_response($status = 200, $success = true, $message = null, $data = [], $errors = null, $meta = null): \Illuminate\Http\JsonResponse
    {
        return response()->json([
            'data' => $data,
            'success' => $success,
            'message' => $message,
            'meta' => $meta,
            'errors' => $errors,
        ], $status)->setStatusCode($status, $message);
    }
}

if (!function_exists('current_user_time_zone')) {
    function current_user_time_zone()
    {
        try {
            $time_zone = \App\Models\Timezone::where("id", \Illuminate\Support\Facades\Auth::user()->timezone_id)->first();
            if (isset($time_zone->name)) return $time_zone->name;

            return \Illuminate\Support\Facades\Config::get('app.timezone');

        }catch (Exception $e) {
            return \Illuminate\Support\Facades\Config::get('app.timezone');
        }
    }
}
