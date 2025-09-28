<?php

use Illuminate\Support\Facades\Route;

Route::view('/', 'frontend.app');

Route::view('/{path}', 'frontend.app')
    ->where('path', '^(?!api|admin|filament|frontend|storage|telescope|horizon|broadcasting|livewire)(.*)$');