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
        Schema::create('trial_languages', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('trial_id')->nullable();
            $table->unsignedBigInteger('language_id')->nullable();

            $table->timestamps();
            $table->softDeletes();

            $table->foreign('trial_id')->references('id')->on('trials')->onDelete('cascade');
            $table->foreign('language_id')->references('id')->on('languages')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('trial_languages');
    }
};
