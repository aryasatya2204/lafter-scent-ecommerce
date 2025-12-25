<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ShopController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\OrderController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Public Routes (Bisa diakses tanpa login)
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/public/products', [ProductController::class, 'publicIndex']);
Route::get('/public/products/{slug}', [ProductController::class, 'show']);

// Protected Routes (Harus menyertakan Token di Header)
Route::middleware('auth:sanctum')->group(function () {
    
    // Test user data
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Logout
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::post('/shops', [ShopController::class, 'store']);

    //RUTE PRODUK
    Route::get('/products', [ProductController::class, 'index']);
    Route::post('/products', [ProductController::class, 'store']);
    Route::post('/orders', [OrderController::class, 'store']);
    Route::get('/orders/shop', [OrderController::class, 'index']); // Untuk Penjual
    Route::get('/orders/history', [OrderController::class, 'history']); // Untuk Pembeli
    Route::get('/orders/{id}', [OrderController::class, 'show']);
    Route::patch('/orders/{id}/status', [OrderController::class, 'updateStatus']);
    // Nanti kita tambah route products, orders, dll di sini
});