<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    protected $casts = [
        'is_active' => 'boolean',
        'base_price' => 'decimal:2',
    ];

    // Relasi ke Toko
    public function shop()
    {
        return $this->belongsTo(Shop::class);
    }

    // Relasi ke Varian (Size & Stock)
    public function variants()
    {
        return $this->hasMany(ProductVariant::class);
    }

    // Relasi ke Gambar
    public function images()
    {
        return $this->hasMany(ProductImage::class);
    }
}