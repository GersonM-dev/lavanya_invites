<?php

namespace App\Filament\Resources\Invitations\Pages;

use App\Filament\Resources\Invitations\InvitationResource;
use App\Filament\Resources\Invitations\Schemas\InvitationForm;
use App\Models\Bride;
use App\Models\Groom;
use App\Models\Invitation;
use App\Models\Quote;
use Filament\Actions\DeleteAction;
use Filament\Actions\ViewAction;
use Filament\Resources\Pages\EditRecord;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;

class EditInvitation extends EditRecord
{
    protected static string $resource = InvitationResource::class;

    protected function getHeaderActions(): array
    {
        return [
            ViewAction::make(),
            DeleteAction::make(),
        ];
    }

    protected function mutateFormDataBeforeFill(array $data): array
    {
        $data['groom'] = $this->extractRelationData($this->record->groom, self::personFields());
        $data['bride'] = $this->extractRelationData($this->record->bride, self::personFields());
        $data['quote'] = $this->extractRelationData($this->record->quote, self::quoteFields());
        $data['slug'] = $this->record->slug;

        return $data;
    }

    protected function mutateFormDataBeforeSave(array $data): array
    {
        $data['slug'] = $this->makeUniqueSlug($data, $this->record);

        if ($groomData = $data['groom'] ?? null) {
            if ($this->record->groom) {
                $this->record->groom->update($groomData);
            } else {
                $groom = Groom::create($groomData);
                $data['groom_id'] = $groom->getKey();
            }
        }

        if ($brideData = $data['bride'] ?? null) {
            if ($this->record->bride) {
                $this->record->bride->update($brideData);
            } else {
                $bride = Bride::create($brideData);
                $data['bride_id'] = $bride->getKey();
            }
        }

        if ($quoteData = $this->prepareRelationData($data['quote'] ?? [])) {
            if ($this->record->quote) {
                $this->record->quote->update($quoteData);
                $data['quote_id'] = $this->record->quote->getKey();
            } else {
                $quote = Quote::create($quoteData);
                $data['quote_id'] = $quote->getKey();
            }
        } else {
            $data['quote_id'] = $this->record->quote_id;
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

    protected function extractRelationData(?object $model, array $fields): array
    {
        if (! $model) {
            return [];
        }

        return Arr::only($model->toArray(), $fields);
    }

    protected static function personFields(): array
    {
        return [
            'full_name',
            'nick_name',
            'child_order',
            'father_name',
            'mother_name',
            'address',
            'instagram_username',
        ];
    }

    protected static function quoteFields(): array
    {
        return [
            'quote',
            'author',
        ];
    }

    protected function makeUniqueSlug(array $data, Invitation $ignore): string
    {
        $slug = InvitationForm::makeSlug(
            data_get($data, 'groom.full_name'),
            data_get($data, 'bride.full_name'),
            $data['wedding_date'] ?? null,
        ) ?? Str::slug((string) Str::uuid());

        $baseSlug = $slug;
        $suffix = 2;

        while (Invitation::where('slug', $slug)->whereKeyNot($ignore->getKey())->exists()) {
            $slug = sprintf('%s-%d', $baseSlug, $suffix);
            $suffix++;
        }

        return $slug;
    }
}
