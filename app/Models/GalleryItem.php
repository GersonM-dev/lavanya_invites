<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GalleryItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'invitation_id','path','subject','slot','sort_order'
    ];

    public function invitation() {
        return $this->belongsTo(Invitation::class);
    }
}
