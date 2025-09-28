<?php

namespace App\Filament\Resources\Invitations\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class InvitationsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->defaultSort('wedding_date', 'desc')
            ->columns([
                TextColumn::make('groom.full_name')
                    ->label('Groom')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('bride.full_name')
                    ->label('Bride')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('wedding_date')
                    ->label('Wedding Date')
                    ->date()
                    ->sortable(),
                TextColumn::make('slug')
                    ->label('Slug')
                    ->limit(30)
                    ->searchable(),
                TextColumn::make('public_link')
                    ->label('Public Link')
                    ->state(fn ($record) => sprintf('https://invite.lavanyaenterprise.id/%s', $record->slug))
                    ->copyable()
                    ->copyMessage('Link copied to clipboard')
                    ->copyMessageDuration(1500)
                    ->limit(100)
                    ->toggleable()
                    ->searchable(false)
                    ->sortable(false),
                ImageColumn::make('design.main_sample_pict')
                    ->label('Design Preview')
                    ->disk('public')
                    ->square()
                    ->size(60)
                    ->toggleable(),
                TextColumn::make('design.name')
                    ->label('Design')
                    ->sortable()
                    ->toggleable(),
                TextColumn::make('events_count')
                    ->label('Events')
                    ->counts('events')
                    ->badge()
                    ->color('primary'),
            ])
            ->filters([
                SelectFilter::make('design')
                    ->relationship('design', 'name')
                    ->label('Design')
                    ->searchable(),
            ])
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