@php
    $manifestPath = public_path('frontend/manifest.json');

    if (! file_exists($manifestPath)) {
        $manifestPath = public_path('frontend/.vite/manifest.json');
    }

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
    $host = request()->getHost();
    $isLocalHost = in_array($host, ['localhost', '127.0.0.1']);
    $isLocalEnv = app()->environment('local');
    $useDevServer = $isLocalEnv && $isLocalHost && empty($jsFile);
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
      <link rel="stylesheet" href="{{ asset('frontend/' . ltrim($css, '/')) }}" />
    @endforeach
    @if ($useDevServer)
      <script type="module">import "http://localhost:5173/{{ '@' }}vite/client";</script>
      <script type="module">import "http://localhost:5173/src/main.tsx";</script>
    @endif
  </head>
  <body>
    <div id="root"></div>
    @if ($jsFile)
      <script type="module" src="{{ asset('frontend/' . ltrim($jsFile, '/')) }}" defer></script>
    @elseif (!$useDevServer)
      <p style="text-align:center;margin-top:2rem;font-family:system-ui;">
        Build assets are missing. Run <code>npm run build</code> from the <code>frontend</code> directory and redeploy.
      </p>
    @endif
  </body>
</html>