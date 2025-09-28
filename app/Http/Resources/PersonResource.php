<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\Groom */
class PersonResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'full_name' => $this->full_name,
            'nick_name' => $this->nick_name,
            'child_order' => $this->child_order,
            'father_name' => $this->father_name,
            'mother_name' => $this->mother_name,
            'address' => $this->address,
            'instagram_username' => $this->instagram_username,
        ];
    }
}