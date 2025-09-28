<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LocationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'name' => $this->name,
            'address_line' => $this->address_line,
            'city' => $this->city,
            'province' => $this->province,
            'postal_code' => $this->postal_code,
            'map_link' => $this->map_link,
        ];
    }
}