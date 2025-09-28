<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\InvitationResource;
use App\Models\Invitation;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class InvitationController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $perPage = $request->integer('per_page', 12);

        $invitations = Invitation::query()
            ->with(['groom', 'bride', 'design'])
            ->withCount('events')
            ->latest('wedding_date')
            ->paginate($perPage);

        return InvitationResource::collection($invitations);
    }

    public function show(string $slug): InvitationResource
    {
        $invitation = Invitation::query()
            ->where('slug', $slug)
            ->with([
                'groom',
                'bride',
                'quote',
                'design',
                'events' => fn ($query) => $query->orderBy('start_at'),
                'events.location',
                'galleryItems' => fn ($query) => $query->orderBy('sort_order')->orderBy('id'),
            ])
            ->withCount('events')
            ->firstOrFail();

        return new InvitationResource($invitation);
    }
}