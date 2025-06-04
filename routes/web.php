<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AirdropController;



Route::get('/', [AirdropController::class, 'index'])->name('airdrop.index');
Route::post('/airdrop', [AirdropController::class, 'store'])->name('airdrop.store');
Route::post('/airdrop/checklist/{task}', [AirdropController::class, 'checklist'])->name('airdrop.checklist');

