import { useEffect, useRef, useState } from 'react';

type BackgroundMusicProps = {
  /** One or more paths to audio files under public/, e.g., ["/audio/Steel Symphony.mp3", "/audio/Steel and Thunder.mp3"] */
  srcList?: string[];
  /** Initial volume between 0 and 1 */
  initialVolume?: number;
};

/**
 * Plays background music in a loop after the user's first interaction (to comply with browser autoplay policies).
 * Persists play state and volume in localStorage between sessions.
 */
export function BackgroundMusic({ srcList = ["/audio/Steel Symphony.mp3"], initialVolume = 0.5 }: BackgroundMusicProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [trackIndex, setTrackIndex] = useState<number>(() => {
    const saved = localStorage.getItem('bgm_track_index');
    const parsed = saved ? Number(saved) : 0;
    return Number.isFinite(parsed) ? Math.max(0, Math.min(parsed, Math.max(0, srcList.length - 1))) : 0;
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

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    localStorage.setItem('bgm_enabled', String(isEnabled));
  }, [isEnabled]);

  useEffect(() => {
    localStorage.setItem('bgm_volume', String(volume));
  }, [volume]);

  useEffect(() => {
    localStorage.setItem('bgm_track_index', String(trackIndex));
  }, [trackIndex]);

  // Try to start playback on first user interaction if enabled
  useEffect(() => {
    const handleFirstInteraction = async () => {
      if (!audioRef.current) return;
      if (!isEnabled) return;
      if (hasAttemptedAutoplay) return;
      setHasAttemptedAutoplay(true);
      try {
        await audioRef.current.play();
      } catch {
        // Autoplay may still fail; user can press play manually using the control
      }
    };

    // Attach multiple common interaction events
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
    const nextIndex = (trackIndex + 1) % srcList.length;
    setTrackIndex(nextIndex);
    if (!audioRef.current) return;
    // Force reload and play next track if enabled
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    try {
      if (isEnabled) {
        await audioRef.current.play();
      }
    } catch {}
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={srcList[trackIndex]}
        preload="auto"
        onEnded={playNext}
      />
      {/* Minimal floating control */}
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
        <button
          onClick={playNext}
          className="px-2 py-1 rounded bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-bold"
          title="Next track"
        >
          Next
        </button>
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


