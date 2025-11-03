import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SkipForward, Crosshair, Target, Zap } from 'lucide-react';
import ballroomImage from 'figma:asset/ca901b29453018089577073da7adea355d2f5c06.png';
import bossImage from 'figma:asset/584c05d2dc76ef9629b49bfbd0eb06c4b2b85b8f.png';
import { EvidenceScanner } from '../EvidenceScanner';

interface Floor1BallroomProps {
  onComplete: () => void;
  onFail: () => void;
  onCollectLog?: (logId: string) => void;
  collectedLogs?: string[];
}

export function Floor1Ballroom({ onComplete, onCollectLog, collectedLogs = [] }: Floor1BallroomProps) {
  const [phase, setPhase] = useState<'cutscene' | 'combat' | 'boss-finale' | 'victory'>('cutscene');
  const [currentFrame, setCurrentFrame] = useState(0);
  const [showText, setShowText] = useState(true);
  
  // Combat state
  const [currentKey, setCurrentKey] = useState<string>('');
  const [bossHealth, setBossHealth] = useState(100);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [showFeedback, setShowFeedback] = useState<'hit' | 'critical' | 'miss' | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [keyChangeTimer, setKeyChangeTimer] = useState(2.0);
  const [screenShake, setScreenShake] = useState(false);

  // Boss finale state
  const [finaleFrame, setFinaleFrame] = useState(1); // 1: battle, 2: zoom, 3: scope, 4: defeated
  const [showShootPrompt, setShowShootPrompt] = useState(false);
  const [shotFired, setShotFired] = useState(false);
  const [recoilEffect, setRecoilEffect] = useState(false);

  const frames = [
    {
      title: "FLOOR 1 - THE BALLROOM",
      subtitle: "FINAL DESCENT",
      description: "The elevator descends into darkness.",
      duration: 3000,
    },
    {
      title: "THREAT DETECTED",
      subtitle: "SCANNING...",
      description: "Massive mechanical presence ahead.",
      duration: 3000,
    },
    {
      title: "NAHRAN TITAN-7",
      subtitle: "⚠️ EXTREME THREAT ⚠️",
      description: "NAHRAN's ultimate defence guardian.",
      duration: 3500,
    },
    {
      title: "SYSTEM ACTIVATION",
      subtitle: ">>>HOSTILE LOCKED<<<",
      description: "The Titan's eyes glow crimson.",
      duration: 3500,
      shake: true,
    },
    {
      title: "AGENT CROSS",
      subtitle: "WEAPONS FREE",
      description: "Elena is safe. End this threat.",
      duration: 3000,
    },
  ];

  const combatKeys = ['W', 'A', 'S', 'D', 'Q', 'E'];

  // Cutscene logic
  useEffect(() => {
    if (phase !== 'cutscene') return;

    const frame = frames[currentFrame];
    const textTimer = setTimeout(() => setShowText(false), frame.duration - 500);
    const frameTimer = setTimeout(() => {
      if (currentFrame < frames.length - 1) {
        setCurrentFrame(prev => prev + 1);
        setShowText(true);
      } else {
        setPhase('combat');
      }
    }, frame.duration);

    return () => {
      clearTimeout(textTimer);
      clearTimeout(frameTimer);
    };
  }, [currentFrame, phase]);

  // Key timer countdown
  useEffect(() => {
    if (phase !== 'combat' || !gameStarted) return;

    const timer = setInterval(() => {
      setKeyChangeTimer(prev => {
        if (prev <= 0.1) {
          setShowFeedback('miss');
          setCombo(0);
          setTimeout(() => setShowFeedback(null), 400);
          generateNewKey();
          return 2.0;
        }
        return prev - 0.05;
      });
    }, 50);

    return () => clearInterval(timer);
  }, [phase, gameStarted]);

  const generateNewKey = () => {
    const newKey = combatKeys[Math.floor(Math.random() * combatKeys.length)];
    setCurrentKey(newKey);
    setKeyChangeTimer(2.0);
  };

  useEffect(() => {
    if (phase === 'combat' && gameStarted && !currentKey) {
      generateNewKey();
    }
  }, [phase, gameStarted]);

  // Handle keyboard input for combat - LETTER-BASED SYSTEM
  useEffect(() => {
    if (phase !== 'combat' || !gameStarted) return;

    const handleKeyPress = (event: KeyboardEvent) => {
      const pressedKey = event.key.toUpperCase();
      
      // Check if correct key was pressed
      if (pressedKey === currentKey) {
        event.preventDefault();
        const isCritical = keyChangeTimer > 1.5;
        const damage = isCritical ? 8 : 5;
        const newHealth = Math.max(0, bossHealth - damage);
        const newCombo = combo + 1;
        
        setBossHealth(newHealth);
        setCombo(newCombo);
        setMaxCombo(Math.max(maxCombo, newCombo));
        setShowFeedback(isCritical ? 'critical' : 'hit');
        setScreenShake(true);
        
        setTimeout(() => {
          setShowFeedback(null);
          setScreenShake(false);
        }, 400);

        // Trigger cinematic finale at 25% health
        if (newHealth <= 25 && newHealth > 0) {
          setPhase('boss-finale');
          return;
        }

        generateNewKey();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [phase, currentKey, gameStarted, bossHealth, combo, maxCombo, keyChangeTimer]);

  // ============================================
  // BOSS FINALE CINEMATIC SEQUENCE
  // ============================================

  // Auto-progress finale frames
  useEffect(() => {
    if (phase !== 'boss-finale') return;

    if (finaleFrame === 1) {
      const timer = setTimeout(() => setFinaleFrame(2), 2000);
      return () => clearTimeout(timer);
    }
    
    if (finaleFrame === 2) {
      const timer = setTimeout(() => {
        setFinaleFrame(3);
        setShowShootPrompt(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [phase, finaleFrame]);

  // Handle space bar to shoot in scope view
  useEffect(() => {
    if (phase !== 'boss-finale' || finaleFrame !== 3 || shotFired) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        setShotFired(true);
        setShowShootPrompt(false);
        setRecoilEffect(true);
        
        setTimeout(() => {
          setRecoilEffect(false);
          setBossHealth(0);
          setFinaleFrame(4);
        }, 300);

        setTimeout(() => {
          setPhase('victory');
        }, 4000);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [phase, finaleFrame, shotFired]);

  // CUTSCENE PHASE
  if (phase === 'cutscene') {
    const frame = frames[currentFrame];
    
    return (
      <motion.div
        className="min-h-screen relative overflow-hidden bg-black flex items-center justify-center"
        animate={frame.shake ? { x: [0, -5, 5, -3, 3, 0], y: [0, 3, -3, 2, -2, 0] } : {}}
        transition={{ duration: 0.5, repeat: frame.shake ? 3 : 0 }}
      >
        <div className="absolute inset-0">
          <motion.img
            src={ballroomImage}
            alt="Ballroom"
            className="w-full h-full object-cover"
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 10, ease: 'easeOut' }}
            style={{ filter: 'brightness(0.3)' }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black opacity-70" />
        </div>

        {(currentFrame === 2 || currentFrame === 3) && (
          <motion.div
            className="absolute inset-0 bg-red-500/20"
            animate={{ opacity: [0, 0.3, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}

        <AnimatePresence mode="wait">
          {showText && (
            <motion.div
              key={currentFrame}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6 }}
              className="relative z-10 text-center max-w-4xl px-8"
            >
              <motion.div className="text-red-400 text-sm tracking-widest mb-4">
                {frame.subtitle}
              </motion.div>
              <motion.h1
                className={`text-6xl font-bold mb-6 ${
                  currentFrame === 2 ? 'text-red-500' : 
                  currentFrame === 3 || currentFrame === 4 ? 'text-orange-400' : 
                  'text-white'
                }`}
              >
                {frame.title}
              </motion.h1>
              <motion.p className="text-gray-400 text-xl">
                {frame.description}
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1 }}
          onClick={() => {
            setPhase('combat');
            setCurrentFrame(frames.length - 1);
          }}
          className="fixed bottom-8 right-8 z-50 px-6 py-3 bg-red-600/80 hover:bg-red-500 border-2 border-red-400 rounded-lg backdrop-blur-sm transition-all duration-300 flex items-center gap-2 group"
        >
          <span className="text-white font-bold">SKIP</span>
          <SkipForward className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
        </motion.button>
      </motion.div>
    );
  }

  // BOSS FINALE - FRAME 1: Battle View at 25% Health
  if (phase === 'boss-finale' && finaleFrame === 1) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black overflow-hidden"
        style={{ fontFamily: 'JetBrains Mono, monospace' }}
      >
        {/* Ballroom Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-950/40 via-gray-900 to-black">
          <div className="absolute top-10 left-1/4 w-32 h-32 bg-yellow-200/10 rounded-full blur-3xl" />
          <div className="absolute top-10 right-1/4 w-32 h-32 bg-yellow-200/10 rounded-full blur-3xl" />
          
          <motion.div
            className="absolute inset-0"
            animate={{ opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="absolute top-1/3 left-10 w-2 h-2 bg-red-500 rounded-full shadow-lg shadow-red-500/50" />
            <div className="absolute top-1/2 right-20 w-2 h-2 bg-orange-500 rounded-full shadow-lg shadow-orange-500/50" />
          </motion.div>

          <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-gray-800/50 to-transparent">
            <div className="absolute inset-0 opacity-20" style={{
              backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 50px, rgba(255,255,255,0.03) 50px, rgba(255,255,255,0.03) 100px)',
            }} />
          </div>
        </div>

        {/* Boss Character */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          animate={{ 
            y: [0, -10, 0],
            scale: [1, 1.02, 1]
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <div className="relative">
            <img 
              src={bossImage} 
              alt="Boss"
              className="w-96 h-96 object-contain drop-shadow-2xl"
            />
            <div className="absolute inset-0 bg-red-500/20 blur-2xl" />
          </div>
        </motion.div>

        {/* Boss Health Bar */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 w-full max-w-2xl px-8">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="space-y-2"
          >
            <div className="flex items-center justify-between text-sm">
              <span className="text-red-400 tracking-wider flex items-center gap-2">
                <Target className="w-4 h-4" />
                FINAL BOSS
              </span>
              <span className="text-red-400 animate-pulse">
                CRITICAL: 25%
              </span>
            </div>
            <div className="relative h-8 bg-gray-900 border-2 border-red-500/50 rounded overflow-hidden">
              <motion.div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-red-600 to-red-400"
                initial={{ width: '100%' }}
                animate={{ width: '25%' }}
                transition={{ duration: 1 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </motion.div>
              
              <motion.div
                className="absolute inset-0 border-2 border-red-500"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            </div>
          </motion.div>
        </div>

        {/* Alert */}
        <motion.div
          className="absolute top-32 left-1/2 -translate-x-1/2"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: 'spring' }}
        >
          <div className="px-8 py-3 bg-red-600/90 border-2 border-red-400 rounded-lg backdrop-blur-sm">
            <div className="text-white text-center tracking-wider flex items-center gap-2">
              <Zap className="w-5 h-5 animate-pulse" />
              <span>CRITICAL HEALTH DETECTED - PREPARING FINAL SHOT</span>
              <Zap className="w-5 h-5 animate-pulse" />
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  // BOSS FINALE - FRAME 2: Camera Zoom
  if (phase === 'boss-finale' && finaleFrame === 2) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black overflow-hidden"
        style={{ fontFamily: 'JetBrains Mono, monospace' }}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-purple-950/60 via-gray-900 to-black"
          animate={{ scale: 1.5 }}
          transition={{ duration: 2 }}
        >
          <div className="absolute inset-0 backdrop-blur-sm" />
        </motion.div>

        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          initial={{ scale: 1 }}
          animate={{ 
            scale: 2.5,
            y: -50
          }}
          transition={{ duration: 2, ease: 'easeInOut' }}
        >
          <div className="relative">
            <img 
              src={bossImage} 
              alt="Boss"
              className="w-96 h-96 object-contain drop-shadow-2xl"
            />
            <motion.div
              className="absolute inset-0 bg-red-500/30 blur-3xl"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          </div>
        </motion.div>

        <motion.div
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          <div className="text-cyan-400 tracking-widest text-sm flex items-center gap-2">
            <Crosshair className="w-5 h-5" />
            ACQUIRING TARGET...
            <Crosshair className="w-5 h-5" />
          </div>
        </motion.div>

        <motion.div
          className="absolute top-1/4 left-1/4 right-1/4 bottom-1/4"
          animate={{ scale: [1.2, 1, 1.2] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-cyan-400" />
          <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-cyan-400" />
          <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-cyan-400" />
          <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-cyan-400" />
        </motion.div>
      </motion.div>
    );
  }

  // BOSS FINALE - FRAME 3: Sniper Scope View
  if (phase === 'boss-finale' && finaleFrame === 3) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black overflow-hidden"
        style={{ fontFamily: 'JetBrains Mono, monospace' }}
      >
        {/* Black background outside scope */}
        <div className="absolute inset-0 bg-black" />

        {/* Circular scope viewport with boss image */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="relative w-[600px] h-[600px] rounded-full overflow-hidden"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            style={{ 
              boxShadow: '0 0 0 9999px black, 0 0 60px 10px rgba(34, 211, 238, 0.5)',
            }}
          >
            {/* Boss Image - centered and scaled within circular scope */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ scale: 1.2 }}
              animate={{ scale: recoilEffect ? 1.5 : 1 }}
              transition={{ duration: recoilEffect ? 0.1 : 0 }}
            >
              <img 
                src={bossImage} 
                alt="Boss Target"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/60" />
            </motion.div>
          </motion.div>
        </div>

        {/* Sniper Scope Overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.div
            className="relative w-[600px] h-[600px]"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Scope circle border */}
            <div className="absolute inset-0 rounded-full border-4 border-cyan-400/80 shadow-2xl shadow-cyan-400/50" />
            
            {/* Inner rings */}
            <motion.div
              className="absolute inset-[50px] rounded-full border-2 border-cyan-400/40"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.div
              className="absolute inset-[100px] rounded-full border border-cyan-400/30"
              animate={{ scale: [1, 1.03, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            />

            {/* Crosshairs */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="absolute w-full h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent" />
              <div className="absolute h-full w-[2px] bg-gradient-to-b from-transparent via-red-500 to-transparent" />
              
              <motion.div
                className="w-3 h-3 bg-red-500 rounded-full shadow-lg shadow-red-500/50"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
              
              <div className="w-12 h-12 border-2 border-red-500/60 rounded-full" />
              <div className="w-20 h-20 border border-red-500/40 rounded-full" />
            </div>

            {/* Rangefinder marks */}
            <div className="absolute top-1/2 left-4 -translate-y-1/2 space-y-1">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="flex items-center gap-1">
                  <div className={`h-[1px] bg-cyan-400 ${i % 2 === 0 ? 'w-4' : 'w-2'}`} />
                  {i % 2 === 0 && (
                    <span className="text-cyan-400 text-[10px]">{(10 - i) * 10}</span>
                  )}
                </div>
              ))}
            </div>

            {/* HUD Info */}
            <div className="absolute top-4 left-4 flex items-center gap-2 text-cyan-400 text-xs">
              <span>WIND: 0.2 m/s</span>
            </div>

            <div className="absolute top-4 right-4 text-cyan-400 text-xs text-right">
              <div>RANGE: 45.3m</div>
              <div className="text-green-400">LOCKED</div>
            </div>

            {/* Mil-dots */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="absolute w-full h-full">
                {[1, 2, 3].map((i) => (
                  <div key={`dots-${i}`}>
                    <div className="absolute left-1/2 -translate-x-1/2 w-1 h-1 bg-red-400 rounded-full" style={{ top: `${50 - i * 10}%` }} />
                    <div className="absolute left-1/2 -translate-x-1/2 w-1 h-1 bg-red-400 rounded-full" style={{ top: `${50 + i * 10}%` }} />
                    <div className="absolute top-1/2 -translate-y-1/2 w-1 h-1 bg-red-400 rounded-full" style={{ left: `${50 - i * 10}%` }} />
                    <div className="absolute top-1/2 -translate-y-1/2 w-1 h-1 bg-red-400 rounded-full" style={{ left: `${50 + i * 10}%` }} />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
          
          {/* Lens glare */}
          <motion.div
            className="absolute top-1/4 right-1/4 w-32 h-32 bg-white/20 rounded-full blur-2xl"
            animate={{ 
              opacity: [0.1, 0.3, 0.1],
              scale: [1, 1.2, 1]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        </div>

        {/* Recoil flash */}
        {recoilEffect && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-white"
          />
        )}

        {/* Shoot Prompt */}
        <AnimatePresence>
          {showShootPrompt && !shotFired && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="absolute bottom-12 left-1/2 -translate-x-1/2 pointer-events-none"
            >
              <motion.div
                className="px-10 py-5 bg-gradient-to-br from-red-600 via-red-500 to-orange-500 border-4 border-yellow-400 rounded-xl backdrop-blur-md shadow-2xl shadow-red-500/80"
                animate={{ 
                  scale: [1, 1.08, 1],
                  boxShadow: [
                    '0 20px 60px rgba(239, 68, 68, 0.6)',
                    '0 25px 80px rgba(239, 68, 68, 0.9)',
                    '0 20px 60px rgba(239, 68, 68, 0.6)',
                  ]
                }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <div className="text-white text-center tracking-wider">
                  <motion.div 
                    className="text-2xl"
                    animate={{ opacity: [0.8, 1, 0.8] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                  >
                    Press the <span className="text-yellow-300 px-2 py-1 bg-black/40 rounded mx-1">SPACEBAR</span> to launch the mega-bullet.
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scope HUD info */}
        <div className="absolute bottom-4 left-4 right-4 flex justify-between text-xs text-cyan-400 pointer-events-none">
          <div className="space-y-1">
            <div>MAGNIFICATION: 8x</div>
            <div>STABILITY: 98%</div>
          </div>
          <div className="space-y-1 text-right">
            <div className="text-green-400">TARGET ACQUIRED</div>
            <div>SHOT AUTHORIZED</div>
          </div>
        </div>
      </motion.div>
    );
  }

  // BOSS FINALE - FRAME 4: Boss Defeated
  if (phase === 'boss-finale' && finaleFrame === 4) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-black flex items-center justify-center overflow-hidden"
        style={{ fontFamily: 'JetBrains Mono, monospace' }}
      >
        {/* Explosion effect - Optimized */}
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 3, opacity: 0 }}
          transition={{ duration: 1 }}
        >
          <div className="absolute inset-0 bg-red-500" />
        </motion.div>

        {/* Shockwave rings - Optimized */}
        {[0, 0.2, 0.4].map((delay, i) => (
          <motion.div
            key={i}
            className="absolute inset-0 flex items-center justify-center"
            initial={{ scale: 0, opacity: 0.8 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{ duration: 1.2, delay }}
          >
            <div className="w-32 h-32 border-4 border-red-400 rounded-full" />
          </motion.div>
        ))}

        {/* Victory Text - Optimized */}
        <motion.div
          className="relative z-10 text-center space-y-6"
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 250, damping: 15 }}
        >
          <motion.div
            className="relative"
            animate={{ 
              textShadow: [
                '0 0 20px rgba(239, 68, 68, 0.8)',
                '0 0 40px rgba(239, 68, 68, 1)',
                '0 0 20px rgba(239, 68, 68, 0.8)',
              ]
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <h1 className="text-7xl font-bold text-red-500 tracking-wider">BOSS</h1>
            <h1 className="text-7xl font-bold text-red-500 tracking-wider">DEFEATED</h1>
          </motion.div>

          <div className="space-y-2">
            <motion.div
              className="h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent"
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ delay: 1, duration: 1 }}
            />
            <motion.div
              className="text-cyan-400 tracking-widest text-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 }}
            >
              TARGET ELIMINATED
            </motion.div>
            <motion.div
              className="h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent"
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ delay: 1, duration: 1 }}
            />
          </div>

          <motion.div
            initial={{ scale: 0, rotate: 180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 2, type: 'spring' }}
            className="inline-flex items-center gap-3 px-6 py-3 bg-green-600/20 border-2 border-green-400 rounded-full"
          >
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xl">✓</span>
            </div>
            <span className="text-green-400 tracking-wider">MISSION COMPLETE</span>
          </motion.div>
        </motion.div>

        {/* Particle effects - Optimized count */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-orange-400 rounded-full"
              style={{ left: '50%', top: '50%' }}
              initial={{ scale: 0, x: 0, y: 0 }}
              animate={{
                scale: [0, 1, 0],
                x: Math.cos((i / 12) * Math.PI * 2) * 300,
                y: Math.sin((i / 12) * Math.PI * 2) * 300,
              }}
              transition={{ duration: 1.5, delay: 0.3 + (i * 0.04) }}
            />
          ))}
        </div>
      </motion.div>
    );
  }

  // VICTORY PHASE
  if (phase === 'victory') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen relative overflow-hidden bg-black flex items-center justify-center"
      >
        <div className="absolute inset-0">
          <motion.img
            src={ballroomImage}
            alt="Ballroom"
            className="w-full h-full object-cover"
            animate={{ 
              filter: ['brightness(0.2)', 'brightness(0.6)', 'brightness(0.2)'],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>

        <motion.div
          className="absolute inset-0 bg-green-500"
          animate={{ opacity: [0.5, 0] }}
          transition={{ duration: 1 }}
        />

        <div className="relative z-10 text-center">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', duration: 1 }}
          >
            <motion.div
              className="text-8xl font-bold text-green-400 mb-6"
              animate={{
                textShadow: [
                  '0 0 20px rgba(74, 222, 128, 0.5)',
                  '0 0 60px rgba(74, 222, 128, 1)',
                  '0 0 20px rgba(74, 222, 128, 0.5)'
                ]
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              TITAN ELIMINATED!
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="space-y-4"
            >
              <p className="text-green-300 text-3xl">
                NAHRAN-7 Tower Breach Complete
              </p>
              <div className="text-cyan-400 text-xl tracking-wider">
                MAX COMBO: {maxCombo}x
              </div>
            </motion.div>
          </motion.div>
        </div>

        <EvidenceScanner
          objectName="NAHRAN CORE FRAGMENT"
          caption="AI core fragment. Heavily damaged. Contains encrypted data about Project ECLIPSE and Elena's transformation."
          icon="⚡"
          position="right"
          logId="f1_nahran_core_fragment"
          onScanned={() => onCollectLog?.('f1_nahran_core_fragment')}
          isCollected={collectedLogs?.includes('f1_nahran_core_fragment')}
        />

        {/* End Mission Button - appears after victory celebration */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3, type: 'spring' }}
          className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50"
        >
          <motion.button
            onClick={onComplete}
            className="relative px-12 py-5 bg-gradient-to-r from-green-600 to-cyan-600 hover:from-green-500 hover:to-cyan-500 text-white rounded-lg border-2 border-green-400 shadow-2xl shadow-green-500/50 overflow-hidden group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Animated shine effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
            />
            
            <span className="relative z-10 tracking-widest font-bold text-xl flex items-center gap-3">
              <span>END MISSION</span>
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                →
              </motion.span>
            </span>
          </motion.button>
        </motion.div>
      </motion.div>
    );
  }

  // COMBAT PHASE
  return (
    <motion.div
      className="min-h-screen relative overflow-hidden bg-black"
      animate={screenShake ? { x: [0, -5, 5, 0], y: [0, 3, -3, 0] } : {}}
      transition={{ duration: 0.2 }}
    >
      <AnimatePresence>
        {showFeedback === 'hit' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.3, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-orange-500 z-50 pointer-events-none"
          />
        )}
        {showFeedback === 'critical' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.5, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-red-500 z-50 pointer-events-none"
          />
        )}
        {showFeedback === 'miss' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.2, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-gray-800 z-50 pointer-events-none"
          />
        )}
      </AnimatePresence>

      <div className="absolute inset-0">
        <img
          src={ballroomImage}
          alt="Ballroom"
          className="w-full h-full object-cover"
          style={{ filter: 'brightness(0.4)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />
      </div>

      <motion.div
        className="absolute inset-0 bg-red-500/10"
        animate={{ opacity: [0.05, 0.15, 0.05] }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      {!gameStarted ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute inset-0 flex items-center justify-center z-40"
        >
          <div className="text-center space-y-8">
            <motion.h1
              className="text-7xl font-bold text-red-500"
              animate={{
                textShadow: [
                  '0 0 20px rgba(239, 68, 68, 0.5)',
                  '0 0 40px rgba(239, 68, 68, 1)',
                  '0 0 20px rgba(239, 68, 68, 0.5)'
                ]
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              NAHRAN TITAN-7
            </motion.h1>
            <p className="text-cyan-400 text-2xl tracking-wider">
              PRESS THE CORRECT KEYS WHEN PROMPTED
            </p>
            <motion.button
              onClick={() => setGameStarted(true)}
              className="px-12 py-6 bg-gradient-to-r from-red-600 to-orange-600 text-white text-2xl font-bold border-2 border-red-400 rounded-lg shadow-2xl shadow-red-500/50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              BEGIN COMBAT
            </motion.button>
          </div>
        </motion.div>
      ) : (
        <>
          {/* BOSS HEALTH BAR - BOTTOM CENTER - Compact and below letters */}
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-full max-w-xl px-8 z-40">
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-lg shadow-red-500/50" />
                  <span className="text-red-400 tracking-wider font-bold">NAHRAN TITAN-7</span>
                </div>
                <span className="text-cyan-400 font-bold">HP: {bossHealth}%</span>
              </div>
              <div className="relative h-6 bg-black/90 border-2 border-red-500/50 rounded overflow-hidden shadow-2xl shadow-red-500/30">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500"
                  animate={{ width: `${bossHealth}%` }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </motion.div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white font-bold text-xs drop-shadow-lg">{bossHealth}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* COMBO COUNTER - TOP LEFT - Positioned below HUD */}
          <div className="absolute top-40 left-8 z-30 space-y-1">
            <div className="text-cyan-400 tracking-wider">COMBO</div>
            <motion.div
              className="text-5xl font-bold"
              animate={{
                color: combo > 5 ? '#f59e0b' : combo > 3 ? '#3b82f6' : '#06b6d4',
                scale: combo > 0 ? [1, 1.1, 1] : 1
              }}
              transition={{ duration: 0.3 }}
            >
              {combo}x
            </motion.div>
          </div>

          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="relative">
              <motion.div
                className="text-9xl font-bold text-white px-16 py-8 bg-black/60 rounded-2xl border-4 border-cyan-500 shadow-2xl"
                style={{
                  textShadow: '0 0 30px rgba(59, 130, 246, 0.8), 0 0 60px rgba(59, 130, 246, 0.5)',
                }}
                animate={{
                  borderColor: ['rgba(59, 130, 246, 1)', 'rgba(34, 211, 238, 1)', 'rgba(59, 130, 246, 1)']
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                {currentKey || 'W'}
              </motion.div>
              <motion.div
                className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-96 h-4 bg-gray-900 rounded-full overflow-hidden border-2 border-cyan-500/50 shadow-lg"
              >
                <motion.div
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                  animate={{ width: `${(keyChangeTimer / 2.0) * 100}%` }}
                  transition={{ duration: 0.05 }}
                />
              </motion.div>
            </div>
          </motion.div>

          <AnimatePresence>
            {showFeedback && (
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.5 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.5 }}
                className="absolute top-1/3 left-1/2 -translate-x-1/2 z-50"
              >
                <div
                  className={`text-6xl font-bold ${
                    showFeedback === 'critical' ? 'text-red-400' :
                    showFeedback === 'hit' ? 'text-orange-400' :
                    'text-gray-400'
                  }`}
                  style={{
                    textShadow: showFeedback === 'critical' 
                      ? '0 0 30px rgba(248, 113, 113, 1)'
                      : showFeedback === 'hit'
                      ? '0 0 30px rgba(251, 146, 60, 1)'
                      : 'none'
                  }}
                >
                  {showFeedback === 'critical' ? 'CRITICAL!' : showFeedback === 'hit' ? 'HIT!' : 'MISS!'}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </motion.div>
  );
}
