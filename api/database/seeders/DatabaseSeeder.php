<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $this->call([
            RolesAndPermissionsSeeder::class,
            ServicesSeeder::class,
            CountriesSeeder::class,
            TimezonesSeeder::class,
            LanguagesSeeder::class,
            SponsorSeeder::class,
            TrialsSeeder::class,
            AdminUserSeeder::class,
        ]);
    }
}
