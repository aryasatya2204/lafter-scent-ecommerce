<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Shop extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    // Casting data agar otomatis jadi Array/Object saat dipanggil
    protected $casts = [
        'verification_data' => 'array',
        'payment_config' => 'encrypted:array', 
        'shipping_markup_rate' => 'integer',
    ];

    // Relasi balik ke Owner
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}