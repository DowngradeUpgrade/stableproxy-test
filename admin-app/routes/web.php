<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\ProductsController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('admin');
});

Route::get('admin', function () {
    return view('admin');
});

Route::get('table', function () {
    return view('table');
});

Route::get('login', function () {
    return view('login');
});

Route::get('logout', function () {
    $cookie = cookie('token', '', 60 * 24);
    return redirect('/login')->withCookie($cookie);
});

Route::post('login', [LoginController::class, 'login']);
Route::post('add-product', [ProductsController::class, 'addProduct']);