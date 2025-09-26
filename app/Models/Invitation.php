<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Invitation extends Model
{
    use HasFactory;

    protected $fillable = [
        'groom_id','bride_id','wedding_date','design_id','quote_id','slug'
    ];

    public function groom()  { return $this->belongsTo(Groom::class); }
    public function bride()  { return $this->belongsTo(Bride::class); }
    public function design() { return $this->belongsTo(Design::class); }
    public function quote()  { return $this->belongsTo(Quote::class); }

    public function events() { return $this->hasMany(Event::class); }
    public function ceremony() {
        return $this->hasOne(Event::class)->where('event_type','ceremony');
    }
    public function reception() {
        return $this->hasOne(Event::class)->where('event_type','reception');
    }

    public function galleryItems() {
        return $this->hasMany(GalleryItem::class);
    }
}
