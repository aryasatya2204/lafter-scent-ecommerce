<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\ProductVariant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Midtrans\Config;
use Midtrans\Snap;

class OrderController extends Controller
{
    public function __construct()
    {
        // Konfigurasi Midtrans Global
        Config::$serverKey = config('services.midtrans.server_key') ?? env('MIDTRANS_SERVER_KEY');
        Config::$isProduction = config('services.midtrans.is_production') ?? env('MIDTRANS_IS_PRODUCTION', false);
        Config::$isSanitized = config('services.midtrans.is_sanitized') ?? env('MIDTRANS_IS_SANITIZED', true);
        Config::$is3ds = config('services.midtrans.is_3ds') ?? env('MIDTRANS_IS_3DS', true);
    }

    public function store(Request $request)
    {
        // 1. Validasi Input Super Lengkap
        $request->validate([
            // Produk
            'product_variant_id' => 'required|exists:product_variants,id',
            'quantity' => 'required|integer|min:1',
            
            // Ekspedisi (Hasil dari RajaOngkir di Frontend)
            'shipping_courier' => 'required|string', // jne, pos, tiki
            'shipping_service' => 'required|string', // REG, YES
            'shipping_cost' => 'required|numeric|min:0', // Ongkir yang dipilih user
            
            // Alamat (Dikirim sebagai Object JSON dari Frontend)
            'shipping_address' => 'required|array', 
            'shipping_address.province' => 'required|string',
            'shipping_address.city' => 'required|string',
            'shipping_address.detail' => 'required|string',
        ]);

        $user = $request->user();

        // 2. Cek Stok Produk
        $variant = ProductVariant::with('product')->find($request->product_variant_id);
        if ($variant->stock < $request->quantity) {
            return response()->json(['status' => 'error', 'message' => 'Stok habis atau tidak cukup.'], 400);
        }

        DB::beginTransaction();
        try {
            // 3. Hitung Kalkulasi Keuangan
            $itemTotalPrice = $variant->price * $request->quantity;
            $shippingCost = $request->shipping_cost;
            $grandTotal = $itemTotalPrice + $shippingCost;

            // Generate No Invoice (INV/TANGGAL/RANDOM)
            $invoiceNumber = 'INV/' . date('Ymd') . '/' . strtoupper(Str::random(6));

            // 4. Simpan ke Tabel ORDERS (Sesuai Schema Advanced Anda)
            $order = Order::create([
                'invoice_number' => $invoiceNumber,
                'user_id' => $user->id,
                'shop_id' => $variant->product->shop_id,
                
                // Financials
                'total_price' => $grandTotal,
                'shipping_cost_real' => $shippingCost,
                'shipping_cost_client' => $shippingCost, // Bisa dimarkup jika mau untung dari ongkir
                
                // Shipping Details
                'shipping_courier' => $request->shipping_courier,
                'shipping_service' => $request->shipping_service,
                'shipping_address_snapshot' => $request->shipping_address, // Otomatis jadi JSON krn cast di Model
                'shipping_note' => $request->note ?? null,
                
                // Status Awal
                'payment_status' => 'unpaid',
                'order_status' => 'pending',
            ]);

            // 5. Simpan Item & Snapshot Data (Agar aman jika produk asli diedit/hapus)
            OrderItem::create([
                'order_id' => $order->id,
                'product_variant_id' => $variant->id,
                'product_name_snapshot' => $variant->product->name,
                'variant_snapshot' => $variant->size ?? 'All Size',
                'price_snapshot' => $variant->price,
                'qty' => $request->quantity,
            ]);

            // 6. Kurangi Stok
            $variant->decrement('stock', $request->quantity);

            // 7. INTEGRASI MIDTRANS: Minta Snap Token
            $midtransParams = [
                'transaction_details' => [
                    'order_id' => $invoiceNumber, // Gunakan Invoice Number sebagai ID di Midtrans
                    'gross_amount' => (int) $grandTotal,
                ],
                'customer_details' => [
                    'first_name' => $user->name,
                    'email' => $user->email,
                    'phone' => $request->shipping_address['phone'] ?? $user->phone ?? '08123456789',
                ],
                'item_details' => [
                    [
                        'id' => $variant->id,
                        'price' => (int) $variant->price,
                        'quantity' => (int) $request->quantity,
                        'name' => substr($variant->product->name, 0, 50), // Midtrans max 50 char
                    ],
                    [
                        'id' => 'SHIP',
                        'price' => (int) $shippingCost,
                        'quantity' => 1,
                        'name' => 'Ongkos Kirim (' . strtoupper($request->shipping_courier) . ')',
                    ]
                ]
            ];

            // Panggil Midtrans
            $snapToken = Snap::getSnapToken($midtransParams);

            // Simpan Token ke Database
            $order->update(['snap_token' => $snapToken]);

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Order berhasil dibuat, silakan bayar.',
                'data' => [
                    'order' => $order,
                    'snap_token' => $snapToken 
                ]
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 'error', 
                'message' => 'Gagal memproses order: ' . $e->getMessage()
            ], 500);
        }
    }
}