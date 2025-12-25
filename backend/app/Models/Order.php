<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    protected $casts = [
        'total_price' => 'decimal:2',
        'shipping_cost_real' => 'decimal:2',
        'shipping_cost_client' => 'decimal:2',
        'shipping_address_snapshot' => 'array', 
    ];

    // Pembeli
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Penjual
    public function shop()
    {
        return $this->belongsTo(Shop::class);
    }

    // Item Belanjaan
    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }
}