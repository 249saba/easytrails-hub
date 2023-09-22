<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\DB;

class Timezone extends Model
{
    use HasFactory, SoftDeletes;

    public function scopeFilter($query, $request = null)
    {
        $requestData = $request->all();
        DB::enableQueryLog();
        if (!empty($request->country_id) && $request->country_id != 'null') {
            $query = $query->where('country_id',$request->country_id);
        }
        /*$query->get();
        dd(DB::getQueryLog());*/
        return $query;
    }
}
