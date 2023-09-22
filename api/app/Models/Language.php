<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\DB;

class Language extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name', 'code',
        'created_by', 'updated_by',
    ];

    public function scopeFilter($query, $request = null)
    {
        $requestData = $request->all();
        DB::enableQueryLog();
        if (!empty($request->keyword)) {
            $query = $query->where(function ($query) use ($request) {
                $query->orWhere('name', 'LIKE', '%'.$request->keyword.'%')
                      ->orWhere('code', 'LIKE', '%'.$request->keyword.'%');
            });
        }
        if (!empty($request->sort_column) && !empty($request->sort_order)
            && $request->sort_column != '' && $request->sort_order != '')
        {
            $query = $query->orderBy($request->sort_column,$request->sort_order);
        }
        /*$query->get();
        dd(DB::getQueryLog());*/
        return $query;
    }
}
