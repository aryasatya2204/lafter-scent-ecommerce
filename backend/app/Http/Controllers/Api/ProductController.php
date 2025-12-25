<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\ProductImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    // 1. LIST PRODUK (Milik Toko yang sedang Login)
    public function index(Request $request)
    {
        $user = $request->user();
        
        // Ambil produk milik toko user ini, lengkap dengan gambar & varian
        $products = Product::where('shop_id', $user->shop->id)
            ->with(['images', 'variants'])
            ->latest()
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $products
        ]);
    }

    // 2. CREATE PRODUK BARU
    public function store(Request $request)
    {
        // A. Validasi Input
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'image' => 'required|image|mimes:jpeg,png,jpg|max:2048', // Max 2MB
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'errors' => $validator->errors()], 422);
        }

        $user = $request->user();

        // B. Mulai Transaksi Database (Semua sukses atau Semua gagal)
        try {
            DB::beginTransaction();

            // 1. Buat Data Produk Utama
            $product = Product::create([
                'shop_id' => $user->shop->id,
                'name' => $request->name,
                'slug' => Str::slug($request->name) . '-' . Str::random(5),
                'description' => $request->description,
                'base_price' => $request->price,
                'is_active' => true,
            ]);

            // 2. Buat 1 Varian Default (Misal: All Size)
            // Sistem kita support multi-varian, tapi untuk MVP kita buat 1 varian dulu per produk.
            ProductVariant::create([
                'product_id' => $product->id,
                'size' => 'All Size',
                'name' => 'Default',
                'price' => $request->price,
                'stock' => $request->stock,
            ]);

            // 3. Handle Upload Gambar
            if ($request->hasFile('image')) {
                // Upload file ke folder 'public/products'
                $path = $request->file('image')->store('products', 'public');

                // Simpan info path ke database
                ProductImage::create([
                    'product_id' => $product->id,
                    'image_url' => '/storage/' . $path, // URL yang bisa diakses Frontend
                    'is_primary' => true,
                ]);
            }

            DB::commit(); // Simpan permanen

            return response()->json([
                'status' => 'success',
                'message' => 'Produk berhasil ditambahkan',
                'data' => $product->load('images')
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack(); // Batalkan semua jika ada error
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal menyimpan produk: ' . $e->getMessage()
            ], 500);
        }
    }
}