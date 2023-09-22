<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('model_has_roles', function (Blueprint $table) {
            DB::statement("ALTER TABLE `model_has_roles` DROP PRIMARY KEY, ADD PRIMARY KEY (`role_id`, `model_id`, `model_type`, `trial_id`) USING BTREE;");
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('model_has_roles', function (Blueprint $table) {
            DB::statement("ALTER TABLE `model_has_roles` DROP PRIMARY KEY, ADD PRIMARY KEY (`role_id`, `model_id`, `model_type`) USING BTREE;");
        });
    }
};
