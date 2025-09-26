<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('designs', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->text('description')->nullable();
            $table->string('main_sample_pict')->nullable();
            $table->string('secondary_sample_pict')->nullable();
            $table->string('third_sample_pict')->nullable();
            $table->string('sample_link')->nullable();
            $table->timestamps();
        });
    }
    public function down(): void {
        Schema::dropIfExists('designs');
    }
};
