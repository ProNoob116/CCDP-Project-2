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
    { id: 'start', label: 'Start Game', icon: Play, action: onStartGame, accent: 'from-red-600 to-orange-600', glow: 'red' },
    { id: 'achievements', label: 'Achievements', icon: Trophy, action: onAchievements, accent: 'from-cyan-600 to-blue-600', glow: 'cyan' },
    { id: 'credits', label: 'Credits', icon: Users, action: onCredits, accent: 'from-indigo-600 to-purple-600', glow: 'indigo' },
  ];

  const glowColors = {
    red: 'rgba(220, 38, 38, 0.4)',
    cyan: 'rgba(6, 182, 212, 0.4)',
    indigo: 'rgba(99, 102, 241, 0.4)',
    gray: 'rgba(75, 85, 99, 0.4)',
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-black flex items-center justify-center">
      {/* Background Image with Blur */}
      <div className="absolute inset-0">
        <motion.img
          src={menuBackground}
          alt="Background"
          className="w-full h-full object-cover"
          style={{ filter: 'brightness(0.5) blur(3px)' }}
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50" />
      </div>

      {/* Cinematic Vignette */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black opacity-50" />

      {/* Ambient Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: Math.random() * 3 + 1,
              height: Math.random() * 3 + 1,
              background: i % 3 === 0
                ? 'rgba(220, 38, 38, 0.3)'
                : i % 3 === 1
                ? 'rgba(59, 130, 246, 0.3)'
                : 'rgba(99, 102, 241, 0.2)',
            }}
            animate={{ y: [0, -100, 0], opacity: [0.2, 0.8, 0.2], scale: [1, 1.5, 1] }}
            transition={{ duration: 8 + Math.random() * 5, repeat: Infinity, delay: Math.random() * 5, ease: 'easeInOut' }}
          />
        ))}
      </div>

      {/* Scan Lines Effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none opacity-5"
        style={{ backgroundImage: 'linear-gradient(transparent 50%, rgba(255, 255, 255, 0.05) 50%)', backgroundSize: '100% 4px' }}
        animate={{ backgroundPositionY: ['0px', '4px'] }}
        transition={{ duration: 0.1, repeat: Infinity, ease: 'linear' }}
      />

      {/* Main Content Container */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="relative z-10 flex flex-col items-center justify-center px-8 w-full max-w-2xl"
      >
        {/* Game Logo / Title */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8, ease: 'easeOut' }}
          className="text-center mb-12"
        >
          <motion.div
            animate={{
              textShadow: [
                '0 0 40px rgba(220, 38, 38, 0.95), 0 0 80px rgba(220, 38, 38, 0.7), 0 0 120px rgba(220, 38, 38, 0.5), 0 0 160px rgba(220, 38, 38, 0.3), 0 6px 16px rgba(0, 0, 0, 0.9)',
                '0 0 60px rgba(220, 38, 38, 1), 0 0 100px rgba(220, 38, 38, 0.8), 0 0 140px rgba(220, 38, 38, 0.6), 0 0 200px rgba(220, 38, 38, 0.4), 0 6px 16px rgba(0, 0, 0, 0.9)',
                '0 0 40px rgba(220, 38, 38, 0.95), 0 0 80px rgba(220, 38, 38, 0.7), 0 0 120px rgba(220, 38, 38, 0.5), 0 0 160px rgba(220, 38, 38, 0.3), 0 6px 16px rgba(0, 0, 0, 0.9)',
              ],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="text-8xl md:text-9xl tracking-[0.2em] mb-1 relative"
            style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 900, WebkitTextStroke: '2px rgba(220, 38, 38, 0.5)' }}
          >
            <span className="bg-gradient-to-b from-red-300 via-red-400 to-red-600 bg-clip-text text-transparent relative inline-block text-[128px] font-[Jersey_25] font-[Roboto_Mono] font-bold font-normal">
              NAHRAN
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-red-500/70 to-transparent shadow-[0_0_10px_rgba(220,38,38,0.6)]" />
            </span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{
              opacity: 1,
              y: 0,
              textShadow: [
                '0 0 40px rgba(59, 130, 246, 0.95), 0 0 80px rgba(59, 130, 246, 0.7), 0 0 120px rgba(59, 130, 246, 0.5), 0 0 160px rgba(59, 130, 246, 0.3), 0 6px 16px rgba(0, 0, 0, 0.9)',
                '0 0 60px rgba(59, 130, 246, 1), 0 0 100px rgba(59, 130, 246, 0.8), 0 0 140px rgba(59, 130, 246, 0.6), 0 0 200px rgba(59, 130, 246, 0.4), 0 6px 16px rgba(0, 0, 0, 0.9)',
                '0 0 40px rgba(59, 130, 246, 0.95), 0 0 80px rgba(59, 130, 246, 0.7), 0 0 120px rgba(59, 130, 246, 0.5), 0 0 160px rgba(59, 130, 246, 0.3), 0 6px 16px rgba(0, 0, 0, 0.9)',
              ],
            }}
            transition={{ delay: 0.6, duration: 0.6, textShadow: { duration: 3, repeat: Infinity, ease: 'easeInOut' } }}
            className="text-7xl md:text-8xl tracking-[0.25em] mb-6"
            style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 800, WebkitTextStroke: '1px rgba(59, 130, 246, 0.4)' }}
          >
            <span className="bg-gradient-to-b from-cyan-200 via-blue-300 to-blue-500 bg-clip-text text-transparent text-[80px] font-[Sarpanch] font-bold font-normal">
              DESCENT
            </span>
          </motion.div>
          <motion.div initial={{ opacity: 0, scaleX: 0 }} animate={{ opacity: 1, scaleX: 1 }} transition={{ delay: 0.9, duration: 0.6 }} className="h-px bg-gradient-to-r from-transparent via-red-500 to-transparent mx-auto w-96" />
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 0.8 }} className="text-gray-400 text-sm tracking-widest mt-4">
            - A HEISENBERG OPERATION -
          </motion.p>
        </motion.div>

        {/* Menu Buttons */}
        <div className="w-full space-y-4 mb-12">
          {menuButtons.map((button, index) => (
            <motion.button
              key={button.id}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.4 + index * 0.1, duration: 0.5 }}
              onClick={button.action}
              onMouseEnter={() => setHoveredButton(button.id)}
              onMouseLeave={() => setHoveredButton(null)}
              className="relative w-full group"
            >
              <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-red-500 opacity-70" />
              <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-blue-500 opacity-70" />
              <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-red-500 opacity-70" />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-blue-500 opacity-70" />

              <div
                className={`
                  relative overflow-hidden
                  border-2 border-${button.glow === 'red' ? 'red' : button.glow === 'cyan' ? 'cyan' : 'indigo'}-500/30
                  transition-all duration-300 ease-out
                  ${hoveredButton === button.id ? 'scale-[1.02] border-' + (button.glow === 'red' ? 'red' : button.glow === 'cyan' ? 'cyan' : 'indigo') + '-500/60' : 'scale-100'}
                `}
                style={{
                  clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))',
                  boxShadow:
                    hoveredButton === button.id
                      ? `0 0 20px ${glowColors[button.glow as keyof typeof glowColors]}, inset 0 0 20px ${glowColors[button.glow as keyof typeof glowColors]}`
                      : 'none',
                }}
              >
                <div className="relative bg-black/95 backdrop-blur-sm px-8 py-5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button.icon className="w-6 h-6 text-white" />
                    <span className="text-white text-xl tracking-[0.15em] uppercase">
                      {button.label}
                    </span>
                  </div>
                  <motion.div animate={hoveredButton === button.id ? { x: [0, 5, 0] } : { x: 0 }} transition={{ duration: 0.6, repeat: hoveredButton === button.id ? Infinity : 0 }}>
                    <div className="text-white text-2xl">▶</div>
                  </motion.div>
                  <AnimatePresence>
                    {hoveredButton === button.id && (
                      <motion.div
                        initial={{ x: '-100%' }}
                        animate={{ x: '200%' }}
                        exit={{ x: '200%' }}
                        transition={{ duration: 1.2, ease: 'linear', repeat: Infinity }}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                      />
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <AnimatePresence>
                {hoveredButton === button.id && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 -z-10 blur-xl"
                    style={{ background: `radial-gradient(circle, ${glowColors[button.glow as keyof typeof glowColors]}, transparent 70%)` }}
                  />
                )}
              </AnimatePresence>
            </motion.button>
          ))}
        </div>

        {/* Sound Toggle */}
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

        {/* Bottom Info */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2, duration: 1 }} className="text-center space-y-2">
          <p className="text-[rgb(203,203,203)] text-xs tracking-widest">CCDP10003 PROJECT 2 SUBMISSION</p>
          <p className="text-[rgb(197,197,197)] text-xs">© By Paul Joseph, Pranav Gandham and Alex Lovering • ALL RIGHTS RESERVED</p>
        </motion.div>
      </motion.div>

      {/* Corner UI Elements */}
      <div className="absolute top-8 left-8 opacity-30"><div className="w-16 h-16 border-t-2 border-l-2 border-red-500" /></div>
      <div className="absolute top-8 right-8 opacity-30"><div className="w-16 h-16 border-t-2 border-r-2 border-blue-500" /></div>
      <div className="absolute bottom-8 left-8 opacity-30"><div className="w-16 h-16 border-b-2 border-l-2 border-red-500" /></div>
      <div className="absolute bottom-8 right-8 opacity-30"><div className="w-16 h-16 border-b-2 border-r-2 border-blue-500" /></div>
    </div>
  );
}