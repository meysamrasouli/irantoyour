<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use \App\Http\Controllers\Auth;
use \App\Http\Controllers\Bank;
use \App\Http\Controllers\Website;
use \App\Http\Controllers\Profile;
use \App\Http\Controllers\Dashboard;
use \App\Http\Controllers\DataTable;


//=================================================| AUTH |==================================================\\
//========================================| REGISTER
Route::prefix('register-auth')->name('auth.register.')->group(function () {
    Route::post('send-otp', [Auth\RegisterController::class, 'sendOTP'])->name('send-otp');
    Route::post('/', [Auth\RegisterController::class, 'checkOtp'])->name('check-otp');
});
//========================================| USER
Route::prefix('login')->middleware(['guest'])->group(function () {
    Route::post('send-otp', [Auth\UserController::class, 'sendOTP'])->name('login.send-otp');
    Route::post('/', [Auth\UserController::class, 'login'])->name('login');

    Route::get('/', [Auth\UserController::class, 'index'])->name('login.index');
});

//========================================| LOGOUT
Route::post('logout', [Auth\UserController::class, 'logout'])->name('logout');


//==================================================| BANK |==================================================\\
Route::prefix('bank-callback')->name('bank-callback.')->group(function () {
    Route::any('register/{register}', [Bank\RegisterController::class, 'bankCallback'])->name('bank-callback-register');
    Route::any('invoice/{invoice}', [Bank\InvoiceController::class, 'bankCallback'])->name('bank-callback-invoice');
});

//==================================================| WEBSITE |==================================================\\
Route::get('/', [Website\WebsiteController::class, 'index']);
Route::get('about', [Website\WebsiteController::class, 'about']);
Route::get('terms', [Website\WebsiteController::class, 'terms']);
Route::get('contact', [Website\WebsiteController::class, 'contact']);

Route::get('register', [Website\RegisterController::class, 'index'])->name('register');
Route::post('register', [Website\RegisterController::class, 'store'])->name('register.store');


//==================================================| PROFILE |==================================================\\
Route::prefix('profile')->middleware(['auth'])->name('profile.')->group(function () {
    //------------------------------| index
    Route::get('/', [Profile\ProfileController::class, 'index'])->name('index');
});
