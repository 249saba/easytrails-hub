<?php

namespace Database\Seeders;

use App\Models\Trial;
use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TrialsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $trialData = [
            [
                'sponsor_id' => 1,
                'name' => 'Trial 1',
                'email' => env("MAIL_FROM_ADDRESS"),
                'active' => true,
                'short_code' => 'trial-1',
                'created_at' => Carbon::now()->format('Y-m-d H:i:s'),
            ],[
                'sponsor_id' => 1,
                'name' => 'Trial 2',
                'email' => env("MAIL_FROM_ADDRESS"),
                'active' => true,
                'short_code' => 'trial-2',
                'created_at' => Carbon::now()->format('Y-m-d H:i:s'),
            ]
        ];
        Trial::insert($trialData);
        $trialServiceData = [
            [
                'trial_id' => 1,
                'service_id' => 1,
            ],[
                'trial_id' => 1,
                'service_id' => 2,
            ],
            [
                'trial_id' => 2,
                'service_id' => 1,
            ],[
                'trial_id' => 2,
                'service_id' => 2,
            ],
        ];
        DB::table('trial_services')->insert($trialServiceData);
    }
}
