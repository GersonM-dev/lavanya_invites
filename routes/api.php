<?php

use App\Http\Controllers\Api\InvitationController;
use Illuminate\Support\Facades\Route;

Route::middleware('api')->group(function () {
    Route::get('/invitations', [InvitationController::class, 'index']);
    Route::get('/invitations/{slug}', [InvitationController::class, 'show']);
});