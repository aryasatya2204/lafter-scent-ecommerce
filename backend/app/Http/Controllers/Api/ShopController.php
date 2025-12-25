<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Shop;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class ShopController extends Controller
{
    public function store(Request $request)
    {
        // 1. Cek apakah user sudah punya toko?
        // (Mencegah 1 user punya 2 toko via API Abuse)
        if ($request->user()->shop) {
            return response()->json([
                'status' => 'error',
                'message' => 'Anda sudah memiliki toko.'
            ], 400);
        }

        // 2. Validasi Input
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:shops,name',
            'city_id' => 'required|integer', // Nanti diambil dari RajaOngkir
            'description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        // 3. Buat Slug Otomatis (Nama Toko: "Toko Budi" -> Slug: "toko-budi")
        $slug = Str::slug($request->name);
        
        // Cek unikan slug (jaga-jaga duplicate slug)
        if (Shop::where('slug', $slug)->exists()) {
            $slug = $slug . '-' . time();
        }

        // 4. Simpan ke Database
        $shop = Shop::create([
            'user_id' => $request->user()->id,
            'name' => $request->name,
            'slug' => $slug,
            'city_id' => $request->city_id,
            'description' => $request->description,
            'status' => 'active', // Kita set ACTIVE dulu agar bisa langsung dites (Production nanti 'pending')
            'shipping_markup_rate' => 0,
            'payment_config' => [], // Default kosong, otomatis ter-enkripsi oleh Model
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Toko berhasil dibuat',
            'data' => $shop
        ], 201);
    }
}