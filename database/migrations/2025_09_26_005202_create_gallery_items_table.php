<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('gallery_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('invitation_id')->constrained('invitations')->cascadeOnDelete();
            $table->string('path'); // storage path or URL
            $table->enum('subject', ['groom','bride','couple'])->nullable();
            $table->enum('slot', ['main','secondary','third'])->nullable();
            $table->integer('sort_order')->default(0);
            $table->timestamps();

            $table->index(['invitation_id', 'subject', 'slot']);
            $table->unique(['invitation_id', 'subject', 'slot']); // enforce one slot per subject
        });
    }
    public function down(): void {
        Schema::dropIfExists('gallery_items');
    }
};
