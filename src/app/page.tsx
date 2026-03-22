"use client";

import { useEffect, useMemo, useRef, useState } from "react";

declare global {
  interface Window {
    YT?: {
      Player: new (
        element: HTMLDivElement,
        options: {
          videoId: string;
          playerVars?: Record<string, string | number>;
          events?: {
            onReady?: (event: { target: { getDuration: () => number } }) => void;
            onError?: () => void;
          };
        },
      ) => { destroy: () => void };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

const CHANNEL_EPOCH = Date.UTC(2026, 2, 22, 4, 0, 0);

const YOUTUBE_URLS = [
  "https://youtu.be/qI5C1R1L0EQ",
  "https://youtu.be/jjVhyxiMaME",
  "https://youtu.be/ESzoVaTzniA",
  "https://youtu.be/qDU84ENFna0",
  "https://youtu.be/taKB24OWoSQ",
  "https://youtu.be/akJKOPLhm70",
  "https://youtu.be/ZK8T9l9yWyo",
  "https://youtu.be/buOnIH5PVg8",
  "https://youtu.be/aZqYoTqxgqc",
  "https://youtu.be/-2Zy44hHSqs",
  "https://youtu.be/Q6v4RTg-zEM",
  "https://youtu.be/rITGu0ZOUr0",
  "https://youtu.be/a8v4Y3QMHGg",
  "https://youtu.be/Q08MmfWIKrU",
  "https://youtu.be/VP35hLWePdg",
  "https://youtu.be/LZTXtvOXu9A",
  "https://youtu.be/zgZIkR4hKUQ",
  "https://youtu.be/RzH8cusmbd4",
  "https://youtu.be/BArwsRHJsFw",
  "https://youtu.be/YNyTCpydQxI",
  "https://youtu.be/vNGoIgPuqa0",
  "https://youtu.be/Myw8HOZCvus",
  "https://youtu.be/j7kjwnMQ0dk",
  "https://youtu.be/HHO1vJtzgBI",
  "https://youtu.be/qexak6IhEA0",
  "https://youtu.be/lnTBJXVvOoM",
  "https://youtu.be/UTGe8_BM0p8",
  "https://youtu.be/Mu9sctz988c",
  "https://youtu.be/02XmxkMDVNw",
  "https://youtu.be/7Bkqz_Ps8ec",
  "https://youtu.be/5O1XsBkhpno",
  "https://youtu.be/fA_c2Q-4X5Y",
  "https://youtu.be/WxSLkhBXwPw",
  "https://youtu.be/sjWviUqwAdw",
  "https://youtu.be/gkzjap-0KmQ",
  "https://youtu.be/4tx2Q9pNxPc?si=5SBebCQSj3Sijnlt",
  "https://youtu.be/A_6FADx3hfU?si=kI03NbPZavhEdKqI",
  "https://youtu.be/7-QFxCRO8cU?si=clAC8oJUrAVdOgdG",
  "https://youtu.be/MROEdKma7-0?si=bPkQUjvw7JAJnBC1",
  "https://youtu.be/M-A4aYRI4kg?si=ce-RYLzMvcYXXprF",
  "https://youtu.be/FVbFxqfU4a8?si=tuZnow1cbrDIuGc1",
  "https://youtu.be/X5AORez3yb0?si=NJJdegHAh-PxNP1l",
  "https://youtu.be/GfSZXQ3YeRk?si=qmsl_EUSnmLeEcUu",
  "https://youtu.be/xtGBVFcveXA?si=KoAZk9u8CE_U9r7I",
  "https://youtu.be/xOtoSpsUv7k?si=cOCAbVs0unt8owdu",
  "https://youtu.be/PWvmtTSAFCE?si=IasK1R0oUDtzYDbn",
  "https://youtu.be/Vi8yQ2IDkdI?si=Z5ecrFteMSqu2yAk",
  "https://youtu.be/h1yL23W1L8M?si=00KmyyFHslYw2DCE",
  "https://youtu.be/CLaxmyL1sB0?si=CCFqLeTTci-4qOMs",
  "https://youtu.be/hYz78yn4mZQ?si=faWygkpe1m0V3E8G",
  "https://youtu.be/X7T2tNqx7o8?si=_iRgOk6ccQ9RZJwv",
  "https://youtu.be/Xhuq9sSsvV4?si=C4K0165iKb1wZmub",
  "https://youtu.be/fYztgN3z2vg?si=7A67NBynWx8Gr_L0",
  "https://youtu.be/S9KpaG2p_zI?si=9Cbvvwql3n3Vl438",
  "https://youtu.be/kPjzMDPJALE?si=6BzQQ_ll81kv-i0z",
  "https://youtu.be/qiLwrukM7M8?si=AcdX-cxhOO_Xgez3",
  "https://youtu.be/yxBQz7JJVUc?si=nywXdrwmmaHXeBtz",
];

const FALLBACK_DURATION_SECONDS = 180;

const VIDEO_TITLES: Record<string, string> = {
  "qI5C1R1L0EQ": "411VM - #01 (1993)",
  "jjVhyxiMaME": "411VM - #02 (1993)",
  "ESzoVaTzniA": "411VM - #03 (1993)",
  "qDU84ENFna0": "411VM - #04 (1994)",
  "taKB24OWoSQ": "411VM - #05 (1994)",
  "akJKOPLhm70": "411VM - #06 (1994)",
  "ZK8T9l9yWyo": "411VM - #07 (1994)",
  "buOnIH5PVg8": "411VM - #08 (1994)",
  "aZqYoTqxgqc": "411VM - #09 (1994)",
  "-2Zy44hHSqs": "411VM - #10 (1995)",
  "Q6v4RTg-zEM": "411VM - #11 (1995)",
  "rITGu0ZOUr0": "411VM - #12 (1995)",
  "a8v4Y3QMHGg": "411VM - #13 (1995)",
  "Q08MmfWIKrU": "411VM - #14 (1996)",
  "VP35hLWePdg": "411VM - #16 (1996)",
  "LZTXtvOXu9A": "411VM - #17 (1996)",
  "zgZIkR4hKUQ": "411VM - #18 (1996)",
  "RzH8cusmbd4": "411VM - #19 (1996)",
  "BArwsRHJsFw": "411VM - #20 (1997)",
  "YNyTCpydQxI": "411VM - #21 (1997)",
  "vNGoIgPuqa0": "411VM - #22 (1997)",
  "Myw8HOZCvus": "411VM - #23 (1997)",
  "j7kjwnMQ0dk": "411VM - #24 (1997)",
  "HHO1vJtzgBI": "411VM - #25 (1997)",
  "qexak6IhEA0": "411VM - #26 (1998)",
  "lnTBJXVvOoM": "411VM - #27 (1998)",
  "UTGe8_BM0p8": "411VM - #28 (1998)",
  "Mu9sctz988c": "411VM - #29 (1998)",
  "02XmxkMDVNw": "411VM - #30 (1998)",
  "7Bkqz_Ps8ec": "411VM - #31 (1998)",
  "5O1XsBkhpno": "411VM - #32 (1999)",
  "fA_c2Q-4X5Y": "411VM - #33 (1999)",
  "WxSLkhBXwPw": "411VM - #34 (1999)",
  "sjWviUqwAdw": "411VM - #35 (1999)",
  "gkzjap-0KmQ": "411VM - #36 (1999)",
  "4tx2Q9pNxPc": "Toy Machine - Welcome To Hell (1996)",
  A_6FADx3hfU: "411 VM: Europe (1999)",
  "7-QFxCRO8cU": "XYZ Presents Stars and Bars (1995)",
  "MROEdKma7-0": 'World Industries / Blind / 101 – Trilogy (1996)',
  "M-A4aYRI4kg": "Transworld - Uno (1996)",
  FVbFxqfU4a8: "Transworld - Anthology (2000)",
  X5AORez3yb0: "Girl - Mouse (1996)",
  GfSZXQ3YeRk: "Underachievers: Eastern Exposure 3 (1996)",
  xtGBVFcveXA: "Shorty's - Fulfill the Dream",
  xOtoSpsUv7k: 'TSA - "Life In The Fast Lane" (1997)',
  PWvmtTSAFCE: "Blind - Video Days",
  Vi8yQ2IDkdI: 'Plan B - "Questionable" (1992)',
  h1yL23W1L8M: "Plan B - Virtual Reality",
  CLaxmyL1sB0: "Zero - Thrill of It All",
  hYz78yn4mZQ: "Transworld - The Reason (1999)",
  X7T2tNqx7o8: "Alien Workshop - Memory Screen",
  Xhuq9sSsvV4: "Zoo York Mixtape - The Original",
  fYztgN3z2vg: "Foundation - Art Bars, Subtitles and Seagulls (2001)",
  S9KpaG2p_zI: 'Think - "Damage" (1996)',
  kPjzMDPJALE: 'Birdhouse - "The End" (1998)',
  qiLwrukM7M8: 'Chocolate - "Las Nueve Vidas De Paco" (1995)',
  yxBQz7JJVUc: 'FTC - "Penal Code 100A" (1996)',
};

function extractYouTubeId(url: string) {
  try {
    const parsed = new URL(url);

    if (parsed.hostname.includes("youtu.be")) return parsed.pathname.replace(/^\//, "");

    if (parsed.hostname.includes("youtube.com")) {
      if (parsed.pathname.startsWith("/watch")) return parsed.searchParams.get("v");
      if (parsed.pathname.startsWith("/embed/")) return parsed.pathname.split("/embed/")[1]?.split("/")[0] ?? null;
      if (parsed.pathname.startsWith("/shorts/")) return parsed.pathname.split("/shorts/")[1]?.split("/")[0] ?? null;
    }
  } catch {
    return null;
  }

  return null;
}

function loadYouTubeApi() {
  return new Promise<void>((resolve) => {
    if (window.YT?.Player) {
      resolve();
      return;
    }

    const existing = document.querySelector('script[src="https://www.youtube.com/iframe_api"]');
    if (!existing) {
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(script);
    }

    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previous?.();
      resolve();
    };
  });
}

async function fetchDurationSeconds(videoId: string) {
  await loadYouTubeApi();

  return new Promise<number>((resolve) => {
    const mount = document.createElement("div");
    mount.style.position = "fixed";
    mount.style.left = "-99999px";
    mount.style.top = "-99999px";
    document.body.appendChild(mount);

    const cleanup = (value: number) => {
      player?.destroy();
      mount.remove();
      resolve(value > 0 ? value : FALLBACK_DURATION_SECONDS);
    };

    let player: { destroy: () => void } | undefined;

    player = new window.YT!.Player(mount, {
      videoId,
      playerVars: {
        autoplay: 0,
        controls: 0,
        rel: 0,
        playsinline: 1,
      },
      events: {
        onReady: (event) => cleanup(Math.round(event.target.getDuration() || FALLBACK_DURATION_SECONDS)),
        onError: () => cleanup(FALLBACK_DURATION_SECONDS),
      },
    });
  });
}

type ChannelItem = {
  id: string;
  duration: number;
};

function getLiveSlot(playlist: ChannelItem[], nowMs: number) {
  const totalDuration = playlist.reduce((sum, item) => sum + item.duration, 0);
  const elapsedSeconds = Math.floor((nowMs - CHANNEL_EPOCH) / 1000);
  const loopOffset = ((elapsedSeconds % totalDuration) + totalDuration) % totalDuration;

  let cursor = 0;
  for (let i = 0; i < playlist.length; i += 1) {
    const item = playlist[i];
    if (loopOffset < cursor + item.duration) {
      return { index: i, item, offsetSeconds: loopOffset - cursor };
    }
    cursor += item.duration;
  }

  return { index: 0, item: playlist[0], offsetSeconds: 0 };
}

function useMobileLandscapeGate() {
  const [isMobilePortrait, setIsMobilePortrait] = useState(false);

  useEffect(() => {
    const check = () => {
      const coarse = window.matchMedia("(pointer: coarse)").matches;
      const narrow = window.innerWidth < 900;
      const portrait = window.innerHeight > window.innerWidth;
      setIsMobilePortrait(coarse && narrow && portrait);
    };

    check();
    window.addEventListener("resize", check);
    window.addEventListener("orientationchange", check);

    return () => {
      window.removeEventListener("resize", check);
      window.removeEventListener("orientationchange", check);
    };
  }, []);

  return isMobilePortrait;
}

export default function Home() {
  const ids = useMemo(() => YOUTUBE_URLS.map((url) => extractYouTubeId(url)).filter((id): id is string => Boolean(id)), []);
  const [playlist, setPlaylist] = useState<ChannelItem[] | null>(null);
  const [nowMs, setNowMs] = useState(() => Date.now());
  const [serverOffsetMs, setServerOffsetMs] = useState<number | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [showPoster, setShowPoster] = useState(true);
  const [mountedSlot, setMountedSlot] = useState<{ id: string; index: number; offsetSeconds: number } | null>(null);
  const [muted, setMuted] = useState(true);
  const fadeTimerRef = useRef<number | null>(null);
  const isMobilePortrait = useMobileLandscapeGate();

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const durations = await Promise.all(ids.map(async (id) => ({ id, duration: await fetchDurationSeconds(id) })));
      if (!cancelled) setPlaylist(durations);
    })();

    return () => {
      cancelled = true;
    };
  }, [ids]);

  useEffect(() => {
    let cancelled = false;

    const syncServerClock = async () => {
      try {
        const startedAt = Date.now();
        const response = await fetch("/api/channel-time", { cache: "no-store" });
        const endedAt = Date.now();
        if (!response.ok) return;
        const data = (await response.json()) as { nowMs?: number };
        if (!data.nowMs || cancelled) return;

        const estimatedServerNow = data.nowMs + Math.round((endedAt - startedAt) / 2);
        setServerOffsetMs(estimatedServerNow - endedAt);
        setNowMs(estimatedServerNow);
      } catch {
        // fall back to client clock
      }
    };

    syncServerClock();
    const interval = window.setInterval(syncServerClock, 30000);
    window.addEventListener("focus", syncServerClock);
    window.addEventListener("pageshow", syncServerClock);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
      window.removeEventListener("focus", syncServerClock);
      window.removeEventListener("pageshow", syncServerClock);
    };
  }, []);

  useEffect(() => {
    if (!playlist || !hasStarted) return;

    const getChannelNow = () => Date.now() + (serverOffsetMs ?? 0);

    const syncToLiveNow = () => {
      const currentNow = getChannelNow();
      const slot = getLiveSlot(playlist, currentNow);
      setNowMs(currentNow);
      setMountedSlot({
        id: slot.item.id,
        index: slot.index,
        offsetSeconds: slot.offsetSeconds,
      });
    };

    const interval = window.setInterval(syncToLiveNow, 1000);
    window.addEventListener("focus", syncToLiveNow);
    window.addEventListener("pageshow", syncToLiveNow);

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        syncToLiveNow();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener("focus", syncToLiveNow);
      window.removeEventListener("pageshow", syncToLiveNow);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [playlist, hasStarted, serverOffsetMs]);

  const liveSlot = useMemo(() => {
    if (!playlist?.length) return null;
    return getLiveSlot(playlist, nowMs);
  }, [playlist, nowMs]);

  useEffect(() => {
    if (!hasStarted || !liveSlot) return;

    setMountedSlot((current) => {
      if (!current) {
        return {
          id: liveSlot.item.id,
          index: liveSlot.index,
          offsetSeconds: liveSlot.offsetSeconds,
        };
      }

      if (current.index !== liveSlot.index) {
        return {
          id: liveSlot.item.id,
          index: liveSlot.index,
          offsetSeconds: liveSlot.offsetSeconds,
        };
      }

      return current;
    });
  }, [hasStarted, liveSlot]);

  const startChannel = () => {
    if (!playlist?.length || isMobilePortrait) return;

    const currentNow = Date.now() + (serverOffsetMs ?? 0);
    const slot = getLiveSlot(playlist, currentNow);

    setNowMs(currentNow);
    setMountedSlot({
      id: slot.item.id,
      index: slot.index,
      offsetSeconds: slot.offsetSeconds,
    });
    setHasStarted(true);
    setShowPoster(true);

    if (fadeTimerRef.current) window.clearTimeout(fadeTimerRef.current);
    fadeTimerRef.current = window.setTimeout(() => setShowPoster(false), 350);
  };

  useEffect(() => {
    if (!playlist?.length) return;
    if (isMobilePortrait || hasStarted) return;

    startChannel();
  }, [playlist, isMobilePortrait, hasStarted, serverOffsetMs]);

  useEffect(() => {
    if (!playlist?.length) return;

    const ensureLandscapePlayback = () => {
      const portrait = window.innerHeight > window.innerWidth && window.innerWidth < 900 && window.matchMedia("(pointer: coarse)").matches;
      if (portrait) return;
      startChannel();
    };

    window.addEventListener("orientationchange", ensureLandscapePlayback);
    window.addEventListener("resize", ensureLandscapePlayback);
    window.addEventListener("pageshow", ensureLandscapePlayback);

    return () => {
      window.removeEventListener("orientationchange", ensureLandscapePlayback);
      window.removeEventListener("resize", ensureLandscapePlayback);
      window.removeEventListener("pageshow", ensureLandscapePlayback);
    };
  }, [playlist, serverOffsetMs, isMobilePortrait]);

  useEffect(() => {
    return () => {
      if (fadeTimerRef.current) window.clearTimeout(fadeTimerRef.current);
    };
  }, []);

  const currentTitle = mountedSlot ? VIDEO_TITLES[mountedSlot.id] ?? "Unknown clip" : "";

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-black">
      <div className="absolute left-1/2 top-[58%] h-[max(46.136vw,100vh)] w-[max(100vw,216.744vh)] -translate-x-1/2 -translate-y-1/2 overflow-hidden bg-black lg:top-1/2">
        <div className="relative h-full w-full [container-type:size]">
          <div className="absolute left-[26.82%] top-[calc(15.92%-4.5px)] z-0 h-[52.16%] w-[46.36%]">
            <div className="relative h-full w-full overflow-hidden rounded-[2.5%] bg-black">
            {hasStarted && mountedSlot && !isMobilePortrait ? (
              <>
                <iframe
                  key={`${mountedSlot.id}-${mountedSlot.index}-${muted ? "muted" : "audio"}`}
                  className="pointer-events-none h-full w-full scale-[1.12]"
                  src={`https://www.youtube-nocookie.com/embed/${mountedSlot.id}?autoplay=1&mute=${muted ? 1 : 0}&controls=0&loop=1&playlist=${mountedSlot.id}&playsinline=1&rel=0&modestbranding=1&iv_load_policy=3&fs=0&disablekb=1&cc_load_policy=0&hl=en&color=white&start=${Math.max(0, mountedSlot.offsetSeconds)}`}
                  title="Skateshop TV"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />

              </>
            ) : null}

            {(isMobilePortrait || !hasStarted || showPoster) && (
              <div
                className={`absolute inset-0 z-10 flex h-full w-full items-center justify-center overflow-hidden bg-black transition-opacity duration-700 ${
                  hasStarted && !showPoster && !isMobilePortrait ? "pointer-events-none opacity-0" : "opacity-100"
                }`}
                aria-label={isMobilePortrait ? "Rotate phone to view" : undefined}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_58%)]" />
                <div className="absolute inset-0 opacity-15 mix-blend-screen [background-image:linear-gradient(to_bottom,rgba(255,255,255,0.08)_0,rgba(255,255,255,0.02)_1px,transparent_1px,transparent_6px)] [background-size:100%_6px]" />
                <div className="relative z-10 flex max-w-[80%] flex-col items-center gap-5 text-center text-[#d7d0bc]">
                  {isMobilePortrait ? (
                    <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border border-[#d7d0bc]/45 bg-black/35 backdrop-blur-sm">
                      <video
                        className="h-full w-full object-cover"
                        src="/mobile-kickflip-loop.mp4"
                        autoPlay
                        loop
                        muted
                        playsInline
                        preload="auto"
                        aria-hidden="true"
                      />
                    </div>
                  ) : null}
                  {isMobilePortrait ? (
                    <div className="text-[11px] uppercase tracking-[0.32em]">
                      KICKFLIP YOUR PHONE
                      <br />
                      HORIZONTALLY TO VIEW
                    </div>
                  ) : null}
                </div>
              </div>
            )}

              {!playlist && (
                <div className="absolute inset-0 z-20 flex items-center justify-center bg-black text-[11px] uppercase tracking-[0.32em] text-[#d7d0bc]">
                  TUNING CHANNEL...
                </div>
              )}
            </div>
          </div>

          {!isMobilePortrait && (
            <img
              src="/skateshop-bg-4.png"
              alt="Skateshop TV background"
              className="pointer-events-none absolute inset-0 z-10 h-full w-full object-fill"
            />
          )}

          {hasStarted && currentTitle && !isMobilePortrait && (
            <div
              className="pointer-events-none absolute left-1/2 top-[80.0%] z-20 -translate-x-1/2 text-center text-[#d7d0bc] drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]"
              style={{ fontFamily: 'ImpactLabelReversed, Arial Black, sans-serif' }}
            >
              <div className="bg-black leading-none tracking-[0.06em] uppercase" style={{ padding: '0 1px', fontSize: '1.18cqw' }}>
                {currentTitle}
              </div>
            </div>
          )}

          {hasStarted && !isMobilePortrait && (
            <button
              type="button"
              onClick={() => setMuted((value) => !value)}
              className="absolute right-4 top-4 z-30 flex h-9 w-9 items-center justify-center rounded-full bg-black/55 text-[#d7d0bc] backdrop-blur-sm transition hover:bg-black/75 md:right-6 md:top-6"
              aria-label={muted ? "Turn audio on" : "Mute audio"}
              title={muted ? "Audio off" : "Audio on"}
            >
              {muted ? (
                <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
                  <path d="M16.5 12a4.5 4.5 0 0 0-2.2-3.86v2.34l2.17 2.17c.02-.21.03-.43.03-.65z" />
                  <path d="M19 12c0 .88-.15 1.73-.42 2.52l1.51 1.51A8.9 8.9 0 0 0 21 12c0-2.82-1.23-5.35-3.18-7.09l-1.43 1.43A6.96 6.96 0 0 1 19 12z" />
                  <path d="M3.27 2 2 3.27 6.73 8H3v8h4l5 4v-6.73l4.25 4.25c-.56.43-1.2.77-1.95 1v2.06a9.3 9.3 0 0 0 3.39-1.54L20.73 22 22 20.73 3.27 2z" />
                  <path d="M12 4 9.91 6.09 12 8.18V4z" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
                  <path d="M3 10v4h4l5 4V6L7 10H3z" />
                  <path d="M16.5 12a4.5 4.5 0 0 0-2.2-3.86v7.72A4.5 4.5 0 0 0 16.5 12z" />
                  <path d="M14.3 3.23v2.06a7.5 7.5 0 0 1 0 13.42v2.06a9.5 9.5 0 0 0 0-17.54z" />
                </svg>
              )}
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
