<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EventResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'event_type' => $this->event_type,
            'start_at' => optional($this->start_at)->toIso8601String(),
            'end_at' => optional($this->end_at)->toIso8601String(),
            'notes' => $this->notes,
            'location' => LocationResource::make($this->whenLoaded('location')),
        ];
    }
}