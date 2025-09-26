<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Location extends Model
{
    use HasFactory;

    protected $fillable = [
        'name','address_line','city','province','postal_code','map_link'
    ];

    public function events() {
        return $this->hasMany(Event::class);
    }
}
