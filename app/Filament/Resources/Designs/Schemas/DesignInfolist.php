<?php

namespace App\Filament\Resources\Designs\Schemas;

use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Image;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Text;
use Filament\Schemas\Schema;
use Illuminate\Support\Facades\Storage;

class DesignInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->columns(1)
            ->components([
                Section::make('Design Details')
                    ->schema([
                        Text::make(fn ($record) => $record->name)
                            ->heading('Name')
                            ->weight('semibold')
                            ->size('lg'),
                        Text::make(fn ($record) => $record->description)
                            ->heading('Description')
                            ->hidden(fn ($record) => blank($record->description))
                            ->color('gray'),
                        Text::make(fn ($record) => $record->sample_link ?: '—')
                            ->heading('Sample link')
                            ->icon('heroicon-m-arrow-top-right-on-square')
                            ->color(fn ($record) => filled($record->sample_link) ? 'primary' : 'gray')
                            ->copyable(fn ($record) => filled($record->sample_link))
                            ->copyMessage('Link copied')
                            ->copyMessageDuration(1500),
                    ]),
                Section::make('Preview')
                    ->schema([
                        Grid::make(3)
                            ->schema([
                                self::imageComponent('main_sample_pict', 'Main sample'),
                                self::imageComponent('secondary_sample_pict', 'Secondary sample'),
                                self::imageComponent('third_sample_pict', 'Third sample'),
                            ])
                            ->gap('md'),
                    ])
                    ->hidden(fn ($record) => blank($record->main_sample_pict) && blank($record->secondary_sample_pict) && blank($record->third_sample_pict)),
            ]);
    }

    protected static function imageComponent(string $attribute, string $label): Image
    {
        return Image::make(
            fn ($record) => filled($record->{$attribute}) ? Storage::url($record->{$attribute}) : '',
            fn ($record) => sprintf('%s - %s', $record->name, strtolower($label)),
        )
            ->heading($label)
            ->imageHeight('14rem')
            ->hidden(fn ($record) => blank($record->{$attribute}));
    }
}
