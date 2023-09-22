<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
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
        Schema::table('trial_site_locations', function (Blueprint $table) {
            $table->dropColumn(['country_city','country_timezone']);
            $table->unsignedBigInteger('country_id')->nullable()->after('address');
            $table->unsignedBigInteger('timezone_id')->nullable()->after('country_id');
            $table->foreign('country_id')->references('id')->on('countries')->onDelete('cascade');
            $table->foreign('timezone_id')->references('id')->on('timezones')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('trial_site_locations', function (Blueprint $table) {
            $table->string('country_city')->nullable();
            $table->string('country_timezone')->nullable();
        });
    }
};
