<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('locations', function (Blueprint $table) {
            $table->id();
            $table->string('name')->nullable(); // e.g., Masjid / Gedung
            $table->string('address_line')->nullable();
            $table->string('city')->nullable();
            $table->string('province')->nullable();
            $table->string('postal_code')->nullable();
            $table->string('map_link')->nullable(); // Google Maps link
            $table->timestamps();
        });
    }
    public function down(): void {
        Schema::dropIfExists('locations');
    }
};
