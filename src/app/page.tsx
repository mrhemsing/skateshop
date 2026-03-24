"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type YouTubePlayer = {
  destroy: () => void;
  getDuration?: () => number;
  mute?: () => void;
  unMute?: () => void;
  playVideo?: () => void;
  pauseVideo?: () => void;
};

declare global {
  interface Window {
    YT?: {
      PlayerState?: {
        PLAYING: number;
      };
      Player: new (
        element: HTMLDivElement,
        options: {
          videoId: string;
          playerVars?: Record<string, string | number>;
          events?: {
            onReady?: (event: { target: YouTubePlayer }) => void;
            onError?: () => void;
            onStateChange?: (event: { data: number }) => void;
          };
        },
      ) => YouTubePlayer;
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

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
  "https://youtu.be/X5AORez3yb0?si=NJJdegHAh-PxNP1l",
  "https://youtu.be/GfSZXQ3YeRk?si=qmsl_EUSnmLeEcUu",
  "https://youtu.be/xtGBVFcveXA?si=KoAZk9u8CE_U9r7I",
  "https://youtu.be/xOtoSpsUv7k?si=cOCAbVs0unt8owdu",
  "https://youtu.be/PWvmtTSAFCE?si=IasK1R0oUDtzYDbn",
  "https://youtu.be/Vi8yQ2IDkdI?si=Z5ecrFteMSqu2yAk",
  "https://youtu.be/h1yL23W1L8M?si=00KmyyFHslYw2DCE",
  "https://youtu.be/CLaxmyL1sB0?si=CCFqLeTTci-4qOMs",
  "https://youtu.be/bGkAENsLH0I?si=-CR4Kz5t24A9HuUM",
  "https://youtu.be/X7T2tNqx7o8?si=_iRgOk6ccQ9RZJwv",
  "https://youtu.be/Xhuq9sSsvV4?si=C4K0165iKb1wZmub",
  "https://youtu.be/S9KpaG2p_zI?si=9Cbvvwql3n3Vl438",
  "https://youtu.be/kPjzMDPJALE?si=6BzQQ_ll81kv-i0z",
  "https://youtu.be/qiLwrukM7M8?si=AcdX-cxhOO_Xgez3",
  "https://youtu.be/yxBQz7JJVUc?si=nywXdrwmmaHXeBtz",
  "https://www.youtube.com/watch?v=k5wflKuJVkc",
  "https://www.youtube.com/watch?v=8huJqGFK9aQ&list=PL4fJ-6gBWklgkjVQSJfIUdNSS6h7emHZw&index=52",
  "https://www.youtube.com/watch?v=41Hk2wdho8Y&list=PL4fJ-6gBWklgkjVQSJfIUdNSS6h7emHZw&index=95",
  "http://youtube.com/watch?v=-XtQdgwIQSQ&list=PL4fJ-6gBWklgkjVQSJfIUdNSS6h7emHZw&index=55",
  "https://www.youtube.com/watch?v=cC9FKibVqIQ&list=PL4fJ-6gBWklgkjVQSJfIUdNSS6h7emHZw&index=51",
  "https://www.youtube.com/watch?v=MH0FxqRh2Ms&list=PL4fJ-6gBWklgkjVQSJfIUdNSS6h7emHZw&index=32",
  "https://www.youtube.com/watch?v=dbpNSfdVk_4&list=PL4fJ-6gBWklgkjVQSJfIUdNSS6h7emHZw&index=28",
  "https://www.youtube.com/watch?v=0toU8zDlwOU",
  "https://www.youtube.com/watch?v=V-eH7mU1sCs",
  "https://www.youtube.com/watch?v=oBNPA96TCRY",
  "https://www.youtube.com/watch?v=1J-LR16FQEU",
  "https://www.youtube.com/watch?v=rMA1ZsMIkyk",
  "https://www.youtube.com/watch?v=CplDvIFPBOM",
  "https://www.youtube.com/watch?v=hcmy3LIw13E",
  "https://www.youtube.com/watch?v=iZrPLX5RAtk",
  "https://www.youtube.com/watch?v=NwF2R51ao2I",
  "https://www.youtube.com/watch?v=85L5f85Ee5E",
  "https://www.youtube.com/watch?v=EuzPP1BBQuY",
  "https://www.youtube.com/watch?v=KmVYwoXHQkg",
  "https://www.youtube.com/watch?v=w0aNyBcvI-4",
  "https://www.youtube.com/watch?v=eegJR4xRnTY",
  "https://www.youtube.com/watch?v=k4x4L9jA0p0",
  "https://www.youtube.com/watch?v=_yHPBa33Lo0",
  "https://www.youtube.com/watch?v=UY3FTqE6wwA",
  "https://www.youtube.com/watch?v=I7ALfsE-5nA",
  "https://www.youtube.com/watch?v=EoGG4bH1nbE",
  "https://www.youtube.com/watch?v=R3vyj_i18Ow",
  "https://www.youtube.com/watch?v=3ePb3EL8zm0",
  "https://www.youtube.com/watch?v=qaqN6_KO8Q4",
];

const FALLBACK_DURATION_SECONDS = 180;

const VIDEO_TITLES: Record<string, string> = {
  qI5C1R1L0EQ: "411VM - #01 (1993)",
  jjVhyxiMaME: "411VM - #02 (1993)",
  ESzoVaTzniA: "411VM - #03 (1993)",
  qDU84ENFna0: "411VM - #04 (1994)",
  taKB24OWoSQ: "411VM - #05 (1994)",
  akJKOPLhm70: "411VM - #06 (1994)",
  ZK8T9l9yWyo: "411VM - #07 (1994)",
  buOnIH5PVg8: "411VM - #08 (1994)",
  aZqYoTqxgqc: "411VM - #09 (1994)",
  "-2Zy44hHSqs": "411VM - #10 (1995)",
  "Q6v4RTg-zEM": "411VM - #11 (1995)",
  rITGu0ZOUr0: "411VM - #12 (1995)",
  a8v4Y3QMHGg: "411VM - #13 (1995)",
  Q08MmfWIKrU: "411VM - #14 (1996)",
  VP35hLWePdg: "411VM - #16 (1996)",
  LZTXtvOXu9A: "411VM - #17 (1996)",
  zgZIkR4hKUQ: "411VM - #18 (1996)",
  RzH8cusmbd4: "411VM - #19 (1996)",
  BArwsRHJsFw: "411VM - #20 (1997)",
  YNyTCpydQxI: "411VM - #21 (1997)",
  vNGoIgPuqa0: "411VM - #22 (1997)",
  Myw8HOZCvus: "411VM - #23 (1997)",
  j7kjwnMQ0dk: "411VM - #24 (1997)",
  HHO1vJtzgBI: "411VM - #25 (1997)",
  qexak6IhEA0: "411VM - #26 (1998)",
  lnTBJXVvOoM: "411VM - #27 (1998)",
  "UTGe8_BM0p8": "411VM - #28 (1998)",
  Mu9sctz988c: "411VM - #29 (1998)",
  "02XmxkMDVNw": "411VM - #30 (1998)",
  "7Bkqz_Ps8ec": "411VM - #31 (1998)",
  "5O1XsBkhpno": "411VM - #32 (1999)",
  "fA_c2Q-4X5Y": "411VM - #33 (1999)",
  WxSLkhBXwPw: "411VM - #34 (1999)",
  sjWviUqwAdw: "411VM - #35 (1999)",
  "gkzjap-0KmQ": "411VM - #36 (1999)",
  "4tx2Q9pNxPc": "Toy Machine – Welcome to Hell (1996)",
  A_6FADx3hfU: "411 VM: Europe (1999)",
  "7-QFxCRO8cU": "XYZ – Stars and Bars (1995)",
  "MROEdKma7-0": "World Industries / Blind / 101 – Trilogy (1996)",
  "M-A4aYRI4kg": "Transworld – Uno (1996)",
  X5AORez3yb0: "Girl – Mouse (1996)",
  GfSZXQ3YeRk: "Underachievers: Eastern Exposure 3 (1996)",
  xtGBVFcveXA: "Shorty's – Fulfill the Dream (1998)",
  xOtoSpsUv7k: "TSA – Life in the Fast Lane (1997)",
  PWvmtTSAFCE: "Blind – Video Days (1991)",
  Vi8yQ2IDkdI: "Plan B – Questionable (1992)",
  h1yL23W1L8M: "Plan B – Virtual Reality (1993)",
  CLaxmyL1sB0: "Zero – Thrill of It All (1997)",
  bGkAENsLH0I: "Transworld – The Reason (1999)",
  X7T2tNqx7o8: "Alien Workshop – Memory Screen (1991)",
  Xhuq9sSsvV4: "Zoo York – The Mixtape (1997)",
  S9KpaG2p_zI: "Think – Damage (1996)",
  kPjzMDPJALE: "Birdhouse – The End (1998)",
  qiLwrukM7M8: "Chocolate – Las Nueve Vidas de Paco (1995)",
  yxBQz7JJVUc: "FTC – Penal Code 100A (1996)",
  k5wflKuJVkc: "New Deal – Promo Ninety Six (1996)",
  "8huJqGFK9aQ": "New Deal – Whatever (1993)",
  "41Hk2wdho8Y": "Planet Earth – Hiatus (1995)",
  "-XtQdgwIQSQ": "Alien Workshop – Timecode (1997)",
  cC9FKibVqIQ: "Plan B – Second Hand Smoke (1994)",
  MH0FxqRh2Ms: "New Deal – Children of the Sun (1994)",
  dbpNSfdVk_4: "Osiris – The Storm (1999)",
  "0toU8zDlwOU": "Girl – Goldfish (1993)",
  "V-eH7mU1sCs": "Stereo – Tincan Folklore (1996)",
  oBNPA96TCRY: "Rodney Mullen vs. Daewon Song (1997)",
  "1J-LR16FQEU": "Zero – Misled Youth (1999)",
  rMA1ZsMIkyk: "H-Street – This Is Not the New H-Street Video (1991)",
  CplDvIFPBOM: "Toy Machine – Jump Off a Building (1998)",
  hcmy3LIw13E: "World Industries – 20 Shot Sequence (1995)",
  iZrPLX5RAtk: "Blind – Tim & Henry's Pack of Lies (1992)",
  NwF2R51ao2I: "Chocolate – The Chocolate Tour (1999)",
  "85L5f85Ee5E": "Element – Fine Artists Vol. 1 (1994)",
  EuzPP1BBQuY: "Birdhouse – Ravers (1993)",
  KmVYwoXHQkg: "Birdhouse – Feasters (1992)",
  "w0aNyBcvI-4": "101 – Falling Down (1993)",
  eegJR4xRnTY: "Zoo York – Peep This (1999)",
  k4x4L9jA0p0: "5boro – Fire It Up (1999)",
  "_yHPBa33Lo0": "Eastern Exposure 2 – Dan Wolfe (1994)",
  UY3FTqE6wwA: "FTC – Finally (1993)",
  "I7ALfsE-5nA": "Antihero – Fucktards (1997)",
  EoGG4bH1nbE: "Mad Circle – 5ive Flavors (1998)",
  R3vyj_i18Ow: "Emerica – Yellow (1997)",
  "3ePb3EL8zm0": "Consolidated – Kings of Promotion (1997)",
  qaqN6_KO8Q4: "Think – Dedication (1998)",
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

let youtubeApiPromise: Promise<void> | null = null;

function loadYouTubeApi() {
  if (window.YT?.Player) return Promise.resolve();
  if (youtubeApiPromise) return youtubeApiPromise;

  youtubeApiPromise = new Promise<void>((resolve) => {
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

  return youtubeApiPromise;
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

    let player: YouTubePlayer | undefined;

    player = new window.YT!.Player(mount, {
      videoId,
      playerVars: {
        autoplay: 0,
        controls: 0,
        rel: 0,
        playsinline: 1,
      },
      events: {
        onReady: (event) => cleanup(Math.round(event.target.getDuration?.() || FALLBACK_DURATION_SECONDS)),
        onError: () => cleanup(FALLBACK_DURATION_SECONDS),
      },
    });
  });
}

type ChannelItem = {
  id: string;
  duration: number;
};

function pickRandomSlot(playlist: ChannelItem[]) {
  const index = Math.floor(Math.random() * playlist.length);
  const item = playlist[index];
  return { index, item, offsetSeconds: 0 };
}

function useMobileLandscapeGate() {
  const [isMobilePortrait, setIsMobilePortrait] = useState(false);

  useEffect(() => {
    const coarseMedia = window.matchMedia("(pointer: coarse)");
    const portraitMedia = window.matchMedia("(orientation: portrait)");
    const narrowMedia = window.matchMedia("(max-width: 899px)");

    const check = () => {
      const nextIsPortrait = coarseMedia.matches && narrowMedia.matches && portraitMedia.matches;
      setIsMobilePortrait(nextIsPortrait);
    };

    check();
    coarseMedia.addEventListener?.("change", check);
    portraitMedia.addEventListener?.("change", check);
    narrowMedia.addEventListener?.("change", check);
    window.addEventListener("orientationchange", check);

    return () => {
      coarseMedia.removeEventListener?.("change", check);
      portraitMedia.removeEventListener?.("change", check);
      narrowMedia.removeEventListener?.("change", check);
      window.removeEventListener("orientationchange", check);
    };
  }, []);

  return isMobilePortrait;
}

export default function Home() {
  const ids = useMemo(() => YOUTUBE_URLS.map((url) => extractYouTubeId(url)).filter((id): id is string => Boolean(id)), []);
  const [playlist, setPlaylist] = useState<ChannelItem[] | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [mountedSlot, setMountedSlot] = useState<{ id: string; index: number; offsetSeconds: number } | null>(null);
  const [muted, setMuted] = useState(true);
  const [playerNonce, setPlayerNonce] = useState(0);
  const [playerReady, setPlayerReady] = useState(false);
  const [showStandby, setShowStandby] = useState(true);
  const [backgroundReady, setBackgroundReady] = useState(false);
  const [showLoadingShop, setShowLoadingShop] = useState(true);
  const playerMountRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<YouTubePlayer | null>(null);
  const isMobilePortrait = useMobileLandscapeGate();

  useEffect(() => {
    setPlaylist(ids.map((id) => ({ id, duration: FALLBACK_DURATION_SECONDS })));
  }, [ids]);

  const startRandomChannel = () => {
    if (!playlist?.length || isMobilePortrait) return;
    const slot = pickRandomSlot(playlist);
    setMountedSlot({
      id: slot.item.id,
      index: slot.index,
      offsetSeconds: 0,
    });
    setPlayerReady(false);
    setShowStandby(true);
    setPlayerNonce((value) => value + 1);
    setHasStarted(true);
  };

  useEffect(() => {
    if (!playlist?.length || isMobilePortrait || hasStarted) return;
    startRandomChannel();
  }, [playlist, isMobilePortrait, hasStarted]);

  useEffect(() => {
    if (!playlist?.length) return;

    const ensureLandscapePlayback = () => {
      const portrait = window.innerHeight > window.innerWidth && window.innerWidth < 900 && window.matchMedia("(pointer: coarse)").matches;
      if (portrait) return;
      if (!hasStarted) {
        startRandomChannel();
      }
    };

    window.addEventListener("orientationchange", ensureLandscapePlayback);
    window.addEventListener("pageshow", ensureLandscapePlayback);

    return () => {
      window.removeEventListener("orientationchange", ensureLandscapePlayback);
      window.removeEventListener("pageshow", ensureLandscapePlayback);
    };
  }, [playlist, isMobilePortrait, hasStarted]);

  const renderSlot = mountedSlot;

  useEffect(() => {
    const resetStartup = () => {
      setBackgroundReady(false);
      setPlayerReady(false);
      setShowStandby(true);
      setShowLoadingShop(true);
      window.setTimeout(() => {
        setShowLoadingShop(false);
      }, 1200);
    };

    resetStartup();
    window.addEventListener("pageshow", resetStartup);

    return () => {
      window.removeEventListener("pageshow", resetStartup);
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (isMobilePortrait) return;
    setBackgroundReady(false);
    setPlayerReady(false);
    setShowStandby(true);
    setShowLoadingShop(true);
    const timer = window.setTimeout(() => {
      setShowLoadingShop(false);
    }, 1200);
    return () => window.clearTimeout(timer);
  }, [isMobilePortrait, playerNonce]);

  useEffect(() => {
    if (!renderSlot || isMobilePortrait || !playerMountRef.current) return;

    let cancelled = false;
    const mountNode = playerMountRef.current;
    mountNode.innerHTML = "";
    setPlayerReady(false);

    const mountPlayer = async () => {
      const w = window as typeof window & { YT?: any };
      await loadYouTubeApi();
      if (cancelled || !w.YT?.Player) return;

      const player = new w.YT.Player(mountNode, {
        videoId: renderSlot.id,
        playerVars: {
          autoplay: 1,
          mute: muted ? 1 : 0,
          controls: 0,
          loop: 1,
          playlist: renderSlot.id,
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
          widget_referrer: window.location.origin,
        },
        events: {
          onReady: (event: { target: YouTubePlayer }) => {
            if (muted) event.target.mute?.();
            else event.target.unMute?.();
            event.target.playVideo?.();
          },
          onStateChange: (event: { data: number }) => {
            if (event.data === 3 || event.data === w.YT?.PlayerState?.PLAYING) {
              setPlayerReady(true);
            }
          },
          onError: () => {
            setPlayerReady(true);
          },
        },
      });

      playerRef.current = player;
    };

    mountPlayer();

    return () => {
      cancelled = true;
      playerRef.current?.destroy();
      playerRef.current = null;
      mountNode.innerHTML = "";
    };
  }, [renderSlot?.id, renderSlot?.index, playerNonce, isMobilePortrait]);

  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;
    if (muted) player.mute?.();
    else player.unMute?.();
  }, [muted]);

  useEffect(() => {
    if (isMobilePortrait) return;
    const timer = window.setTimeout(() => {
      setShowStandby(false);
    }, 3000);
    return () => window.clearTimeout(timer);
  }, [isMobilePortrait, playerNonce]);

  const currentTitle = renderSlot ? VIDEO_TITLES[renderSlot.id] ?? "Unknown clip" : "";

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-black">
      {showLoadingShop && (
        <div className="pointer-events-none absolute inset-0 z-40 flex items-center justify-center bg-black/92 text-[clamp(0.6rem,1.9vw,1.3rem)] uppercase tracking-[0.32em] text-[#d7d0bc]">
          LOADING SHOP<span className="ml-1 inline-flex w-[2.4em] justify-start" aria-hidden="true"><span className="animate-pulse [animation-duration:1.2s]">...</span></span>
        </div>
      )}

      <div className="absolute left-1/2 top-[58%] h-[max(46.136vw,100vh)] w-[max(100vw,216.744vh)] -translate-x-1/2 -translate-y-1/2 overflow-hidden bg-black lg:top-1/2">
        <div className="relative h-full w-full [container-type:size]">
          <div className="absolute left-[26.82%] top-[calc(15.92%-4.5px)] z-0 h-[52.16%] w-[46.36%]">
            <div className="relative h-full w-full overflow-hidden rounded-[2.5%] bg-black">
              {renderSlot && !isMobilePortrait ? (
                <>
                  <div className="pointer-events-none h-full w-full overflow-hidden">
                    <div ref={playerMountRef} className="h-full w-full scale-[1.12] origin-center" />
                  </div>
                  {showStandby && !showLoadingShop && (
                    <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center bg-black">
                      <div className="relative aspect-[4/3] h-full w-full overflow-hidden bg-[#111]">
                        <div className="absolute inset-0 opacity-90 [background:linear-gradient(to_right,#c9c9c9_0_14.285%,#caca00_14.285%_28.57%,#21c7cb_28.57%_42.855%,#00d100_42.855%_57.14%,#cb20c8_57.14%_71.425%,#d10000_71.425%_85.71%,#1a12cb_85.71%_100%)]" />
                        <div className="absolute left-0 right-0 top-[66.5%] h-[8.5%] [background:linear-gradient(to_right,#1520d6_0_14.285%,#111_14.285%_28.57%,#cb20c8_28.57%_42.855%,#111_42.855%_57.14%,#21c7cb_57.14%_71.425%,#111_71.425%_85.71%,#c9c9c9_85.71%_100%)]" />
                        <div className="absolute bottom-0 left-0 right-0 top-[75%] [background:linear-gradient(to_right,#0b2b63_0_18%,#f3f3f3_18%_36%,#3c0a74_36%_54%,#111_54%_72%,#1a1a1a_72%_84%,#101010_84%_100%)]" />
                        <div className="absolute bottom-0 right-[7%] top-[75%] w-[18%] [background:linear-gradient(to_right,#0f0f0f_0_38%,#1d1d1d_38%_64%,#111_64%_100%)]" />
                        <div className="absolute inset-0 opacity-[0.08] mix-blend-screen [background-image:linear-gradient(to_bottom,rgba(255,255,255,0.22)_0,rgba(255,255,255,0.08)_1px,transparent_1px,transparent_5px)] [background-size:100%_5px]" />
                        <div className="absolute inset-0 animate-[standby-flicker_0.22s_steps(2,end)_infinite] opacity-[0.08] mix-blend-screen [background-image:linear-gradient(to_bottom,rgba(255,255,255,0.18)_0,rgba(255,255,255,0.04)_1px,transparent_1px,transparent_3px)] [background-size:100%_3px]" />
                        <div className="absolute inset-x-0 top-[-12%] h-[28%] animate-[standby-roll_6s_linear_infinite] bg-[linear-gradient(to_bottom,rgba(255,255,255,0.0),rgba(255,255,255,0.12),rgba(255,255,255,0.0))] opacity-[0.12] mix-blend-screen" />
                        <div className="absolute inset-0 opacity-[0.06] [background-image:radial-gradient(circle_at_center,rgba(255,255,255,0.6)_0,transparent_55%)]" />
                        <div className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 bg-black px-5 py-2 text-center text-[clamp(0.78rem,1.35vw,1rem)] uppercase tracking-[0.18em] text-white shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_10px_20px_rgba(0,0,0,0.45)]">
                          PLEASE STAND BY
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : null}

              {isMobilePortrait && (
                <div className="absolute inset-0 z-20 flex h-full w-full items-center justify-center overflow-hidden bg-black" aria-label="Rotate phone to view">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_58%)]" />
                  <div className="absolute inset-0 opacity-15 mix-blend-screen [background-image:linear-gradient(to_bottom,rgba(255,255,255,0.08)_0,rgba(255,255,255,0.02)_1px,transparent_1px,transparent_6px)] [background-size:100%_6px]" />
                  <div className="relative z-10 flex max-w-[80%] flex-col items-center gap-5 text-center text-[#d7d0bc]">
                    <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border border-[#d7d0bc]/45 bg-black/35 backdrop-blur-sm">
                      <video
                        className="h-full w-full object-cover"
                        autoPlay
                        loop
                        muted
                        playsInline
                        preload="metadata"
                        poster="/mobile-kickflip-poster.jpg"
                        aria-hidden="true"
                      >
                        <source src="/mobile-kickflip-loop.webm" type="video/webm" />
                        <source src="/mobile-kickflip-loop-optimized.mp4" type="video/mp4" />
                        <source src="/mobile-kickflip-loop.mp4" type="video/mp4" />
                      </video>
                    </div>
                    <div className="text-[11px] uppercase tracking-[0.32em]">
                      KICKFLIP YOUR SCREEN
                      <br />
                      HORIZONTALLY TO VIEW
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {!isMobilePortrait && (
            <img
              src="/skate-shop-bg.webp"
              alt="Skateshop TV background"
              className="pointer-events-none absolute inset-0 z-10 h-full w-full object-fill"
              onLoad={() => setBackgroundReady(true)}
            />
          )}

          {hasStarted && currentTitle && !isMobilePortrait && playerReady && (
            <div
              className="pointer-events-none absolute left-1/2 top-[80.0%] z-20 -translate-x-1/2 text-center text-[#d7d0bc] drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]"
              style={{ fontFamily: "ImpactLabelReversed, Arial Black, sans-serif" }}
            >
              <div className="bg-black leading-none tracking-[0.06em] uppercase" style={{ padding: "0 1px", fontSize: "1.18cqw" }}>
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
