<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserAddress extends Model
{
    use HasFactory;

    // Kita proteksi ID, sisanya mass assignable
    protected $guarded = ['id'];

    // Relasi balik ke User
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}