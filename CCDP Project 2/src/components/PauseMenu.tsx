import { motion, AnimatePresence } from 'motion/react';
import { AchievementBadge } from './AchievementBadge';
import { achievements } from '../data/achievements';
import { Volume2, VolumeX } from 'lucide-react';
import { useEffect, useState } from 'react';

interface PauseMenuProps {
  isPaused: boolean;
  onResume: () => void;
  onExit: () => void;
  unlockedAchievements: string[];
  health: number;
  corruption: number;
  currentFloor: number;
  logsCollected: number;
}

export function PauseMenu({
  isPaused,
  onResume,
  onExit,
  unlockedAchievements,
  health,
  corruption,
  currentFloor,
  logsCollected
}: PauseMenuProps) {
  const [isMuted, setIsMuted] = useState<boolean>(() => {
    const saved = localStorage.getItem('bgm_enabled');
    return saved ? saved !== 'true' : false;
  });

  useEffect(() => {
    const sync = () => {
      const saved = localStorage.getItem('bgm_enabled');
      setIsMuted(saved ? saved !== 'true' : false);
    };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  const toggleSound = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    const enabled = !nextMuted;
    window.dispatchEvent(new CustomEvent('bgm:setEnabled', { detail: enabled }));
    localStorage.setItem('bgm_enabled', String(enabled));
  };

  return (
    <AnimatePresence>
      {isPaused && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md"
          style={{ fontFamily: 'JetBrains Mono, monospace' }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="bg-gray-900/95 border-2 border-cyan-500/50 rounded-2xl p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto"
          >
            {/* Header, stats, achievements — unchanged */}

            {/* Action Buttons */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex gap-4 justify-center items-center"
            >
              <button
                onClick={toggleSound}
                className="px-6 py-4 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-bold tracking-wider transition-all duration-300 border-2 border-gray-600/50"
              >
                <span className="flex items-center gap-2">
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  {isMuted ? 'SOUND: OFF' : 'SOUND: ON'}
                </span>
              </button>
              <button
                onClick={onResume}
                className="px-8 py-4 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-bold tracking-wider transition-all duration-300 border-2 border-cyan-400/50 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-500/50"
              >
                RESUME MISSION
              </button>
            </motion.div>

            {/* Keyboard hint, etc. */}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}