import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Trophy, Users, LogOut, Volume2, VolumeX } from 'lucide-react';
import menuBackground from 'figma:asset/b00db653c87198d8fda227bb86ec5ebfc66823e7.png';

interface MainMenuProps {
  onStartGame: () => void;
  onAchievements: () => void;
  onCredits: () => void;
  onQuit?: () => void;
}

export function MainMenu({ onStartGame, onAchievements, onCredits, onQuit }: MainMenuProps) {
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);
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

  const menuButtons = [
    {
      id: 'start',
      label: 'Start Game',
      icon: Play,
      action: onStartGame,
      accent: 'from-red-600 to-orange-600',
      glow: 'red',
    },
    {
      id: 'achievements',
      label: 'Achievements',
      icon: Trophy,
      action: onAchievements,
      accent: 'from-cyan-600 to-blue-600',
      glow: 'cyan',
    },
    {
      id: 'credits',
      label: 'Credits',
      icon: Users,
      action: onCredits,
      accent: 'from-indigo-600 to-purple-600',
      glow: 'indigo',
    },
  ];

  const glowColors = {
    red: 'rgba(220, 38, 38, 0.4)',
    cyan: 'rgba(6, 182, 212, 0.4)',
    indigo: 'rgba(99, 102, 241, 0.4)',
    gray: 'rgba(75, 85, 99, 0.4)',
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-black flex items-center justify-center">
      {/* Background, particles, title, buttons — unchanged */}
      {/* ... all your existing JSX above and below remains the same ... */}

      {/* Menu Buttons */}
      {/* keep your existing buttons block here (unchanged) */}

      {/* Sound Toggle (now controls background music) */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        onClick={toggleSound}
        className="mb-8 text-gray-500 hover:text-white transition-colors duration-300 flex items-center gap-2"
      >
        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        <span className="text-sm tracking-wider text-[rgb(192,192,192)]">
          {isMuted ? 'SOUND: OFF' : 'SOUND: ON'}
        </span>
      </motion.button>

      {/* Rest of your component JSX (bottom info, corners, etc.) */}
    </div>
  );
}