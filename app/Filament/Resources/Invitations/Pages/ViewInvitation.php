<?php

namespace App\Filament\Resources\Invitations\Pages;

use App\Filament\Resources\Invitations\InvitationResource;
use Filament\Actions\EditAction;
use Filament\Resources\Pages\ViewRecord;
use Illuminate\Support\Arr;

class ViewInvitation extends ViewRecord
{
    protected static string $resource = InvitationResource::class;

    protected function mutateFormDataBeforeFill(array $data): array
    {
        $data['groom'] = $this->extractRelationData($this->record->groom, self::personFields());
        $data['bride'] = $this->extractRelationData($this->record->bride, self::personFields());
        $data['quote'] = $this->extractRelationData($this->record->quote, self::quoteFields());
        $data['slug'] = $this->record->slug;

        return $data;
    }

    /**
     * @param  array<string>  $fields
     * @return array<string, mixed>
     */
    protected function extractRelationData(?object $model, array $fields): array
    {
        if (! $model) {
            return [];
        }

        return Arr::only($model->toArray(), $fields);
    }

    /**
     * @return array<string>
     */
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

    /**
     * @return array<string>
     */
    protected static function quoteFields(): array
    {
        return [
            'quote',
            'author',
        ];
    }

    protected function getHeaderActions(): array
    {
        return [
            EditAction::make(),
        ];
    }
}
