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

export default function TestAudioPage() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<YouTubePlayer | null>(null);
  const [events, setEvents] = useState<string[]>([]);
  const [muted, setMuted] = useState(true);
  const [playerReady, setPlayerReady] = useState(false);

  useEffect(() => {
    const startedAt = performance.now();
    const log = (message: string) => {
      const elapsed = ((performance.now() - startedAt) / 1000).toFixed(2);
      setEvents((prev) => [`${elapsed}s - ${message}`, ...prev].slice(0, 25));
    };

    let cancelled = false;
    const mountNode = mountRef.current;
    if (!mountNode) return;
    mountNode.innerHTML = "";
    setPlayerReady(false);

    const mount = async () => {
      const w = window as typeof window & { YT?: any };
      log("loading YouTube API");
      await loadYouTubeApi();
      if (cancelled || !w.YT?.Player) return;

      log("mounting player");
      const player = new w.YT.Player(mountNode, {
        videoId: "8huJqGFK9aQ",
        playerVars: {
          autoplay: 1,
          mute: muted ? 1 : 0,
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
            if (muted) event.target.mute?.();
            else event.target.unMute?.();
            event.target.playVideo?.();
          },
          onStateChange: (event: { data: number }) => {
            if (event.data === 3) {
              log("BUFFERING");
              setPlayerReady(true);
            }
            if (event.data === w.YT?.PlayerState?.PLAYING) {
              log("PLAYING");
              setPlayerReady(true);
            }
          },
          onError: () => {
            log("ERROR");
            setPlayerReady(true);
          },
        },
      });

      playerRef.current = player;
    };

    mount();

    return () => {
      cancelled = true;
      playerRef.current?.destroy();
      playerRef.current = null;
      mountNode.innerHTML = "";
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
          <h1 className="text-xl font-bold">Audio/API control startup test</h1>
          <p className="mt-2 text-sm text-white/70">Closer to the real page: immediate API mount, same mute/player-vars style, no fake-live sync or loading choreography.</p>
        </div>

        <div className="aspect-video w-full overflow-hidden rounded-lg bg-black shadow-2xl">
          {!playerReady && (
            <div className="absolute flex h-[calc(100vw*9/16)] max-h-[calc(100vh-12rem)] w-[min(100%,96rem)] items-center justify-center bg-black text-xs uppercase tracking-[0.3em] text-white/70">
              Loading test...
            </div>
          )}
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
