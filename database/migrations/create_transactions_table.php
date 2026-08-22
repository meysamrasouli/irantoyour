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
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->string('transactionable_type', 255);
            $table->integer('transactionable_id');
            $table->string('gateway', 255);
            $table->integer('amount');
            $table->string('ref_id', 255)->nullable();
            $table->string('tracking_code', 255)->nullable();
            $table->string('card_number', 255)->nullable();
            $table->string('result_code', 255)->nullable();
            $table->string('result_message', 255)->nullable();
            $table->json('result_bank_log')->nullable();
            $table->string('ip', 20);
            $table->string('status', 20);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
