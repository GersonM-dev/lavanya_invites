<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class DesignResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'name' => $this->name,
            'description' => $this->description,
            'sample_link' => $this->sample_link,
            'main_sample_url' => $this->resolveAssetUrl($this->main_sample_pict),
            'secondary_sample_url' => $this->resolveAssetUrl($this->secondary_sample_pict),
            'third_sample_url' => $this->resolveAssetUrl($this->third_sample_pict),
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