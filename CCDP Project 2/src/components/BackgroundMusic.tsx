import { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    __bgmAudio?: HTMLAudioElement;
  }
}

type BackgroundMusicProps = {
  // Put one or more tracks here; default is just Paper Wars
  srcList?: string[];
  initialVolume?: number; // 0..1
};

/**
 * Background music that:
 * - Starts after first user interaction (browser policy)
 * - Remembers on/off and volume in localStorage
 * - Ensures ONLY ONE audio element plays (singleton guard)
 */
export function BackgroundMusic({
  srcList = ["/audio/Paper Wars.mp3"],
  initialVolume = 0.5,
}: BackgroundMusicProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [trackIndex, setTrackIndex] = useState<number>(() => {
    const saved = localStorage.getItem('bgm_track_index');
    const parsed = saved ? Number(saved) : 0;
    return Number.isFinite(parsed)
      ? Math.max(0, Math.min(parsed, Math.max(0, srcList.length - 1)))
      : 0;
  });
  const [isEnabled, setIsEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('bgm_enabled');
    return saved ? saved === 'true' : true;
  });
  const [volume, setVolume] = useState<number>(() => {
    const saved = localStorage.getItem('bgm_volume');
    return saved ? Math.min(1, Math.max(0, Number(saved))) : initialVolume;
  });
  const [hasAttemptedAutoplay, setHasAttemptedAutoplay] = useState(false);

  // Apply volume
  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = volume;
  }, [volume]);

  // Singleton: ensure only one BGM instance plays
  useEffect(() => {
    if (!audioRef.current) return;
    if (window.__bgmAudio && window.__bgmAudio !== audioRef.current) {
      try { window.__bgmAudio.pause(); } catch {}
    }
    window.__bgmAudio = audioRef.current;
    return () => {
      if (window.__bgmAudio === audioRef.current) {
        try { window.__bgmAudio.pause(); } catch {}
        window.__bgmAudio = undefined;
      }
    };
  }, []);

  // Persist toggles
  useEffect(() => {
    localStorage.setItem('bgm_enabled', String(isEnabled));
  }, [isEnabled]);

  useEffect(() => {
    localStorage.setItem('bgm_volume', String(volume));
  }, [volume]);

  useEffect(() => {
    localStorage.setItem('bgm_track_index', String(trackIndex));
  }, [trackIndex]);

  // Start after first interaction
  useEffect(() => {
    const handleFirstInteraction = async () => {
      if (!audioRef.current) return;
      if (!isEnabled) return;
      if (hasAttemptedAutoplay) return;
      setHasAttemptedAutoplay(true);
      try {
        await audioRef.current.play();
      } catch {
        // user can press Music On manually
      }
    };
    window.addEventListener('click', handleFirstInteraction, { once: true });
    window.addEventListener('keydown', handleFirstInteraction, { once: true });
    window.addEventListener('touchstart', handleFirstInteraction, { once: true });
    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, [isEnabled, hasAttemptedAutoplay]);

  const toggle = async () => {
    const next = !isEnabled;
    setIsEnabled(next);
    if (!audioRef.current) return;
    if (next) {
      try { await audioRef.current.play(); } catch {}
    } else {
      audioRef.current.pause();
    }
  };

  const playNext = async () => {
    if (srcList.length <= 1) {
      // Single track: restart
      if (!audioRef.current) return;
      audioRef.current.currentTime = 0;
      try { if (isEnabled) await audioRef.current.play(); } catch {}
      return;
    }
    const nextIndex = (trackIndex + 1) % srcList.length;
    setTrackIndex(nextIndex);
    if (!audioRef.current) return;
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    try { if (isEnabled) await audioRef.current.play(); } catch {}
  };

  return (
    <>
      <audio
        data-bgm="true"
        ref={audioRef}
        src={srcList[trackIndex]}
        preload="auto"
        onEnded={playNext}
      />
      <div
        className="fixed bottom-4 right-4 z-50 bg-black/70 text-white border border-white/10 rounded-md px-3 py-2 backdrop-blur-sm flex items-center gap-3 shadow-lg"
        style={{ fontFamily: 'JetBrains Mono, monospace' }}
      >
        <button
          onClick={toggle}
          className={`px-3 py-1 rounded font-bold transition-colors ${isEnabled ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-700'}`}
          title={isEnabled ? 'Music: On' : 'Music: Off'}
        >
          {isEnabled ? 'Music On' : 'Music Off'}
        </button>

        {srcList.length > 1 && (
          <button
            onClick={playNext}
            className="px-2 py-1 rounded bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-bold"
            title="Next track"
          >
            Next
          </button>
        )}

        <div className="flex items-center gap-2">
          <span className="text-xs opacity-80">Vol</span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-28 accent-cyan-500"
            aria-label="Background music volume"
          />
        </div>
      </div>
    </>
  );
}