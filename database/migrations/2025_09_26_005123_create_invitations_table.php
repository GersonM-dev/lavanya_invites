<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('invitations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('groom_id')->constrained('grooms');
            $table->foreignId('bride_id')->constrained('brides');
            $table->date('wedding_date')->nullable(); // headline date (optional)
            $table->foreignId('design_id')->nullable()->constrained('designs')->nullOnDelete();
            $table->foreignId('quote_id')->nullable()->constrained('quotes')->nullOnDelete();
            $table->string('slug')->unique()->nullable(); // for public URL
            $table->timestamps();

            $table->index(['groom_id', 'bride_id']);
        });
    }
    public function down(): void {
        Schema::dropIfExists('invitations');
    }
};
