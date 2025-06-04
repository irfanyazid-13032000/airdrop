<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AirdropController;


Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/halo', function () {
    return response()->json(['message' => 'Halo, ini adalah API Laravel!']);
});

Route::post('/airdrop', [AirdropController::class, 'store']);
