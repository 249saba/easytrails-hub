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
        Schema::create('activities', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->nullable();
            $table->unsignedBigInteger('trial_id')->nullable();

            $table->string('activity_date')->nullable();

            $table->string('event')->nullable();
            $table->string('title')->nullable();
            $table->enum('type', ['note', 'change_log'])->default('note');
            $table->longText('description')->nullable();

            //Action taken on which model and which field
            $table->string('model_name')->nullable();
            $table->string('model_id')->nullable();

            //true if some action performed by system (eg via cron etc)
            $table->boolean('auto_added')->default(false);

            //fields for change logs, these will have value if type is change_log
            $table->string('original_value')->nullable();
            $table->string('new_value')->nullable();
            $table->string('data_form')->nullable();
            $table->string('data_field')->nullable();

            $table->mediumText('reason')->nullable();
            $table->string('ip_address')->nullable();

            $table->timestamps();
            $table->softDeletes();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
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
        Schema::dropIfExists('activities');
    }
};
