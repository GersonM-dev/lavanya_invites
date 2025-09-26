<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->foreignId('invitation_id')->constrained('invitations')->cascadeOnDelete();
            $table->enum('event_type', ['ceremony', 'reception']);
            $table->timestampTz('start_at');
            $table->timestampTz('end_at')->nullable();
            $table->foreignId('location_id')->nullable()->constrained('locations')->nullOnDelete();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->unique(['invitation_id', 'event_type']);
            $table->index(['invitation_id', 'event_type']);
        });
    }
    public function down(): void {
        Schema::dropIfExists('events');
    }
};
