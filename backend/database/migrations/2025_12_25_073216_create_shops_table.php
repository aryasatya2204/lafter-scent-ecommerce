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
        Schema::create('shops', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade')->unique(); // 1 User = 1 Shop
            $table->string('name');
            $table->string('slug')->unique();
            $table->integer('city_id'); // Origin pengiriman (RajaOngkir)
            $table->text('description')->nullable();
            $table->enum('status', ['pending', 'active', 'suspended'])->default('pending');
            $table->jsonb('verification_data')->nullable(); // Foto KTP dll
            $table->text('payment_config')->nullable(); // ENCRYPTED JSON STRING
            $table->integer('shipping_markup_rate')->default(0); // Persentase markup
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shops');
    }
};
