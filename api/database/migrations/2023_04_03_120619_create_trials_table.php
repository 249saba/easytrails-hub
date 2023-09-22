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
        Schema::create('trials', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('sponsor_id')->nullable();

            $table->text('name')->nullable();
            $table->string('email')->nullable();
            $table->boolean('active')->default(false);

            $table->string('recruitment_url')->nullable();
            $table->string('study_number')->nullable();
            $table->string('contact_number')->nullable();
            $table->string('short_code')->nullable();

            $table->string('app_name')->nullable();
            $table->string('app_store_url')->nullable();
            $table->string('play_store_url')->nullable();

            $table->text('description')->nullable();
            $table->boolean('has_appointment_locations')->nullable();

            $table->timestamps();
            $table->softDeletes();

            $table->foreign('sponsor_id')->references('id')->on('sponsors')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('trials');
    }
};
