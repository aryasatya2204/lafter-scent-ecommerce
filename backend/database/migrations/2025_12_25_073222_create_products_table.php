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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('shop_id')->constrained('shops')->onDelete('cascade');
            $table->string('name');
            $table->string('slug'); // Unique check di level aplikasi per shop
            $table->string('brand')->nullable();
            $table->text('description')->nullable();
            $table->decimal('base_price', 15, 2); // Harga display
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            
            // Index untuk pencarian cepat
            $table->index(['shop_id', 'slug']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
