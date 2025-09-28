<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class InvitationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'design_id' => $this->design_id,
            'wedding_date' => optional($this->wedding_date)->toDateString(),
            'groom' => PersonResource::make($this->whenLoaded('groom')),
            'bride' => PersonResource::make($this->whenLoaded('bride')),
            'quote' => QuoteResource::make($this->whenLoaded('quote')),
            'design' => DesignResource::make($this->whenLoaded('design')),
            'events_count' => $this->when(isset($this->events_count), (int) $this->events_count),
            'events' => EventResource::collection($this->whenLoaded('events')),
            'gallery' => GalleryItemResource::collection($this->whenLoaded('galleryItems')),
            'created_at' => optional($this->created_at)->toIso8601String(),
            'updated_at' => optional($this->updated_at)->toIso8601String(),
        ];
    }
}