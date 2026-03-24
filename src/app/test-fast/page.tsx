"use client";

import { useEffect, useRef, useState } from "react";

type YouTubePlayer = {
  destroy: () => void;
  mute?: () => void;
  unMute?: () => void;
  playVideo?: () => void;
};

let youtubeApiPromise: Promise<void> | null = null;

function loadYouTubeApi() {
  const w = window as typeof window & { YT?: any; onYouTubeIframeAPIReady?: () => void };
  if (w.YT?.Player) return Promise.resolve();
  if (youtubeApiPromise) return youtubeApiPromise;

  youtubeApiPromise = new Promise<void>((resolve) => {
    const existing = document.querySelector('script[src="https://www.youtube.com/iframe_api"]');
    if (!existing) {
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(script);
    }

    const previous = w.onYouTubeIframeAPIReady;
    w.onYouTubeIframeAPIReady = () => {
      previous?.();
      resolve();
    };
  });

  return youtubeApiPromise;
}

export default function TestFastPage() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<YouTubePlayer | null>(null);
  const [events, setEvents] = useState<string[]>([]);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const startedAt = performance.now();
    const log = (message: string) => {
      const elapsed = ((performance.now() - startedAt) / 1000).toFixed(2);
      setEvents((prev) => [`${elapsed}s - ${message}`, ...prev].slice(0, 20));
    };

    let cancelled = false;

    const mount = async () => {
      log("loading YouTube API");
      await loadYouTubeApi();
      const w = window as typeof window & { YT?: any };
      if (cancelled || !mountRef.current || !w.YT?.Player) return;

      log("mounting player");
      const player = new w.YT.Player(mountRef.current, {
        videoId: "8huJqGFK9aQ",
        playerVars: {
          autoplay: 1,
          mute: 1,
          controls: 0,
          loop: 1,
          playlist: "8huJqGFK9aQ",
          playsinline: 1,
          rel: 0,
          modestbranding: 1,
          iv_load_policy: 3,
          fs: 0,
          disablekb: 1,
          cc_load_policy: 0,
          hl: "en",
          color: "white",
          start: 0,
          enablejsapi: 1,
          origin: window.location.origin,
        },
        events: {
          onReady: (event: { target: YouTubePlayer }) => {
            log("onReady");
            event.target.mute?.();
            event.target.playVideo?.();
          },
          onStateChange: (event: { data: number }) => {
            const w = window as typeof window & { YT?: any };
            if (event.data === 3) log("BUFFERING");
            if (event.data === w.YT?.PlayerState?.PLAYING) log("PLAYING");
          },
          onError: () => log("ERROR"),
        },
      });

      playerRef.current = player;
    };

    mount();

    return () => {
      cancelled = true;
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, []);

  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;
    if (muted) player.mute?.();
    else player.unMute?.();
  }, [muted]);

  return (
    <main className="min-h-screen bg-black p-6 text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <div>
          <h1 className="text-xl font-bold">Fast YouTube startup test</h1>
          <p className="mt-2 text-sm text-white/70">Minimal test page: immediate API mount, no fake-live sync, no loading overlays.</p>
        </div>

        <div className="aspect-video w-full overflow-hidden rounded-lg bg-black shadow-2xl">
          <div ref={mountRef} className="h-full w-full" />
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMuted((value) => !value)}
            className="rounded bg-white/10 px-3 py-2 text-sm hover:bg-white/20"
          >
            {muted ? "Unmute" : "Mute"}
          </button>
        </div>

        <div className="rounded-lg bg-white/5 p-4">
          <div className="mb-2 text-sm font-semibold">Event log</div>
          <ul className="space-y-1 text-sm text-white/80">
            {events.map((entry) => (
              <li key={entry}>{entry}</li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
