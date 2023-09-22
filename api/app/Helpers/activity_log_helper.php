<?php
/**
 * Created by PhpStorm.
 * User: USER
 * Date: 4/17/2023
 * Time: 11:58 PM
 */


if (!function_exists('save_activity_log')) {
    function save_activity_log($activity_date = [])
    {
        \App\Helpers\Activity\ActivityHelpers::createActivity($activity_date);
    }
}

if (!function_exists('save_change_log')) {
    function save_change_log($activity_data = [])
    {
        \App\Helpers\Activity\ActivityHelpers::saveChangeLogs($activity_data);
    }
}

if (!function_exists('fetch_change_log_from_requested_data_and_model')) {
    function fetch_change_log_from_requested_data_and_model($request_data, $current_data, $optional =array())
    {
        return \App\Helpers\Activity\ActivityHelpers::fetchChangeLogDataFromRequestDataAndModel($request_data, $current_data, $optional);

    }
}

if (!function_exists('get_name')) {
    function get_name($id, $class)
    {
        return \App\Helpers\Activity\ActivityHelpers::getName($id, $class);

    }
}
