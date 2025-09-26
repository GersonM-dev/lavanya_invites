<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('brides', function (Blueprint $table) {
            $table->id();
            $table->string('full_name');
            $table->string('nick_name')->nullable();
            $table->unsignedInteger('child_order')->nullable();
            $table->string('father_name')->nullable();
            $table->string('mother_name')->nullable();
            $table->text('address')->nullable();
            $table->string('instagram_username')->nullable();
            $table->timestamps();
        });
    }
    public function down(): void {
        Schema::dropIfExists('brides');
    }
};
