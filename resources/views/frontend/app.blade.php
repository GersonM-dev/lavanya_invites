@php
    $manifestPath = public_path('frontend/manifest.json');
    $manifest = [];

    if (file_exists($manifestPath)) {
        $decoded = json_decode(file_get_contents($manifestPath), true);

        if (is_array($decoded)) {
            $manifest = $decoded;
        }
    }

    $entry = $manifest['index.html']
        ?? $manifest['src/main.tsx']
        ?? (is_array($manifest) ? reset($manifest) : null);

    $jsFile = $entry['file'] ?? null;
    $cssFiles = $entry['css'] ?? [];
    $isLocal = app()->environment('local');
    $useDevServer = $isLocal && empty($jsFile);
@endphp
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Lavanya Invite</title>
    <meta name="theme-color" content="#ffffff" />
    @foreach ($cssFiles as $css)
      <link rel="stylesheet" href="{{ asset('frontend/' . $css) }}" />
    @endforeach
    @if ($useDevServer)
      <script type="module">import "http://localhost:5173/{{ '@' }}vite/client";</script>
      <script type="module">import "http://localhost:5173/src/main.tsx";</script>
    @endif
  </head>
  <body>
    <div id="root"></div>
    @if ($jsFile)
      <script type="module" src="{{ asset('frontend/' . $jsFile) }}" defer></script>
    @endif
  </body>
</html>