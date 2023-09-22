<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Sponsor extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'active',
        'created_by','updated_by'
    ];

    public function scopeActive($query)
    {
        $query->where('active',true);
        return $query;
    }

    public function trials()
    {
        return $this->hasMany(Trial::class);
    }

    public function scopeFilter($query, $request = null)
    {
        $requestData = $request->all();
        DB::enableQueryLog();
        if (!empty($request->keyword)) {
            $query = $query->where(function ($query) use ($request) {
                $query->orWhere('name', 'LIKE', '%'.$request->keyword.'%');
            });
        }
        if (!empty($request->sort_column) && !empty($request->sort_order)
            && $request->sort_column != '' && $request->sort_order != '')
        {
            if($request->sort_column != 'status'){
                $query = $query->orderBy('active',$request->sort_order);
            }else{
                $query = $query->orderBy($request->sort_column,$request->sort_order);
            }
        }
        /*$query->get();
        dd(DB::getQueryLog());*/
        return $query;
    }
}
