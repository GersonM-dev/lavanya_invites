<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class GalleryItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'subject' => $this->subject,
            'slot' => $this->slot,
            'sort_order' => $this->sort_order,
            'image_url' => $this->resolveAssetUrl($this->path),
        ];
    }

    protected function resolveAssetUrl(?string $path): ?string
    {
        if (blank($path)) {
            return null;
        }

        if (Str::startsWith($path, ['http://', 'https://', 'data:', '//'])) {
            return $path;
        }

        foreach (['public', config('filesystems.default')] as $disk) {
            if (blank($disk)) {
                continue;
            }

            try {
                $storage = Storage::disk($disk);
            } catch (\Throwable $exception) {
                continue;
            }

            try {
                if ($storage->exists($path)) {
                    return $storage->url($path);
                }
            } catch (\Throwable $exception) {
                continue;
            }
        }

        return null;
    }
}