<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Chat extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    protected $casts = [
        'is_read' => 'boolean',
    ];

    // Pengirim
    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id');
    }

    // Penerima
    public function receiver()
    {
        return $this->belongsTo(User::class, 'receiver_id');
    }

    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}