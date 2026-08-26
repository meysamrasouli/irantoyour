<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use \App\Http\Controllers\Auth;
use \App\Http\Controllers\Bank;
use \App\Http\Controllers\Website;
use \App\Http\Controllers\Profile;
use \App\Http\Controllers\Dashboard;
use \App\Http\Controllers\DataTable;


//==================================================| WEBSITE |==================================================\\
Route::get('/', [Website\WebsiteController::class, 'index']);
Route::get('about', [Website\WebsiteController::class, 'about']);
Route::get('terms', [Website\WebsiteController::class, 'terms']);
Route::get('contact', [Website\WebsiteController::class, 'contact']);

Route::get('register', [Website\RegisterController::class, 'index'])->name('register');
Route::post('register', [Website\RegisterController::class, 'store'])->name('register.store');


//==================================================| BANK |==================================================\\
Route::prefix('bank-callback')->name('bank-callback.')->group(function () {
    Route::any('register/{register}', [Bank\RegisterController::class, 'bankCallback'])->name('bank-callback-register');
    Route::any('invoice/{invoice}', [Bank\InvoiceController::class, 'bankCallback'])->name('bank-callback-invoice');
});
