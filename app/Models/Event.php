<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    use HasFactory;

    protected $table = "events";

    protected $fillable = [
        'invitation_id','event_type','start_at','end_at','location_id','notes'
    ];

    protected $casts = [
        'start_at' => 'datetime',
        'end_at'   => 'datetime',
    ];

    public function invitation() { return $this->belongsTo(Invitation::class); }
    public function location()   { return $this->belongsTo(Location::class); }
}
