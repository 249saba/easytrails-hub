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
        Schema::create('trial_site_locations', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('trial_id')->nullable();

            $table->string('code')->nullable();
            $table->string('title')->nullable();
            $table->text('address')->nullable();

            $table->string('country_city')->nullable();
            $table->string('country_timezone')->nullable();
            $table->string('email_address')->nullable();

            $table->enum('consent_type',['eSignature','Manual Upload']);
            $table->boolean('manual_enrollment')->nullable();
            $table->string('phone_number')->nullable();


            $table->timestamps();
            $table->softDeletes();

            $table->foreign('trial_id')->references('id')->on('trials')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('trial_site_locations');
    }
};
