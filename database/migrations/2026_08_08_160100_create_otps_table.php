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
        Schema::create('otps', function (Blueprint $table) {
            $table->id();
            $table->string('mobile', length: 11)->unique();
            $table->string('ip', length: 20);
            $table->string('code', length: 5);
            $table->integer('attempt')->default(0)->comment('تعداد تلاشها');
            $table->integer('sent_count')->default(0)->comment('تعداد کل پیام های ارسالی برای کاربر');
            $table->integer('login_count')->default(0)->comment('تعداد کل دفعات login شدن کاربر');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('otps');
    }
};
