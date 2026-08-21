<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('mobile', length: 11)->unique();
            $table->string('first_name', length: 50);
            $table->string('last_name', length: 50);
            $table->string('national_code', length: 10);
            $table->string('email')->nullable()->unique();
            $table->integer('balance')->default(0)->comment('موجودی(تومان)');
            $table->string('sign_in_from', length: 50);
            $table->boolean('status')->default(true);
            $table->timestamp('membership_expires_at');
            $table->timestamps();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('sessions');
    }
};
