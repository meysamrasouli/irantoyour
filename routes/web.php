<?php

use Illuminate\Support\Facades\Route;
use \App\Http\Controllers\Auth;
use \App\Http\Controllers\Website;
use \App\Http\Controllers\Profile;
use \App\Http\Controllers\Dashboard;
use \App\Http\Controllers\DataTable;


//==================================================| WEBSITE |==================================================\\
Route::get('/', [Website\WebsiteController::class, 'index']);
Route::get('about', [Website\WebsiteController::class, 'about']);
Route::get('terms', [Website\WebsiteController::class, 'terms']);
Route::get('contact', [Website\WebsiteController::class, 'contact']);
