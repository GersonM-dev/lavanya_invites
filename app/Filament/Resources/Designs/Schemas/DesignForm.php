<?php

namespace App\Filament\Resources\Designs\Schemas;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class DesignForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->columns(1)
            ->components([
                Section::make('Design Details')
                    ->schema(self::formSchema()),
            ]);
    }

    public static function formSchema(): array
    {
        return [
            Grid::make(2)
                ->schema([
                    TextInput::make('name')
                        ->label('Name')
                        ->required()
                        ->maxLength(255),
                    TextInput::make('sample_link')
                        ->label('Sample link')
                        ->url()
                        ->maxLength(255)
                        ->nullable(),
                ]),
            Textarea::make('description')
                ->label('Description')
                ->rows(4)
                ->nullable()
                ->columnSpanFull(),
            Grid::make(3)
                ->schema([
                    FileUpload::make('main_sample_pict')
                        ->label('Main sample')
                        ->image()
                        ->disk('public')
                        ->directory('designs')
                        ->nullable(),
                    FileUpload::make('secondary_sample_pict')
                        ->label('Secondary sample')
                        ->image()
                        ->disk('public')
                        ->directory('designs')
                        ->nullable(),
                    FileUpload::make('third_sample_pict')
                        ->label('Third sample')
                        ->image()
                        ->disk('public')
                        ->directory('designs')
                        ->nullable(),
                ])
                ->columnSpanFull(),
        ];
    }
}
