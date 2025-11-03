import { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    __bgmAudio?: HTMLAudioElement;
  }
}

type BackgroundMusicProps = {
  // One or more tracks; default is just Paper Wars
  srcList?: string[];
  initialVolume?: number; // 0..1
};

/**
 * Background music that:
 * - Starts after first user interaction (browser policy)
 * - Remembers on/off and volume in localStorage
 * - Ensures ONLY ONE audio element plays (singleton guard)
 * - Exposes controls via window events:
 *   - window.dispatchEvent(new CustomEvent('bgm:setEnabled', { detail: boolean }))
 *   - window.dispatchEvent(new CustomEvent('bgm:setVolume', { detail: number }))
 *   - window.dispatchEvent(new Event('bgm:toggle'))
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
        // user can press SOUND: ON manually
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

  // External controls via window events
  useEffect(() => {
    const onSetEnabled = (e: Event) => {
      const enabled = (e as CustomEvent<boolean>).detail;
      setIsEnabled(Boolean(enabled));
      if (!audioRef.current) return;
      if (enabled) {
        audioRef.current.play().catch(() => {});
      } else {
        audioRef.current.pause();
      }
    };
    const onToggle = () => { void toggle(); };
    const onSetVolume = (e: Event) => {
      const v = (e as CustomEvent<number>).detail;
      setVolume(Math.min(1, Math.max(0, Number(v))));
    };
    window.addEventListener('bgm:setEnabled', onSetEnabled as EventListener);
    window.addEventListener('bgm:toggle', onToggle as EventListener);
    window.addEventListener('bgm:setVolume', onSetVolume as EventListener);
    return () => {
      window.removeEventListener('bgm:setEnabled', onSetEnabled as EventListener);
      window.removeEventListener('bgm:toggle', onToggle as EventListener);
      window.removeEventListener('bgm:setVolume', onSetVolume as EventListener);
    };
  }, []);

  return (
    <audio
      data-bgm="true"
      ref={audioRef}
      src={srcList[trackIndex]}
      preload="auto"
      onEnded={playNext}
    />
  );
}