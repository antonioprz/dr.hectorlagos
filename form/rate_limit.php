<?php

function enforceRateLimit(string $ip, int $maxAttempts = 5, int $windowSeconds = 3600): bool
{
    $dir = __DIR__ . '/data';
    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
    }

    $handle = fopen($dir . '/rate_limit.json', 'c+');
    if ($handle === false) {
        return true; // fail open — a filesystem hiccup shouldn't block a real lead
    }

    flock($handle, LOCK_EX);

    $contents = stream_get_contents($handle);
    $attempts = json_decode($contents, true);
    if (!is_array($attempts)) {
        $attempts = [];
    }

    $now = time();
    $recent = [];
    foreach ($attempts[$ip] ?? [] as $timestamp) {
        if ($timestamp > $now - $windowSeconds) {
            $recent[] = $timestamp;
        }
    }

    $allowed = count($recent) < $maxAttempts;
    if ($allowed) {
        $recent[] = $now;
    }
    $attempts[$ip] = $recent;

    foreach ($attempts as $key => $timestamps) {
        if (empty($timestamps)) {
            unset($attempts[$key]);
        }
    }

    ftruncate($handle, 0);
    rewind($handle);
    fwrite($handle, json_encode($attempts));
    fflush($handle);
    flock($handle, LOCK_UN);
    fclose($handle);

    return $allowed;
}
