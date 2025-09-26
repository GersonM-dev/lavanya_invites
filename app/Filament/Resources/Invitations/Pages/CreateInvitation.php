<?php

namespace App\Filament\Resources\Invitations\Pages;

use App\Filament\Resources\Invitations\InvitationResource;
use App\Filament\Resources\Invitations\Schemas\InvitationForm;
use App\Models\Bride;
use App\Models\Groom;
use App\Models\Invitation;
use App\Models\Quote;
use Filament\Resources\Pages\CreateRecord;
use Illuminate\Support\Str;

class CreateInvitation extends CreateRecord
{
    protected static string $resource = InvitationResource::class;

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        $data['slug'] = $this->makeUniqueSlug($data);

        $groom = Groom::create($data['groom']);
        $data['groom_id'] = $groom->getKey();

        $bride = Bride::create($data['bride']);
        $data['bride_id'] = $bride->getKey();

        if ($quoteData = $this->prepareRelationData($data['quote'] ?? [])) {
            $quote = Quote::create($quoteData);
            $data['quote_id'] = $quote->getKey();
        } else {
            $data['quote_id'] = null;
        }

        unset($data['groom'], $data['bride'], $data['quote']);

        return $data;
    }

    protected function prepareRelationData(array $data): ?array
    {
        $filtered = collect($data)
            ->reject(fn ($value) => blank($value))
            ->toArray();

        return $filtered === [] ? null : $filtered;
    }

    protected function makeUniqueSlug(array $data): string
    {
        $slug = InvitationForm::makeSlug(
            data_get($data, 'groom.full_name'),
            data_get($data, 'bride.full_name'),
            $data['wedding_date'] ?? null,
        ) ?? Str::slug((string) Str::uuid());

        $baseSlug = $slug;
        $suffix = 2;

        while (Invitation::where('slug', $slug)->exists()) {
            $slug = sprintf('%s-%d', $baseSlug, $suffix);
            $suffix++;
        }

        return $slug;
    }
}
