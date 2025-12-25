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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('invoice_number')->unique();
            $table->foreignId('user_id')->constrained('users'); // Pembeli
            $table->foreignId('shop_id')->constrained('shops'); // Penjual
            
            // Financials
            $table->decimal('total_price', 15, 2);
            $table->decimal('shipping_cost_real', 15, 2);
            $table->decimal('shipping_cost_client', 15, 2); // Ongkir Markup
            
            // Shipping Details
            $table->string('shipping_courier', 50); // jne
            $table->string('shipping_service', 50); // REG
            $table->jsonb('shipping_address_snapshot'); // Alamat user saat beli (Lengkap)
            $table->text('shipping_note')->nullable(); // Catatan pembeli
            
            // Statuses
            $table->enum('payment_status', ['unpaid', 'paid', 'expired', 'cancelled'])->default('unpaid');
            $table->enum('order_status', ['pending', 'processing', 'shipped', 'completed', 'cancelled'])->default('pending');
            
            $table->string('snap_token')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
