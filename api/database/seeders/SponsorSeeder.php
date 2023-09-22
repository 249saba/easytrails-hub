<?php

namespace Database\Seeders;

use App\Models\Sponsor;
use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SponsorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Sponsor::insert([
            'name' => 'Sponsor 1',
            'active' => true,
            'created_at' => Carbon::now()->format('Y-m-d H:i:s'),
        ]);
    }
}
