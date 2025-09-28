@php
    use Illuminate\Support\Facades\Storage;
    use Illuminate\Support\Str;

    $images = collect([
        $design->main_sample_pict,
        $design->secondary_sample_pict,
        $design->third_sample_pict,
    ])
        ->filter()
        ->map(function (string $path): ?string {
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
        })
        ->filter();
@endphp

<div class="flex items-start gap-3 py-1">
    <div class="flex-1">
        <div class="text-sm font-medium text-gray-900 dark:text-gray-100">
            {{ $design->name }}
        </div>

        @if (filled($design->description))
            <div class="text-xs text-gray-500 dark:text-gray-400">
                {{ $design->description }}
            </div>
        @endif

        @if ($images->isNotEmpty())
            <div class="mt-2 grid grid-cols-{{ min(3, $images->count()) }} gap-2">
                @foreach ($images as $url)
                    <img
                        src="{{ $url }}"
                        alt="{{ $design->name }} preview"
                        class="h-16 w-full rounded-md border border-gray-200 bg-white object-cover dark:border-gray-700"
                    >
                @endforeach
            </div>
        @endif
    </div>
</div>