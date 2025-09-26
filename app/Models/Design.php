<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Design extends Model
{
    use HasFactory;

    protected $fillable = [
        'name','description','main_sample_pict','secondary_sample_pict','third_sample_pict','sample_link'
    ];

    public function invitations() {
        return $this->hasMany(Invitation::class);
    }
}
