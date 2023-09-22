<?php

namespace Database\Seeders;

use App\Models\Country;
use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TimezonesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $timezones= json_decode(file_get_contents(resource_path('assets/zones.json'),true), true);
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('timezones')->truncate();
        $countries = Country::all();
        if (isset($countries) && $countries != null) {
            foreach ($countries as $country) {
                foreach ($timezones as $timezone) {
                    if ($country->code == $timezone['code']) {
                        DB::table('timezones')->insert([
                            'created_at' => Carbon::now()->format('Y-m-d H:i:s'),
                            'country_id' => $country->id,
                            'name' => $timezone['zone']
                        ]);
                    }
                }
            }
        }
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
    }
}
