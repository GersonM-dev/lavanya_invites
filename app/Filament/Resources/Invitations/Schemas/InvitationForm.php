<?php

namespace App\Filament\Resources\Invitations\Schemas;

use App\Filament\Resources\Designs\Schemas\DesignForm as DesignResourceForm;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\DateTimePicker;
use Filament\Schemas\Components\Fieldset;
use Filament\Forms\Components\FileUpload;
use Filament\Schemas\Components\Grid;
use Filament\Forms\Components\Placeholder;
use Filament\Forms\Components\Repeater;
use Filament\Schemas\Components\Section;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Utilities\Get;
use Filament\Schemas\Schema;
use Illuminate\Support\Str;


class InvitationForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->columns(1)
            ->components([
                Section::make('Invitation Details')
                    ->schema([
                        Grid::make(2)
                            ->schema([
                                DatePicker::make('wedding_date')
                                    ->label('Wedding date')
                                    ->nullable()
                                    ->live(),
                                Placeholder::make('slug_preview')
                                    ->label('Slug')
                                    ->content(fn (Get $get): string => self::formatSlugPreview($get))
                                    ->columnSpan(2)
                                    ->helperText('Final slug is created automatically from the couple names and wedding date.'),
                            ]),
                    ]),

                Section::make('Couple')
                    ->columns(2)
                    ->schema([
                        Fieldset::make('Groom')
                            ->statePath('groom')
                            ->schema(self::personForm()),
                        Fieldset::make('Bride')
                            ->statePath('bride')
                            ->schema(self::personForm()),
                    ]),

                Section::make('Design')
                    ->schema([
                        Select::make('design_id')
                            ->label('Design')
                            ->relationship('design', 'name')
                            ->searchable()
                            ->preload()
                            ->nullable()
                            ->createOptionForm(self::designForm())
                            ->editOptionForm(self::designForm()),
                    ]),

                Section::make('Quote')
                    ->statePath('quote')
                    ->schema(self::quoteForm()),

                Section::make('Events')
                    ->schema([
                        Repeater::make('events')
                            ->relationship('events')
                            ->schema([
                                Select::make('event_type')
                                    ->label('Type')
                                    ->options([
                                        'ceremony' => 'Ceremony',
                                        'reception' => 'Reception',
                                        'engagement' => 'Engagement',
                                    ])
                                    ->required(),
                                DateTimePicker::make('start_at')
                                    ->label('Starts at')
                                    ->required(),
                                DateTimePicker::make('end_at')
                                    ->label('Ends at')
                                    ->after('start_at')
                                    ->nullable(),
                                Select::make('location_id')
                                    ->label('Location')
                                    ->relationship('location', 'name')
                                    ->searchable()
                                    ->preload()
                                    ->nullable()
                                    ->createOptionForm(self::locationForm())
                                    ->editOptionForm(self::locationForm()),
                                Textarea::make('notes')
                                    ->rows(2)
                                    ->maxLength(65535)
                                    ->nullable(),
                            ])
                            ->columns(2)
                            ->defaultItems(0)
                            ->collapsible()
                            ->itemLabel(fn (array $state): ?string => $state['event_type'] ?? 'Event'),
                    ]),

                Section::make('Gallery')
                    ->schema([
                        Repeater::make('galleryItems')
                            ->relationship('galleryItems')
                            ->schema([
                                FileUpload::make('path')
                                    ->image()
                                    ->directory('invitations/gallery')
                                    ->required(),
                                TextInput::make('subject')
                                    ->maxLength(255)
                                    ->nullable(),
                                TextInput::make('slot')
                                    ->maxLength(255)
                                    ->nullable(),
                                TextInput::make('sort_order')
                                    ->numeric()
                                    ->nullable(),
                            ])
                            ->columns(2)
                            ->defaultItems(0)
                            ->collapsible()
                            ->itemLabel(fn (array $state): ?string => $state['subject'] ?? 'Gallery item'),
                    ]),
            ]);
    }

    public static function makeSlug(?string $groomName, ?string $brideName, ?string $weddingDate): ?string
    {
        if ($weddingDate instanceof \DateTimeInterface) {
            $weddingDate = $weddingDate->format('Y-m-d');
        }

        $parts = array_filter([
            $groomName,
            $brideName,
            $weddingDate,
        ]);

        if (empty($parts)) {
            return null;
        }

        return Str::slug(implode(' ', $parts));
    }

    protected static function formatSlugPreview(Get $get): string
    {
        $slug = self::makeSlug(
            data_get($get('groom'), 'full_name'),
            data_get($get('bride'), 'full_name'),
            $get('wedding_date'),
        );

        return $slug ?? 'Provide the couple names and wedding date to generate the slug.';
    }

    protected static function personForm(): array
    {
        return [
            TextInput::make('full_name')
                ->label('Full name')
                ->required()
                ->maxLength(255)
                ->live(debounce: 500),
            TextInput::make('nick_name')
                ->label('Nickname')
                ->maxLength(255)
                ->nullable(),
            TextInput::make('child_order')
                ->numeric()
                ->label('Child order')
                ->nullable(),
            TextInput::make('father_name')
                ->maxLength(255)
                ->nullable(),
            TextInput::make('mother_name')
                ->maxLength(255)
                ->nullable(),
            Textarea::make('address')
                ->rows(3)
                ->nullable(),
            TextInput::make('instagram_username')
                ->label('Instagram username')
                ->maxLength(255)
                ->nullable(),
        ];
    }

    protected static function designForm(): array
    {
        return DesignResourceForm::formSchema();
    }

    protected static function quoteForm(): array
    {
        return [
            Textarea::make('quote')
                ->required()
                ->rows(3),
            TextInput::make('author')
                ->maxLength(255)
                ->nullable(),
        ];
    }

    protected static function locationForm(): array
    {
        return [
            TextInput::make('name')
                ->maxLength(255)
                ->nullable(),
            Textarea::make('address_line')
                ->rows(2)
                ->nullable(),
            TextInput::make('city')
                ->maxLength(255)
                ->nullable(),
            TextInput::make('province')
                ->maxLength(255)
                ->nullable(),
            TextInput::make('postal_code')
                ->maxLength(255)
                ->nullable(),
            TextInput::make('map_link')
                ->label('Map link')
                ->url()
                ->nullable(),
        ];
    }
}
