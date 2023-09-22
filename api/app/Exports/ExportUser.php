<?php

namespace App\Exports;

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithTitle;

class ExportUser implements FromCollection,WithTitle
{

    public function title(): string
    {
        return 'Users Export';
    }

    /**
     * @return Collection
     */

    public function collection(): Collection
    {
        $request = request();
        $users = User::with('roles','country','timezone','services')
            ->withCount('services')->filter($request);
        $newUsers[] = [
            'Name',
            'Email',
            'Total Services',
            'Last Active',
            'Status',
        ];
        $users->get()->each(function ( $item ) use( &$newUsers){
            $newUsers[] = [
                $item->name,
                $item->email,
                $item->services_count == 0 ? '0' : $item->services_count,
                $item->last_login ? Carbon::parse($item->last_login)->diffForHumans() : '-',
                $item->status
            ];
        });
        return collect($newUsers);
    }
}
