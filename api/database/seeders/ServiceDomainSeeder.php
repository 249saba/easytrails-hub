<?php

namespace Database\Seeders;

use App\Models\Service;
use App\Models\ServiceDomain;
use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ServiceDomainSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        ServiceDomain::truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
        $services = Service::whereNot('short_code','trial')->get();
        foreach($services as $service)
        {
            ServiceDomain::create([
                'service_id' => $service->id,
                'sub_domain' => $service->short_code,
                'api_sub_domain' => $service->short_code,
                'slug' => $service->short_code
            ]);
        }
    }
}
