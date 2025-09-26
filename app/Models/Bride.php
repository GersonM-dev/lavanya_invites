<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Bride extends Model
{
    use HasFactory;

    protected $fillable = [
        'full_name','nick_name','child_order','father_name','mother_name','address','instagram_username'
    ];

    public function invitations() {
        return $this->hasMany(Invitation::class);
    }
}
