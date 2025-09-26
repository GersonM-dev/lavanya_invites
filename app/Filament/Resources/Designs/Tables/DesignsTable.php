<?php

namespace App\Filament\Resources\Designs\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class DesignsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->modifyQueryUsing(fn (Builder $query) => $query->withCount('invitations'))
            ->columns([
                ImageColumn::make('main_sample_pict')
                    ->label('Preview')
                    ->square()
                    ->imageHeight(60),
                TextColumn::make('name')
                    ->searchable()
                    ->sortable()
                    ->weight('semibold'),
                TextColumn::make('description')
                    ->label('Description')
                    ->limit(50)
                    ->toggleable(isToggledHiddenByDefault: true)
                    ->wrap(),
                TextColumn::make('sample_link')
                    ->label('Sample link')
                    ->url(fn (?string $state) => filled($state) ? $state : null, shouldOpenInNewTab: true)
                    ->icon('heroicon-m-arrow-top-right-on-square')
                    ->copyable()
                    ->copyMessage('Link copied')
                    ->copyMessageDuration(1500)
                    ->placeholder('—'),
                TextColumn::make('invitations_count')
                    ->label('Invitations')
                    ->counts('invitations')
                    ->badge()
                    ->sortable(),
                TextColumn::make('updated_at')
                    ->label('Updated')
                    ->dateTime()
                    ->sortable(),
            ])
            ->defaultSort('updated_at', 'desc')
            ->recordActions([
                ViewAction::make(),
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
