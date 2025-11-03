import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SkipForward } from 'lucide-react';
import { RadioMessage } from './RadioMessage';

interface CinematicEntrySequenceProps {
  onComplete: () => void;
}



export function CinematicEntrySequence({ onComplete }: CinematicEntrySequenceProps) {
  const [currentFrame, setCurrentFrame] = useState<1 | 2 | 3 | 4.5 | 4.6 | 4.7 | 4.8 | 5 | 6>(1);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isStabilizing, setIsStabilizing] = useState(false);
  const [powerPanels, setPowerPanels] = useState<number[]>([]);
  const [countdown, setCountdown] = useState(5);
  const [lockdownActive, setLockdownActive] = useState(false);
  const [popups, setPopups] = useState<Array<{ id: number; x: number; y: number; text: string }>>([]);
  const [closedPopups, setClosedPopups] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [elevatorPower, setElevatorPower] = useState(false);
  const [powerCells, setPowerCells] = useState<boolean[]>([false, false, false, false]);
  const [chargingCells, setChargingCells] = useState<Set<number>>(new Set());
  const [chargeProgress, setChargeProgress] = useState<{[key: number]: number}>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const popupCountRef = useRef(0); // Track spawned popups to prevent duplicates

  const maxPopups = 5;

  // Frame 1: Auto-transition after falling animation
  useEffect(() => {
    if (currentFrame === 1) {
      const timer = setTimeout(() => {
        setCurrentFrame(2);
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [currentFrame]);

  // Frame 1: Falling animation
  useEffect(() => {
    if (currentFrame === 1) {
      const interval = setInterval(() => {
        setScrollPosition(prev => (prev + 2) % 1000);
      }, 30);
      return () => clearInterval(interval);
    }
  }, [currentFrame]);

  // Frame 2: Check power panel sequence
  useEffect(() => {
    if (currentFrame === 2 && powerPanels.length === 3) {
      if (powerPanels[0] === 1 && powerPanels[1] === 3 && powerPanels[2] === 2) {
        setTimeout(() => {
          setCurrentFrame(3);
        }, 1500);
      } else {
        setTimeout(() => {
          setPowerPanels([]);
        }, 1000);
      }
    }
  }, [powerPanels, currentFrame]);

  // Frame 3: Countdown timer before lockdown
  useEffect(() => {
    if (currentFrame === 3 && !lockdownActive && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (currentFrame === 3 && countdown === 0 && !lockdownActive) {
      setLockdownActive(true);
      popupCountRef.current = 0; // Reset popup counter when lockdown activates
    }
  }, [currentFrame, countdown, lockdownActive]);

  // Frame 3: Generate exactly 5 popups in sequence - QUADRUPLE-CHECKED LOGIC
  useEffect(() => {
    // STRICT CHECK: Only spawn if we're on frame 3, lockdown is active, AND we have LESS than maxPopups
    // Also check ref to prevent race conditions
    if (currentFrame === 3 && lockdownActive && popups.length < maxPopups && popupCountRef.current < maxPopups && !showSuccess) {
      const timer = setTimeout(() => {
        const warningTexts = [
          'ACCESS DENIED',
          'FIREWALL ACTIVE',
          'SECURITY BREACH',
          'SYSTEM LOCKED',
          'INTRUSION DETECTED'
        ];
        
        // Quadruple-check we're still under the limit before adding
        setPopups(prev => {
          // CRITICAL: Only add if we have less than 5 popups AND ref is under limit
          if (prev.length < maxPopups && popupCountRef.current < maxPopups) {
            popupCountRef.current += 1; // Increment ref immediately to prevent race conditions
            const newPopup = {
              id: Date.now() + Math.random(), // Ensure unique IDs
              x: Math.random() * 60 + 10,
              y: Math.random() * 50 + 15,
              text: warningTexts[prev.length] // Use prev.length for correct index
            };
            return [...prev, newPopup];
          }
          return prev; // Don't add if we're at or over the limit
        });
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [currentFrame, lockdownActive, popups.length, showSuccess]);

  // Frame 3: Check if all popups closed - Skip directly to 4.5
  useEffect(() => {
    if (currentFrame === 3 && closedPopups === maxPopups && !showSuccess) {
      setShowSuccess(true);
      setTimeout(() => {
        setCurrentFrame(4.5); // Skip Frame 4 memory fragments
      }, 3000);
    }
  }, [closedPopups, currentFrame, showSuccess]);

  // Frame 4.6: Auto-progress to door breach
  useEffect(() => {
    if (currentFrame === 4.6) {
      const timer = setTimeout(() => {
        setCurrentFrame(4.7);
      }, 4000); // Character approaches door
      return () => clearTimeout(timer);
    }
  }, [currentFrame]);

  // Frame 4.7: Auto-progress to inside building
  useEffect(() => {
    if (currentFrame === 4.7) {
      const timer = setTimeout(() => {
        setCurrentFrame(4.8);
      }, 4000); // Door breach animation
      return () => clearTimeout(timer);
    }
  }, [currentFrame]);

  // Frame 4.8: Auto-progress to elevator console
  useEffect(() => {
    if (currentFrame === 4.8) {
      const timer = setTimeout(() => {
        setCurrentFrame(5);
      }, 4000); // Inside building, approaching console
      return () => clearTimeout(timer);
    }
  }, [currentFrame]);

  // Frame 5: Power cell charging logic - supports multiple cells charging simultaneously
  useEffect(() => {
    if (chargingCells.size === 0) return;

    const timer = setInterval(() => {
      setChargeProgress(prev => {
        const newProgress = { ...prev };
        const cellsToComplete: number[] = [];

        chargingCells.forEach(cellIndex => {
          const currentProgress = prev[cellIndex] || 0;
          if (currentProgress < 100) {
            newProgress[cellIndex] = currentProgress + 2;
          } else {
            cellsToComplete.push(cellIndex);
          }
        });

        // Mark fully charged cells as complete
        if (cellsToComplete.length > 0) {
          setPowerCells(prevCells => {
            const newCells = [...prevCells];
            cellsToComplete.forEach(index => {
              newCells[index] = true;
            });
            return newCells;
          });

          setChargingCells(prev => {
            const newCharging = new Set(prev);
            cellsToComplete.forEach(index => newCharging.delete(index));
            return newCharging;
          });
        }

        return newProgress;
      });
    }, 30);

    return () => clearInterval(timer);
  }, [chargingCells]);

  // Frame 5: Handle power cell click - allows multiple cells to charge
  const handlePowerCellClick = (index: number) => {
    if (!powerCells[index] && !chargingCells.has(index)) {
      setChargingCells(prev => new Set([...prev, index]));
      setChargeProgress(prev => ({ ...prev, [index]: 0 }));
    }
  };

  // Frame 5: Check if all cells charged
  const allCellsCharged = powerCells.every(cell => cell);

  // Frame 5: Complete when ready - Go to Frame 6 (Begin Descent button)
  const handlePowerComplete = () => {
    if (elevatorPower && allCellsCharged) {
      setCurrentFrame(6);
    }
  };

  // Frame 6: Begin Descent button handler
  const handleBeginDescent = () => {
    onComplete();
  };

  const handlePowerPanelClick = (panel: number) => {
    if (!powerPanels.includes(panel)) {
      setPowerPanels(prev => [...prev, panel]);
    }
  };

  const handlePopupClose = (id: number) => {
    setPopups(prev => prev.filter(p => p.id !== id));
    setClosedPopups(prev => prev + 1);
  };

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 bg-black overflow-hidden" 
      style={{ fontFamily: 'JetBrains Mono, monospace' }}
    >
      <AnimatePresence mode="wait">
        {/* Frame 1: Helicopter Landing on Helipad */}
        {currentFrame === 1 && (
          <motion.div
            key="frame1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0"
          >
            {/* Night Sky Background - Deep blue/black gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-blue-950 via-slate-950 to-black" />

            {/* Distant City Lights - Glowing Skyline */}
            <div className="absolute inset-0 overflow-hidden">
              {/* Background skyscrapers silhouettes */}
              <div className="absolute bottom-0 left-0 right-0 h-1/3">
                {Array.from({ length: 12 }).map((_, i) => (
                  <motion.div
                    key={`building-${i}`}
                    className="absolute bottom-0 bg-gradient-to-t from-slate-900 to-slate-800/50"
                    style={{
                      left: `${i * 8.5}%`,
                      width: `${Math.random() * 60 + 40}px`,
                      height: `${Math.random() * 150 + 100}px`,
                    }}
                    initial={{ opacity: 0.3 }}
                    animate={{ opacity: [0.3, 0.5, 0.3] }}
                    transition={{ 
                      duration: 3 + Math.random() * 2,
                      repeat: Infinity,
                      delay: i * 0.3
                    }}
                  >
                    {/* Building windows - glowing */}
                    {Array.from({ length: Math.floor(Math.random() * 8 + 4) }).map((_, j) => (
                      <motion.div
                        key={`window-${j}`}
                        className="absolute w-2 h-2"
                        style={{
                          left: `${20 + (j % 2) * 50}%`,
                          top: `${j * 15}%`,
                          backgroundColor: Math.random() > 0.7 ? '#fbbf24' : '#3b82f6',
                          boxShadow: `0 0 8px ${Math.random() > 0.7 ? '#fbbf24' : '#3b82f6'}`,
                        }}
                        animate={{
                          opacity: [0.6, 1, 0.6],
                        }}
                        transition={{
                          duration: 2 + Math.random(),
                          repeat: Infinity,
                          delay: Math.random() * 2
                        }}
                      />
                    ))}
                  </motion.div>
                ))}
              </div>

              {/* Atmospheric fog layers - depth */}
              {Array.from({ length: 5 }).map((_, i) => (
                <motion.div
                  key={`fog-${i}`}
                  className="absolute w-full h-48 bg-gradient-to-b from-slate-800/20 to-transparent blur-2xl"
                  style={{
                    bottom: `${i * 15}%`,
                  }}
                  animate={{
                    x: ['-20%', '20%', '-20%'],
                    opacity: [0.1, 0.3, 0.1],
                  }}
                  transition={{
                    duration: 15 + i * 3,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                />
              ))}
            </div>

            {/* Helipad Surface - Wet reflective with markings */}
            <motion.div
              className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-96 h-96"
              initial={{ scale: 0.3, y: 200, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              transition={{ duration: 3, ease: 'easeOut' }}
            >
              {/* Helipad circle */}
              <div className="relative w-full h-full">
                {/* Wet surface reflection effect */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-slate-700/40 via-slate-800/60 to-black/80 backdrop-blur-sm">
                  <motion.div
                    className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-500/10 to-cyan-400/5"
                    animate={{
                      opacity: [0.2, 0.4, 0.2],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                  />
                </div>

                {/* Landing pad markings - "H" */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    className="text-9xl font-bold text-yellow-400/80"
                    style={{
                      textShadow: '0 0 20px rgba(251, 191, 36, 0.6)',
                    }}
                    animate={{
                      opacity: [0.6, 1, 0.6],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                    }}
                  >
                    H
                  </motion.div>
                </div>

                {/* Helipad edge lights - glowing */}
                {Array.from({ length: 16 }).map((_, i) => {
                  const angle = (i / 16) * 360;
                  const x = Math.cos((angle * Math.PI) / 180) * 180;
                  const y = Math.sin((angle * Math.PI) / 180) * 180;
                  
                  return (
                    <motion.div
                      key={`light-${i}`}
                      className="absolute w-3 h-3 rounded-full bg-red-500"
                      style={{
                        left: `calc(50% + ${x}px)`,
                        top: `calc(50% + ${y}px)`,
                        boxShadow: '0 0 15px #ef4444, 0 0 30px #ef4444',
                      }}
                      animate={{
                        opacity: [0.4, 1, 0.4],
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        delay: i * 0.05,
                      }}
                    />
                  );
                })}

                {/* Helipad circle outline */}
                <div className="absolute inset-0 rounded-full border-4 border-yellow-500/40" />
              </div>
            </motion.div>

            {/* Helicopter descending from above */}
            <motion.div
              className="absolute left-1/2 transform -translate-x-1/2"
              initial={{ y: -200, scale: 0.3 }}
              animate={{ y: 180, scale: 1.2 }}
              transition={{ duration: 6, ease: 'easeOut' }}
            >
              {/* Helicopter body silhouette */}
              <div className="relative">
                {/* Helicopter spotlight cone */}
                <motion.div
                  className="absolute top-20 left-1/2 transform -translate-x-1/2 w-64 h-96 opacity-40"
                  style={{
                    background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.3), transparent)',
                    clipPath: 'polygon(40% 0%, 60% 0%, 100% 100%, 0% 100%)',
                  }}
                  animate={{
                    opacity: [0.3, 0.5, 0.3],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                />

                {/* Rotor blur effect */}
                <motion.div
                  className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-40 h-2 bg-gradient-to-r from-transparent via-slate-400/60 to-transparent blur-sm"
                  animate={{
                    rotate: [0, 360],
                    opacity: [0.4, 0.7, 0.4],
                  }}
                  transition={{
                    rotate: { duration: 0.1, repeat: Infinity, ease: 'linear' },
                    opacity: { duration: 0.5, repeat: Infinity },
                  }}
                />
                <motion.div
                  className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-40 h-2 bg-gradient-to-r from-transparent via-slate-400/60 to-transparent blur-sm"
                  animate={{
                    rotate: [90, 450],
                    opacity: [0.4, 0.7, 0.4],
                  }}
                  transition={{
                    rotate: { duration: 0.1, repeat: Infinity, ease: 'linear' },
                    opacity: { duration: 0.5, repeat: Infinity },
                  }}
                />

                {/* Helicopter body - simplified dark silhouette */}
                <div className="w-20 h-12 bg-gradient-to-b from-slate-800 to-slate-900 rounded-lg relative">
                  {/* Cockpit window glow */}
                  <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-8 h-3 bg-cyan-400/60 rounded-sm"
                    style={{ boxShadow: '0 0 10px rgba(34, 211, 238, 0.8)' }}
                  />
                  {/* Navigation lights */}
                  <motion.div
                    className="absolute -left-1 top-1/2 w-2 h-2 bg-red-500 rounded-full"
                    style={{ boxShadow: '0 0 8px #ef4444' }}
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                  <motion.div
                    className="absolute -right-1 top-1/2 w-2 h-2 bg-green-500 rounded-full"
                    style={{ boxShadow: '0 0 8px #22c55e' }}
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
                  />
                  {/* Tail */}
                  <div className="absolute -right-8 top-1/2 transform -translate-y-1/2 w-8 h-2 bg-slate-800" />
                </div>
              </div>
            </motion.div>

            {/* Wind debris particles */}
            {Array.from({ length: 40 }).map((_, i) => (
              <motion.div
                key={`debris-${i}`}
                className="absolute w-1 h-1 bg-slate-400/40 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  bottom: '20%',
                }}
                animate={{
                  y: [0, -150 - Math.random() * 100],
                  x: [(Math.random() - 0.5) * 200, (Math.random() - 0.5) * 300],
                  opacity: [0, 0.6, 0],
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  repeat: Infinity,
                  ease: 'easeOut',
                  delay: Math.random() * 3,
                }}
              />
            ))}

            {/* Agent silhouette emerging (low angle shot) */}
            <motion.div
              className="absolute bottom-24 left-1/2 transform -translate-x-1/2"
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 5, duration: 2 }}
            >
              <div className="relative">
                {/* Agent silhouette - dramatic backlit */}
                <motion.div
                  className="w-12 h-28 bg-gradient-to-b from-slate-900 to-black relative"
                  style={{
                    clipPath: 'polygon(40% 0%, 60% 0%, 65% 15%, 70% 30%, 75% 100%, 25% 100%, 30% 30%, 35% 15%)',
                  }}
                >
                  {/* Subtle cyan edge light */}
                  <div className="absolute inset-0 opacity-30"
                    style={{
                      boxShadow: 'inset 0 0 20px rgba(6, 182, 212, 0.4)',
                    }}
                  />
                </motion.div>
                
                {/* Agent shadow on helipad */}
                <div className="absolute top-28 left-1/2 transform -translate-x-1/2 w-16 h-4 bg-black/60 blur-md rounded-full" />
              </div>
            </motion.div>

            {/* Atmospheric lighting flicker */}
            <motion.div
              className="absolute inset-0 bg-cyan-400/5"
              animate={{
                opacity: [0, 0.1, 0, 0.05, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                times: [0, 0.2, 0.4, 0.6, 1],
              }}
            />

            {/* UI Overlay - Tactical HUD */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="text-center"
              >
                <motion.div 
                  className="text-cyan-400 text-sm mb-2 tracking-widest"
                  animate={{ opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  [ LANDING SEQUENCE INITIATED ]
                </motion.div>
                <div className="text-green-400 text-xs tracking-wide mb-1">ALTITUDE: 1,247M → DESCENDING</div>
                <div className="text-yellow-400 text-xs tracking-wide mb-1">LOCATION: NAHRAN-7 TOWER - HELIPAD</div>
                <div className="text-cyan-400 text-xs tracking-wide">STATUS: APPROACH VECTOR LOCKED</div>
              </motion.div>
            </div>

            {/* Corner HUD brackets */}
            <div className="absolute top-0 left-0 w-24 h-24 border-l-2 border-t-2 border-cyan-500/40" />
            <div className="absolute top-0 right-0 w-24 h-24 border-r-2 border-t-2 border-cyan-500/40" />
            <div className="absolute bottom-0 left-0 w-24 h-24 border-l-2 border-b-2 border-cyan-500/40" />
            <div className="absolute bottom-0 right-0 w-24 h-24 border-r-2 border-b-2 border-cyan-500/40" />

            {/* Transition Text */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 6.5 }}
              className="absolute bottom-12 left-0 right-0 text-center"
            >
              <motion.div
                className="text-green-400 text-lg tracking-widest"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                [ TOUCHDOWN CONFIRMED ]
              </motion.div>
              <div className="text-cyan-400 text-sm mt-2 tracking-wide">
                INITIALIZING TACTICAL SYSTEMS...
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Frame 2: System Reboot - REDESIGNED */}
        {currentFrame === 2 && (
          <motion.div
            key="frame2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="absolute inset-0"
          >
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-950/30 via-black to-blue-950/30">
              {/* Binary Rain Effect */}
              {Array.from({ length: 30 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-cyan-500/20 text-5xl font-mono"
                  style={{
                    left: `${i * 3.33}%`,
                    top: -20
                  }}
                  animate={{
                    y: [0, window.innerHeight + 50]
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    ease: 'linear',
                    delay: Math.random() * 2
                  }}
                >
                  {Math.random().toString(2).substr(2, 12).split('').join('\n')}
                </motion.div>
              ))}

              {/* Tech Grid */}
              <div className="absolute inset-0 tech-grid opacity-20" />
            </div>

            {/* Main Content */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full">
              {/* Title Section */}
              <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-center mb-16"
              >
                <h1 className="text-6xl font-bold text-cyan-400 blue-glow-title mb-4 tracking-wider">
                  SYSTEM REBOOT REQUIRED
                </h1>
                <motion.div 
                  className="text-cyan-300 text-2xl tracking-wide mb-3"
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  ⚡ CLICK PANELS IN ORDER: <span className="text-white font-bold text-3xl">1 → 3 → 2</span>
                </motion.div>
                <div className="text-cyan-600 mt-2 tracking-wide">
                  SEQUENCE PROGRESS: <span className="text-cyan-400 font-bold">{powerPanels.length}/3</span>
                </div>
              </motion.div>

              {/* Hexagonal Power Panels */}
              <div className="flex gap-12 justify-center items-center">
                {[1, 2, 3].map((panel) => {
                  const activated = powerPanels.includes(panel);
                  const isCorrect = 
                    (panel === 1 && powerPanels[0] === 1) ||
                    (panel === 3 && powerPanels[1] === 3) ||
                    (panel === 2 && powerPanels[2] === 2);
                  const isWrong = activated && !isCorrect;

                  return (
                    <motion.div
                      key={panel}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: panel * 0.2 }}
                    >
                      <motion.button
                        onClick={() => handlePowerPanelClick(panel)}
                        disabled={activated}
                        whileHover={!activated ? { scale: 1.05 } : {}}
                        whileTap={!activated ? { scale: 0.95 } : {}}
                        className={`relative w-48 h-64 transition-all duration-500 ${
                          activated ? 'cursor-not-allowed' : 'cursor-pointer'
                        }`}
                      >
                        {/* Hexagonal Container */}
                        <div className="relative w-full h-full">
                          {/* Outer Glow */}
                          <motion.div
                            className={`absolute inset-0 blur-xl rounded-2xl ${
                              isCorrect
                                ? 'bg-green-500/40'
                                : isWrong
                                  ? 'bg-red-500/40'
                                  : 'bg-cyan-500/20'
                            }`}
                            animate={!activated ? {
                              opacity: [0.2, 0.4, 0.2]
                            } : {}}
                            transition={{ duration: 2, repeat: Infinity }}
                          />

                          {/* Main Panel */}
                          <div className={`relative w-full h-full bg-gradient-to-br rounded-2xl border-2 overflow-hidden ${
                            isCorrect
                              ? 'from-green-900/40 to-green-950/60 border-green-500'
                              : isWrong
                                ? 'from-red-900/40 to-red-950/60 border-red-500'
                                : 'from-cyan-900/20 to-blue-950/40 border-cyan-500/50 hover:border-cyan-400'
                          }`}>
                            {/* Circuit Pattern Background */}
                            <div className="absolute inset-0 opacity-30">
                              <svg className="w-full h-full" viewBox="0 0 200 200">
                                <defs>
                                  <pattern id={`circuit-${panel}`} x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                                    <circle cx="5" cy="5" r="2" fill="currentColor" className={
                                      isCorrect ? 'text-green-400' : isWrong ? 'text-red-400' : 'text-cyan-400'
                                    } />
                                    <line x1="5" y1="5" x2="35" y2="5" stroke="currentColor" strokeWidth="1" className={
                                      isCorrect ? 'text-green-400' : isWrong ? 'text-red-400' : 'text-cyan-400'
                                    } />
                                    <line x1="35" y1="5" x2="35" y2="35" stroke="currentColor" strokeWidth="1" className={
                                      isCorrect ? 'text-green-400' : isWrong ? 'text-red-400' : 'text-cyan-400'
                                    } />
                                  </pattern>
                                </defs>
                                <rect width="200" height="200" fill={`url(#circuit-${panel})`} />
                              </svg>
                            </div>

                            {/* Scan Line */}
                            {!activated && (
                              <motion.div
                                className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
                                animate={{
                                  y: [0, 256, 0]
                                }}
                                transition={{
                                  duration: 3,
                                  repeat: Infinity,
                                  ease: 'linear'
                                }}
                              />
                            )}

                            {/* Corner Accents */}
                            <div className="absolute top-2 left-2 w-6 h-6 border-t-4 border-l-4 border-current" />
                            <div className="absolute top-2 right-2 w-6 h-6 border-t-4 border-r-4 border-current" />
                            <div className="absolute bottom-2 left-2 w-6 h-6 border-b-4 border-l-4 border-current" />
                            <div className="absolute bottom-2 right-2 w-6 h-6 border-b-4 border-r-4 border-current" />

                            {/* Panel Content */}
                            <div className="relative z-10 h-full flex flex-col items-center justify-center p-6">
                              {/* Status Icon */}
                              <motion.div
                                className="mb-6"
                                animate={activated ? {} : {
                                  scale: [1, 1.1, 1]
                                }}
                                transition={{ duration: 2, repeat: Infinity }}
                              >
                                {activated ? (
                                  isCorrect ? (
                                    <div className="w-20 h-20 rounded-full border-4 border-green-400 flex items-center justify-center">
                                      <svg className="w-12 h-12 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                      </svg>
                                    </div>
                                  ) : (
                                    <div className="w-20 h-20 rounded-full border-4 border-red-400 flex items-center justify-center">
                                      <svg className="w-12 h-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                                      </svg>
                                    </div>
                                  )
                                ) : (
                                  <div className="w-20 h-20 rounded-full border-4 border-cyan-400 flex items-center justify-center">
                                    <svg className="w-12 h-12 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                  </div>
                                )}
                              </motion.div>

                              {/* Panel Number */}
                              <div className={`text-5xl font-bold mb-2 tracking-wider ${
                                isCorrect ? 'text-green-400' : isWrong ? 'text-red-400' : 'text-cyan-400'
                              }`}>
                                {panel}
                              </div>

                              {/* Panel Label */}
                              <div className={`text-lg font-bold tracking-widest ${
                                isCorrect ? 'text-green-400' : isWrong ? 'text-red-400' : 'text-cyan-400'
                              }`}>
                                PANEL
                              </div>

                              {/* Status Text */}
                              <div className={`mt-4 text-xs tracking-wider ${
                                isCorrect ? 'text-green-300' : isWrong ? 'text-red-300' : 'text-cyan-300'
                              }`}>
                                {activated ? (isCorrect ? 'VERIFIED' : 'ERROR') : 'STANDBY'}
                              </div>
                            </div>

                            {/* Energy Pulse Effect */}
                            {activated && isCorrect && (
                              <motion.div
                                className="absolute inset-0 bg-green-400/20 rounded-2xl"
                                animate={{
                                  opacity: [0.5, 0, 0.5],
                                  scale: [1, 1.1, 1]
                                }}
                                transition={{ duration: 1, repeat: Infinity }}
                              />
                            )}
                          </div>
                        </div>
                      </motion.button>
                    </motion.div>
                  );
                })}
              </div>

              {/* Success Message */}
              {powerPanels.length === 3 && powerPanels[0] === 1 && powerPanels[1] === 3 && powerPanels[2] === 2 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5, y: 50 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  className="mt-16 text-center"
                >
                  <div className="bg-black/60 border-2 border-green-500 rounded-lg p-8 backdrop-blur-sm">
                    <div className="text-green-400 text-4xl font-bold green-glow-title mb-4 tracking-wider">
                      HUD SYSTEMS ONLINE
                    </div>
                    <div className="text-green-300 text-lg mb-4 tracking-wide">
                      All systems operational
                    </div>
                    <motion.div
                      className="text-red-400 text-xl tracking-wide"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      AI LOCKDOWN DETECTED
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {/* Frame 3: Lockdown Escape */}
        {currentFrame === 3 && (
          <motion.div
            key="frame3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0"
          >
            {/* Animated Tech Grid Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-950 via-black to-red-950">
              <div className="absolute inset-0 tech-grid opacity-30" />
              
              {/* Hexagonal Pattern Overlay */}
              <div className="absolute inset-0 opacity-10" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l25.98 15v30L30 60 4.02 45V15z' fill='none' stroke='%23dc2626' stroke-width='1'/%3E%3C/svg%3E")`,
                backgroundSize: '60px 60px'
              }} />

              {/* Animated Scan Lines */}
              <motion.div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(220, 38, 38, 0.3) 3px)'
                }}
                animate={{
                  backgroundPosition: ['0px 0px', '0px 100px']
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'linear'
                }}
              />
            </div>

            {/* Pulsing Red Alert */}
            <motion.div
              className="absolute inset-0 bg-red-600"
              animate={{
                opacity: [0, 0.1, 0]
              }}
              transition={{ duration: 1, repeat: Infinity }}
            />

            {/* Main Content */}
            <div className="relative z-10 h-full flex flex-col items-center justify-center">
              {/* Title */}
              <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-center mb-8"
              >
                <h1 className="text-5xl font-bold text-red-400 red-glow-title mb-2 tracking-wider">
                  SYSTEM LOCKDOWN ACTIVE
                </h1>
                <div className="text-red-300 text-lg tracking-wide">
                  NAHRAN AI SECURITY PROTOCOL ENGAGED
                </div>
              </motion.div>

              {/* Countdown or Progress Display */}
              <div className="mb-12">
                {!lockdownActive ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-center"
                  >
                    <div className="text-yellow-400 text-2xl mb-4 tracking-wider">BREACH ATTEMPT IN:</div>
                    <motion.div
                      className="text-9xl font-bold text-yellow-400 yellow-glow-title tracking-wider"
                      animate={{
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      {countdown}
                    </motion.div>
                    <div className="text-yellow-300 text-sm mt-4 tracking-wide">PREPARE TO CLOSE SECURITY WARNINGS</div>
                  </motion.div>
                ) : !showSuccess ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-black/60 border-2 border-red-500 rounded-lg p-8 backdrop-blur-sm min-w-[400px]"
                  >
                    <div className="text-red-400 text-xl mb-4 text-center tracking-wider">WARNINGS ACTIVE</div>
                    <div className="flex items-center justify-center gap-6 mb-4">
                      <div className="text-7xl font-bold text-red-400 tracking-wider">
                        {closedPopups}
                      </div>
                      <div className="text-5xl text-red-500">/</div>
                      <div className="text-7xl font-bold text-red-500 tracking-wider">
                        {maxPopups}
                      </div>
                    </div>
                    <div className="text-center text-red-300 text-sm tracking-wide">
                      WARNINGS CLOSED
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="mt-6 w-full h-6 bg-gray-900 rounded-full overflow-hidden border-2 border-red-500/50">
                      <motion.div
                        className="h-full bg-gradient-to-r from-red-600 via-red-500 to-red-400"
                        initial={{ width: 0 }}
                        animate={{ width: `${(closedPopups / maxPopups) * 100}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>

                    <div className="text-center text-cyan-400 text-xs mt-4 animate-pulse tracking-wide">
                      CLOSE ALL WARNINGS TO BREACH FIREWALL
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className="text-center"
                  >
                    <div className="text-green-400 text-6xl font-bold green-glow-title mb-4 tracking-wider">
                      [✓] FIREWALL BREACHED
                    </div>
                    <div className="text-green-300 text-xl tracking-wide">ACCESS GRANTED</div>
                    <motion.div
                      className="mt-4 text-cyan-400 text-sm tracking-wide"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      Proceeding to memory sync...
                    </motion.div>
                  </motion.div>
                )}
              </div>

              {/* Security Warning Popups - EXACTLY 5 */}
              <div className="absolute inset-0 pointer-events-none">
                <AnimatePresence>
                  {popups.map((popup) => (
                    <motion.div
                      key={popup.id}
                      initial={{ opacity: 0, scale: 0, rotate: -180 }}
                      animate={{ opacity: 1, scale: 1, rotate: 0 }}
                      exit={{ opacity: 0, scale: 0, rotate: 180 }}
                      style={{
                        position: 'absolute',
                        left: `${popup.x}%`,
                        top: `${popup.y}%`,
                      }}
                      className="pointer-events-auto"
                    >
                      {/* Hexagonal Warning Container */}
                      <div className="relative">
                        {/* Outer Glow */}
                        <motion.div
                          className="absolute -inset-2 bg-red-500/30 blur-xl rounded-lg"
                          animate={{
                            opacity: [0.3, 0.6, 0.3]
                          }}
                          transition={{ duration: 1, repeat: Infinity }}
                        />
                        
                        {/* Main Alert Box */}
                        <div className="relative bg-gradient-to-br from-red-950 to-black border-2 border-red-500 rounded-lg p-6 min-w-[320px] shadow-2xl">
                          {/* Corner Accents */}
                          <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-red-400" />
                          <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-red-400" />
                          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-red-400" />
                          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-red-400" />

                          {/* Scan Line Effect */}
                          <motion.div
                            className="absolute inset-0 h-1 bg-gradient-to-r from-transparent via-red-400 to-transparent opacity-50"
                            animate={{
                              y: [0, 80, 0]
                            }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                          />

                          {/* Header */}
                          <div className="flex items-center justify-between mb-3 relative z-10">
                            <div className="flex items-center gap-2">
                              <motion.div
                                className="w-3 h-3 bg-red-500 rounded-full"
                                animate={{ opacity: [1, 0.3, 1] }}
                                transition={{ duration: 0.8, repeat: Infinity }}
                              />
                              <div className="text-red-400 font-bold text-sm tracking-wider">SECURITY ALERT</div>
                            </div>
                            <motion.button
                              onClick={() => handlePopupClose(popup.id)}
                              whileHover={{ scale: 1.2, rotate: 90 }}
                              whileTap={{ scale: 0.9 }}
                              className="text-red-400 hover:text-red-300 font-bold text-2xl bg-black/50 w-8 h-8 rounded flex items-center justify-center border border-red-500/50 hover:border-red-400 tracking-wider"
                            >
                              ×
                            </motion.button>
                          </div>

                          {/* Warning Text */}
                          <div className="relative z-10">
                            <motion.div
                              className="text-red-300 font-bold text-lg mb-2 intense-glitch tracking-wider"
                            >
                              {popup.text}
                            </motion.div>
                            <div className="text-red-400/70 text-xs font-mono tracking-wide">
                              ERROR: 0x{Math.floor(Math.random() * 0xFFFFFF).toString(16).toUpperCase().padStart(6, '0')}
                            </div>
                            <div className="text-red-500/50 text-xs mt-1 tracking-wide">
                              NAHRAN AI DEFENSE SYSTEM
                            </div>
                          </div>

                          {/* Animated Border Pulse */}
                          <motion.div
                            className="absolute inset-0 border-2 border-red-400/50 rounded-lg"
                            animate={{
                              opacity: [0.2, 0.8, 0.2],
                              scale: [1, 1.02, 1]
                            }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Background Particles */}
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-red-500/50 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: Math.random() * 2
                }}
              />
            ))}
          </motion.div>
        )}

        {/* Frame 4.5: Mission Briefing from Commander Grey */}
        {currentFrame === 4.5 && (
          <div className="absolute inset-0">
            <RadioMessage
              speaker="COMMANDER GREY - OVERWATCH"
              message="Systems online. Location: NAHRAN-7 Tower. You need to activate the lift console to grant access into the building. Prepare for infiltration, Agent Cross."
              duration={9000}
              priority="high"
              showAvatar={true}
              cinematic={true}
              onComplete={() => setCurrentFrame(4.6)}
            />
          </div>
        )}

        {/* Frame 4.6: Approaching the Heavy Security Door - REDESIGNED */}
        {currentFrame === 4.6 && (
          <motion.div
            key="frame4.6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0"
          >
            {/* Industrial corridor background with perspective */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-800 via-slate-900 to-black">
              {/* Floor perspective grid */}
              <div className="absolute bottom-0 left-0 right-0 h-1/2 opacity-15" style={{
                backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 40px, #64748b 41px), repeating-linear-gradient(90deg, transparent, transparent 40px, #64748b 41px)',
                backgroundSize: '40px 40px',
                transform: 'perspective(400px) rotateX(65deg)',
                transformOrigin: 'center bottom'
              }} />

              {/* Ceiling panels */}
              <div className="absolute top-0 left-0 right-0 h-1/3 opacity-10" style={{
                backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 80px, #475569 81px)',
                backgroundSize: '80px 100%'
              }} />
            </div>
            
            {/* Atmospheric lighting - overhead strips */}
            {Array.from({ length: 5 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute top-0 w-32 h-2 bg-gradient-to-b from-cyan-400/20 to-transparent blur-md"
                style={{
                  left: `${15 + i * 18}%`,
                }}
                animate={{
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{
                  duration: 2 + Math.random(),
                  repeat: Infinity,
                  delay: i * 0.3
                }}
              />
            ))}
            
            {/* Agent approaching - POV zoom effect */}
            <motion.div
              initial={{ scale: 0.4, y: 100 }}
              animate={{ scale: 1.2, y: 0 }}
              transition={{ duration: 3.5, ease: 'easeOut' }}
              className="absolute inset-0 flex items-center justify-center"
            >
              {/* Heavy Security Door - REDESIGNED */}
              <div className="relative">
                {/* Outer door frame */}
                <div className="absolute -inset-6 bg-gradient-to-b from-gray-600 via-gray-700 to-gray-800 rounded-sm" />
                
                {/* Main door structure */}
                <div className="relative w-[400px] h-[620px] bg-gradient-to-br from-gray-800 via-gray-850 to-gray-900 rounded-sm shadow-2xl overflow-hidden border-4 border-gray-700">
                  
                  {/* Rivets and industrial details */}
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={`rivet-left-${i}`} className="absolute left-4 w-3 h-3 rounded-full bg-gray-600 border border-gray-500" style={{ top: `${15 + i * 25}%` }} />
                  ))}
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={`rivet-right-${i}`} className="absolute right-4 w-3 h-3 rounded-full bg-gray-600 border border-gray-500" style={{ top: `${15 + i * 25}%` }} />
                  ))}
                  
                  {/* Central door panels */}
                  <div className="absolute inset-8 border-4 border-gray-700/50 rounded-sm">
                    <div className="absolute inset-4 border-2 border-gray-600/30" />
                  </div>

                  {/* Reinforced window port */}
                  <div className="absolute top-28 left-1/2 -translate-x-1/2 w-24 h-40 rounded-sm overflow-hidden border-4 border-gray-700 shadow-inner">
                    <div className="absolute inset-0 bg-gradient-to-b from-cyan-900/20 via-slate-950/40 to-black/80">
                      {/* Wire reinforcement mesh */}
                      <div className="absolute inset-0 opacity-50" style={{
                        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 12px, #475569 13px), repeating-linear-gradient(90deg, transparent, transparent 12px, #475569 13px)'
                      }} />
                      {/* Subtle inner glow */}
                      <motion.div
                        className="absolute inset-0 bg-cyan-400/5"
                        animate={{ opacity: [0.05, 0.15, 0.05] }}
                        transition={{ duration: 3, repeat: Infinity }}
                      />
                    </div>
                  </div>

                  {/* Door handle/lever */}
                  <div className="absolute left-8 top-1/2 -translate-y-1/2 w-10 h-20 bg-gradient-to-r from-gray-600 to-gray-700 rounded-md border-2 border-gray-600 shadow-lg" />
                  
                  {/* High-tech security keypad - CLEANER DESIGN */}
                  <motion.div
                    className="absolute top-1/2 -translate-y-1/2 right-14 bg-black/95 border-2 border-cyan-500/60 rounded-lg p-5 shadow-2xl backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                  >
                    {/* Keypad header */}
                    <div className="mb-3 text-center">
                      <div className="text-cyan-400 text-[10px] tracking-widest mb-1">NAHRAN SECURITY</div>
                      <div className="h-px bg-cyan-500/30" />
                    </div>

                    {/* Display screen */}
                    <div className="mb-3 h-8 bg-gray-950 border border-cyan-600/40 rounded flex items-center justify-center">
                      <motion.div
                        className="text-cyan-400 text-xs tracking-wider font-mono"
                        animate={{ opacity: [0.6, 1, 0.6] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        ••••••
                      </motion.div>
                    </div>

                    {/* Number grid */}
                    <div className="grid grid-cols-3 gap-1.5 mb-2">
                      {[1,2,3,4,5,6,7,8,9].map(n => (
                        <div key={n} className="w-9 h-9 bg-gray-800 border border-gray-600 rounded flex items-center justify-center text-gray-400 text-xs hover:bg-gray-700 transition-colors">
                          {n}
                        </div>
                      ))}
                    </div>
                    
                    {/* Bottom row */}
                    <div className="grid grid-cols-3 gap-1.5">
                      <div className="w-9 h-9 bg-gray-800 border border-gray-600 rounded flex items-center justify-center text-red-400 text-xs">✕</div>
                      <div className="w-9 h-9 bg-gray-800 border border-gray-600 rounded flex items-center justify-center text-gray-400 text-xs">0</div>
                      <div className="w-9 h-9 bg-gray-800 border border-gray-600 rounded flex items-center justify-center text-green-400 text-xs">✓</div>
                    </div>

                    {/* Subtle scan line */}
                    <motion.div
                      className="absolute inset-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent"
                      animate={{ y: [0, 120, 0] }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                    />
                  </motion.div>

                  {/* Status indicator - TOP RIGHT */}
                  <motion.div
                    className="absolute top-6 right-6 flex items-center gap-2 bg-black/90 px-4 py-2.5 rounded-lg border-2 border-red-500/80 shadow-lg backdrop-blur-sm"
                    animate={{ 
                      opacity: [0.7, 1, 0.7],
                      boxShadow: ['0 0 10px rgba(239, 68, 68, 0.3)', '0 0 20px rgba(239, 68, 68, 0.6)', '0 0 10px rgba(239, 68, 68, 0.3)']
                    }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <div className="w-3 h-3 rounded-full bg-red-500" style={{ boxShadow: '0 0 12px #ef4444' }} />
                    <span className="text-red-400 tracking-wider font-bold text-sm">SECURED</span>
                  </motion.div>

                  {/* Warning stripes on door edges */}
                  <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b from-yellow-500/20 via-black to-yellow-500/20" style={{
                    backgroundImage: 'repeating-linear-gradient(45deg, #eab308 0px, #eab308 20px, #000 20px, #000 40px)'
                  }} />
                  <div className="absolute right-0 top-0 bottom-0 w-2 bg-gradient-to-b from-yellow-500/20 via-black to-yellow-500/20" style={{
                    backgroundImage: 'repeating-linear-gradient(-45deg, #eab308 0px, #eab308 20px, #000 20px, #000 40px)'
                  }} />

                  {/* Brushed metal texture overlay */}
                  <div className="absolute inset-0 opacity-5" style={{
                    backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255,255,255,0.1) 3px)'
                  }} />
                </div>

                {/* Heavy industrial hinges */}
                <div className="absolute -left-3 top-28 w-8 h-12 bg-gradient-to-r from-gray-700 to-gray-600 rounded-r border-2 border-gray-600 shadow-xl">
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-gray-800 border border-gray-500" />
                </div>
                <div className="absolute -left-3 bottom-28 w-8 h-12 bg-gradient-to-r from-gray-700 to-gray-600 rounded-r border-2 border-gray-600 shadow-xl">
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-gray-800 border border-gray-500" />
                </div>

                {/* Door shadow/depth */}
                <div className="absolute -inset-1 bg-black/30 blur-xl -z-10" />
              </div>
            </motion.div>

            {/* Ambient particles - dust in corridor */}
            {Array.from({ length: 15 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white/20 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -30, 0],
                  x: [(Math.random() - 0.5) * 20, (Math.random() - 0.5) * 20],
                  opacity: [0, 0.3, 0],
                }}
                transition={{
                  duration: 4 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}

            {/* Footstep audio indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.4, 0] }}
              transition={{ duration: 0.7, repeat: 5, delay: 0.5 }}
              className="absolute bottom-28 left-1/2 -translate-x-1/2 text-cyan-400/50 text-xs tracking-widest font-mono"
            >
              [ FOOTSTEPS ECHOING ]
            </motion.div>

            {/* HUD - Objective overlay */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="absolute top-24 left-24 bg-black/90 border-2 border-cyan-500/60 px-6 py-4 rounded-lg backdrop-blur-md shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <div className="text-cyan-400 text-xs tracking-widest font-bold">OBJECTIVE</div>
              </div>
              <div className="text-white text-lg tracking-wide">Breach Building Entry</div>
              <div className="text-cyan-300/70 text-xs mt-1 tracking-wide">Security Level: MAXIMUM</div>
            </motion.div>

            {/* Status text - bottom center */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2 }}
              className="absolute bottom-20 left-0 right-0 text-center"
            >
              <motion.div
                className="text-cyan-400 tracking-widest text-sm font-mono"
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                [ APPROACHING HEAVY SECURITY DOOR ]
              </motion.div>
              <div className="text-gray-500 text-xs mt-2 tracking-wide">
                Scanning for access points...
              </div>
            </motion.div>

            {/* Corner HUD brackets */}
            <div className="absolute top-0 left-0 w-20 h-20 border-l-2 border-t-2 border-cyan-500/30" />
            <div className="absolute top-0 right-0 w-20 h-20 border-r-2 border-t-2 border-cyan-500/30" />
            <div className="absolute bottom-0 left-0 w-20 h-20 border-l-2 border-b-2 border-cyan-500/30" />
            <div className="absolute bottom-0 right-0 w-20 h-20 border-r-2 border-b-2 border-cyan-500/30" />
          </motion.div>
        )}

        {/* Frame 4.7: Door Breach */}
        {currentFrame === 4.7 && (
          <motion.div
            key="frame4.7"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0"
          >
            {/* Dark background */}
            <div className="absolute inset-0 bg-black" />
            
            {/* Door close-up */}
            <motion.div
              initial={{ scale: 1 }}
              animate={{ scale: 1.2 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="w-[800px] h-[700px] bg-gradient-to-b from-gray-700 via-gray-800 to-gray-900 border-8 border-gray-600 relative overflow-hidden">
                {/* Keypad being hacked */}
                <div className="absolute top-1/2 -translate-y-1/2 right-24 bg-black/90 border-2 border-cyan-500 p-6 rounded">
                  <motion.div
                    className="text-cyan-400 text-xs mb-2 tracking-wider text-center"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  >
                    [HACKING IN PROGRESS]
                  </motion.div>
                  
                  {/* Scrolling code */}
                  <div className="w-40 h-32 bg-black/80 border border-cyan-600/50 p-2 font-mono text-[8px] text-green-400 overflow-hidden">
                    <motion.div
                      animate={{ y: [0, -200] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    >
                      {Array.from({ length: 30 }).map((_, i) => (
                        <div key={i} className="opacity-60">
                          {Math.random().toString(36).substring(2, 15)}
                        </div>
                      ))}
                    </motion.div>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-3 w-full h-2 bg-gray-900 rounded-full overflow-hidden border border-cyan-600/30">
                    <motion.div
                      className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400"
                      initial={{ width: '0%' }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 3, ease: 'easeInOut' }}
                    />
                  </div>
                </div>

                {/* Lock indicator changing */}
                <motion.div
                  className="absolute top-12 right-12 flex items-center gap-2 bg-black/80 px-6 py-3 rounded border-2"
                  initial={{ borderColor: '#ef4444' }}
                  animate={{ borderColor: '#22c55e' }}
                  transition={{ delay: 2.8, duration: 0.3 }}
                >
                  <motion.div
                    className="w-4 h-4 rounded-full"
                    initial={{ backgroundColor: '#ef4444', boxShadow: '0 0 10px #ef4444' }}
                    animate={{ backgroundColor: '#22c55e', boxShadow: '0 0 10px #22c55e' }}
                    transition={{ delay: 2.8, duration: 0.3 }}
                  />
                  <motion.span
                    className="text-lg tracking-widest font-bold"
                    initial={{ color: '#ef4444' }}
                    animate={{ color: '#22c55e' }}
                    transition={{ delay: 2.8, duration: 0.3 }}
                  >
                    UNLOCKED
                  </motion.span>
                </motion.div>

                {/* Breach success effect */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ delay: 2.8, duration: 0.5 }}
                  className="absolute inset-0 bg-green-400/30"
                />
              </div>
            </motion.div>

            {/* Screen flash when hacked */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0, 0, 0.6, 0] }}
              transition={{ delay: 2.8, duration: 0.3 }}
              className="absolute inset-0 bg-cyan-400"
            />

            {/* Status text */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute bottom-24 left-0 right-0 text-center"
            >
              <motion.div
                className="text-yellow-400 text-lg tracking-widest"
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                [ BYPASSING SECURITY SYSTEMS ]
              </motion.div>
            </motion.div>

            {/* Success message */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 2.8 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-green-950/90 border-2 border-green-500 rounded-xl px-12 py-6 backdrop-blur-sm"
            >
              <div className="text-green-400 text-3xl font-bold tracking-widest text-center green-glow-title">
                [✓] ACCESS GRANTED
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Frame 4.8: Inside Building - Approaching Console */}
        {currentFrame === 4.8 && (
          <motion.div
            key="frame4.8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0"
          >
            {/* Interior background - dark lobby */}
            <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-slate-950 to-black">
              {/* Floor tiles perspective */}
              <div className="absolute bottom-0 left-0 right-0 h-1/2 opacity-10" style={{
                backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 50px, #475569 51px), repeating-linear-gradient(90deg, transparent, transparent 50px, #475569 51px)',
                backgroundSize: '50px 50px',
                transform: 'perspective(500px) rotateX(60deg)',
                transformOrigin: 'center bottom'
              }} />
            </div>

            {/* Ambient interior lighting */}
            <div className="absolute top-0 left-1/4 w-48 h-96 bg-red-500/10 blur-3xl" />
            <div className="absolute top-0 right-1/4 w-48 h-96 bg-cyan-500/10 blur-3xl" />

            {/* Elevator console ahead */}
            <motion.div
              initial={{ scale: 0.3, y: 200 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ duration: 3, ease: 'easeOut' }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="relative">
                {/* Console panel */}
                <div className="w-96 h-[500px] bg-gradient-to-b from-gray-800 via-gray-900 to-black border-4 border-gray-700 rounded-lg p-8 relative">
                  {/* NAHRAN branding */}
                  <div className="text-center mb-6">
                    <div className="text-red-500 text-2xl font-bold tracking-widest" style={{ textShadow: '0 0 10px rgba(239, 68, 68, 0.5)' }}>
                      NAHRAN-7
                    </div>
                    <div className="text-gray-500 text-xs tracking-wide">LIFT CONTROL SYSTEM</div>
                  </div>

                  {/* Status screen */}
                  <div className="bg-black/90 border-2 border-cyan-600/30 rounded p-6 mb-6">
                    <motion.div
                      className="text-red-400 text-center text-sm mb-2 tracking-wider"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      SYSTEM OFFLINE
                    </motion.div>
                    <div className="text-gray-600 text-xs text-center tracking-wide">
                      POWER RESTORATION REQUIRED
                    </div>

                    {/* Power indicator lights - all off */}
                    <div className="flex justify-center gap-2 mt-4">
                      {Array.from({ length: 7 }).map((_, i) => (
                        <div key={i} className="w-3 h-3 rounded-full bg-gray-800 border border-gray-700" />
                      ))}
                    </div>
                  </div>

                  {/* Floor buttons - all dark */}
                  <div className="grid grid-cols-2 gap-3">
                    {['F7', 'F6', 'F5', 'F4', 'F3', 'F2', 'F1', 'F0'].map((floor) => (
                      <div
                        key={floor}
                        className="bg-gray-900 border border-gray-700 rounded py-3 px-4 text-center text-gray-700 text-sm tracking-wider"
                      >
                        {floor}
                      </div>
                    ))}
                  </div>

                  {/* Corner accents */}
                  <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-cyan-600/30" />
                  <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-cyan-600/30" />
                  <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-cyan-600/30" />
                  <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-cyan-600/30" />
                </div>

                {/* Console stand/base */}
                <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-32 h-24 bg-gradient-to-b from-gray-700 to-gray-900" style={{
                  clipPath: 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)'
                }} />
              </div>
            </motion.div>

            {/* Agent hand reaching toward console (first-person view) */}
            <motion.div
              initial={{ x: -200, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 2, duration: 1 }}
              className="absolute bottom-0 left-0 w-64 h-64"
            >
              {/* Simplified hand silhouette */}
              <div className="absolute bottom-0 left-20 w-32 h-48 bg-gradient-to-t from-slate-800 to-slate-900/50" style={{
                clipPath: 'polygon(30% 50%, 35% 20%, 45% 0%, 55% 0%, 60% 15%, 70% 5%, 75% 15%, 75% 40%, 100% 40%, 100% 100%, 0% 100%, 0% 60%)'
              }} />
            </motion.div>

            {/* UI Overlay */}
            <div className="absolute top-24 left-24 bg-black/80 border border-cyan-500/50 px-6 py-3 rounded backdrop-blur-sm">
              <div className="text-cyan-400 text-sm tracking-wider">OBJECTIVE:</div>
              <div className="text-white text-lg tracking-wide">Restore Elevator Power</div>
            </div>

            {/* Status text */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.5 }}
              className="absolute bottom-24 left-0 right-0 text-center"
            >
              <div className="text-yellow-400 tracking-widest mb-2">[ LIFT CONSOLE LOCATED ]</div>
              <motion.div
                className="text-cyan-400 text-sm tracking-wide"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                Initializing power restoration sequence...
              </motion.div>
            </motion.div>
          </motion.div>
        )}

        {/* Frame 5: Elevator Boot Up */}
        {currentFrame === 5 && (
          <motion.div
            key="frame5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            {/* Industrial Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-black to-gray-800">
              <div className="absolute inset-0 tech-grid opacity-20" />
            </div>

            {/* Instruction Popup */}
            <AnimatePresence>
              {elevatorPower && !allCellsCharged && chargingCells.size === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.9 }}
                  transition={{ delay: 0.5 }}
                  className="fixed top-24 left-1/2 -translate-x-1/2 z-50"
                >
                  <div className="bg-cyan-950/95 border-2 border-cyan-500 rounded-xl px-8 py-4 backdrop-blur-md shadow-2xl shadow-cyan-500/30">
                    <motion.div
                      animate={{ opacity: [0.8, 1, 0.8] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="text-cyan-400 text-lg font-bold tracking-wider text-center"
                    >
                      ⚡ RESTORE POWER TO ELEVATOR
                    </motion.div>
                    <div className="text-cyan-300 text-sm text-center mt-1 tracking-wide">
                      Click power cells to charge (multiple at once supported!)
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Elevator Console */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="relative z-10 bg-black/80 border-2 border-cyan-500/50 rounded-lg p-12 max-w-2xl w-full mx-8"
            >
              <h1 className="text-cyan-400 text-4xl text-center mb-8 blue-glow-title tracking-wider">
                ELEVATOR CONSOLE
              </h1>

              {!elevatorPower ? (
                <motion.div className="text-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setElevatorPower(true)}
                    className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white px-16 py-8 rounded-lg font-bold text-3xl transition-all duration-300 border-2 border-red-400 tracking-wider"
                  >
                    <div className="text-5xl mb-2">
                      <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    POWER
                  </motion.button>
                  <p className="text-gray-400 mt-6 tracking-wide">Press to initialise elevator systems</p>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  {/* Status Display */}
                  <div className="bg-gray-900/50 border border-cyan-500/30 rounded-lg p-6 mb-8">
                    <div className="text-cyan-400 text-sm mb-2 tracking-wider">POWER RESTORATION</div>
                    <div className={`text-3xl font-bold tracking-wider ${allCellsCharged ? 'text-green-400' : 'text-yellow-400'}`}>
                      {powerCells.filter(c => c).length}/4 CELLS CHARGED
                    </div>
                    <div className="text-gray-400 text-sm mt-2 tracking-wide">
                      Status: {allCellsCharged ? 'SYSTEM ONLINE' : 'CHARGING IN PROGRESS'}
                    </div>
                  </div>

                  {/* Instruction */}
                  {!allCellsCharged && chargingCells.size === 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center mb-6 text-cyan-400 text-sm tracking-wide"
                    >
                      Click on power cells to charge them (multiple cells can charge simultaneously!)
                    </motion.div>
                  )}
                  {chargingCells.size > 0 && !allCellsCharged && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center mb-6 text-green-400 text-sm tracking-wide"
                    >
                      ⚡ Charging {chargingCells.size} cell{chargingCells.size > 1 ? 's' : ''} simultaneously...
                    </motion.div>
                  )}

                  {/* Power Cells Grid - 4 Cells */}
                  <div className="grid grid-cols-2 gap-6 mb-8">
                    {powerCells.map((isCharged, index) => {
                      const isCharging = chargingCells.has(index);
                      const cellProgress = chargeProgress[index] || 0;
                      const cellLabels = ['CELL-A', 'CELL-B', 'CELL-C', 'CELL-D'];

                      return (
                        <motion.button
                          key={index}
                          onClick={() => handlePowerCellClick(index)}
                          disabled={isCharged || isCharging}
                          whileHover={!isCharged && !isCharging ? { scale: 1.05 } : {}}
                          whileTap={!isCharged && !isCharging ? { scale: 0.95 } : {}}
                          className={`relative h-40 rounded-lg border-2 transition-all duration-300 ${
                            isCharged
                              ? 'bg-gradient-to-br from-green-900/40 to-green-950/60 border-green-500 cursor-not-allowed'
                              : isCharging
                                ? 'bg-gradient-to-br from-yellow-900/40 to-yellow-950/60 border-yellow-500'
                                : 'bg-gradient-to-br from-gray-900/40 to-gray-950/60 border-gray-600 hover:border-cyan-500 cursor-pointer'
                          }`}
                        >
                          {/* Corner Brackets */}
                          <div className="absolute top-1 left-1 w-4 h-4 border-t-2 border-l-2 border-current opacity-50" />
                          <div className="absolute top-1 right-1 w-4 h-4 border-t-2 border-r-2 border-current opacity-50" />
                          <div className="absolute bottom-1 left-1 w-4 h-4 border-b-2 border-l-2 border-current opacity-50" />
                          <div className="absolute bottom-1 right-1 w-4 h-4 border-b-2 border-r-2 border-current opacity-50" />

                          {/* Cell Icon */}
                          <div className="flex flex-col items-center justify-center h-full gap-3">
                            {/* Battery Icon */}
                            <div className="relative w-16 h-24">
                              {/* Battery Outline */}
                              <div className={`absolute inset-x-2 top-2 bottom-0 border-2 rounded ${
                                isCharged ? 'border-green-400' : isCharging ? 'border-yellow-400' : 'border-gray-600'
                              }`}>
                                {/* Battery Top */}
                                <div className={`absolute -top-2 left-1/2 -translate-x-1/2 w-6 h-2 rounded-t ${
                                  isCharged ? 'bg-green-400' : isCharging ? 'bg-yellow-400' : 'bg-gray-600'
                                }`} />
                                
                                {/* Battery Fill */}
                                {isCharging && (
                                  <div className="absolute inset-1 overflow-hidden rounded">
                                    <motion.div
                                      className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-yellow-400 to-yellow-300"
                                      initial={{ height: '0%' }}
                                      animate={{ height: `${cellProgress}%` }}
                                      transition={{ duration: 0.1 }}
                                    />
                                  </div>
                                )}
                                {isCharged && (
                                  <div className="absolute inset-1 bg-gradient-to-t from-green-400 to-green-300 rounded" />
                                )}
                              </div>

                              {/* Charging Animation */}
                              {isCharging && (
                                <motion.div
                                  className="absolute inset-0 flex items-center justify-center"
                                  animate={{ opacity: [0.5, 1, 0.5] }}
                                  transition={{ duration: 1, repeat: Infinity }}
                                >
                                  <svg className="w-8 h-8 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M13 2L3 14h8l-2 8 10-12h-8l2-8z" />
                                  </svg>
                                </motion.div>
                              )}

                              {/* Check mark when charged */}
                              {isCharged && (
                                <motion.div
                                  initial={{ scale: 0, rotate: -180 }}
                                  animate={{ scale: 1, rotate: 0 }}
                                  className="absolute inset-0 flex items-center justify-center"
                                >
                                  <svg className="w-12 h-12 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                  </svg>
                                </motion.div>
                              )}
                            </div>

                            {/* Label */}
                            <div className={`text-sm tracking-widest font-bold ${
                              isCharged ? 'text-green-400' : isCharging ? 'text-yellow-400' : 'text-gray-500'
                            }`}>
                              {cellLabels[index]}
                            </div>

                            {/* Status */}
                            <div className={`text-xs tracking-wide ${
                              isCharged ? 'text-green-300' : isCharging ? 'text-yellow-300' : 'text-gray-600'
                            }`}>
                              {isCharged ? 'ONLINE' : isCharging ? `${chargeProgress}%` : 'OFFLINE'}
                            </div>
                          </div>

                          {/* Glow Effect */}
                          {isCharged && (
                            <motion.div
                              className="absolute inset-0 rounded-lg bg-green-400/20"
                              animate={{ opacity: [0.2, 0.4, 0.2] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            />
                          )}
                        </motion.button>
                      );
                    })}
                  </div>

                  {/* Enter Button - Show when all cells charged */}
                  {allCellsCharged && (
                    <motion.button
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={handlePowerComplete}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full bg-gradient-to-r from-green-600 to-cyan-600 hover:from-green-700 hover:to-cyan-700 text-white px-8 py-6 rounded-lg font-bold text-2xl transition-all duration-300 border-2 border-green-400 green-glow-title tracking-wider"
                    >
                      <div className="flex items-center justify-center gap-3">
                        <span>⚡ POWER RESTORED</span>
                        <motion.span
                          animate={{ x: [0, 5, 0] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        >
                          →
                        </motion.span>
                      </div>
                    </motion.button>
                  )}
                </motion.div>
              )}

              {/* Power surge effect when fully charged */}
              {allCellsCharged && (
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  animate={{
                    opacity: [0.1, 0.3, 0.1]
                  }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <div className="absolute inset-0 bg-green-400/10 rounded-lg" />
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}

        {/* Frame 6: Begin Descent - Final Button */}
        {currentFrame === 6 && (
          <motion.div
            key="frame6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0"
          >
            {/* Dramatic elevator shaft background */}
            <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-black to-gray-900">
              {/* Animated elevator shaft grid */}
              <div className="absolute inset-0 opacity-20" style={{
                backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 50px, #3b82f6 51px, transparent 52px)',
              }} />
              
              {/* Vertical movement lines */}
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-px bg-gradient-to-b from-transparent via-cyan-500/30 to-transparent"
                  style={{
                    left: `${(i * 5) + 10}%`,
                    height: '200px',
                  }}
                  animate={{
                    y: ['-200px', '100vh'],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: i * 0.1,
                    ease: 'linear',
                  }}
                />
              ))}

              {/* Glowing floor indicators */}
              <div className="absolute right-12 top-1/2 -translate-y-1/2 space-y-4">
                {['F7', 'F6', 'F5', 'F4', 'F3', 'F2', 'F1', 'F0'].map((floor, i) => (
                  <motion.div
                    key={floor}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="text-cyan-400/40 text-sm font-mono tracking-wider"
                  >
                    {floor}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Main content */}
            <div className="relative z-10 flex items-center justify-center min-h-screen">
              <motion.div
                initial={{ y: 50, opacity: 0, scale: 0.9 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="text-center max-w-2xl mx-8"
              >
                {/* Mission ready indicator */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                  className="w-32 h-32 mx-auto mb-8 rounded-full border-4 border-green-500 flex items-center justify-center bg-green-950/50 shadow-[0_0_50px_rgba(34,197,94,0.5)]"
                >
                  <svg className="w-16 h-16 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>

                {/* Status messages */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="space-y-4 mb-12"
                >
                  <h1 className="text-5xl font-bold text-green-400 green-glow-title tracking-wider">
                    SYSTEMS ONLINE
                  </h1>
                  <div className="text-cyan-400 text-xl tracking-wide">
                    Elevator access granted
                  </div>
                  <div className="text-gray-400 text-sm tracking-wide">
                    All systems operational • Power restored • Ready for descent
                  </div>
                </motion.div>

                {/* Mission objective reminder */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="bg-black/60 border-2 border-cyan-500/30 rounded-xl p-6 mb-8 backdrop-blur-sm"
                >
                  <div className="text-cyan-400 text-sm tracking-wider mb-2">MISSION OBJECTIVE</div>
                  <div className="text-white tracking-wide">
                    Infiltrate NAHRAN-7 • Locate Elena Cross • Extract intelligence
                  </div>
                  <div className="text-red-400 text-xs mt-2 tracking-wide">
                    WARNING: Hostile AI presence detected
                  </div>
                </motion.div>

                {/* BEGIN DESCENT Button - Large and prominent like a lift button */}
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1, type: 'spring', stiffness: 150 }}
                  onClick={handleBeginDescent}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative group"
                >
                  {/* Outer glow ring */}
                  <motion.div
                    className="absolute -inset-2 rounded-full bg-gradient-to-r from-red-500 via-orange-500 to-red-500 opacity-75 blur-xl"
                    animate={{
                      opacity: [0.5, 0.8, 0.5],
                      scale: [1, 1.05, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                  />
                  
                  {/* Button */}
                  <div className="relative bg-gradient-to-r from-red-600 to-red-700 rounded-lg px-8 py-4 border-2 border-red-400 shadow-2xl">
                    {/* Inner glow */}
                    <motion.div
                      className="absolute inset-0 rounded-lg bg-gradient-to-r from-white/20 to-transparent"
                      animate={{
                        opacity: [0.3, 0.6, 0.3],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                      }}
                    />
                    
                    {/* Button content */}
                    <div className="relative space-y-1">
                      <div className="text-white text-2xl font-bold tracking-wider drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                        BEGIN DESCENT
                      </div>
                      <motion.div
                        className="text-red-100 text-xs tracking-widest"
                        animate={{ opacity: [0.6, 1, 0.6] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        PRESS TO START
                      </motion.div>
                    </div>
                  </div>
                </motion.button>

                {/* Additional context */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5 }}
                  className="mt-8 text-gray-500 text-xs tracking-wider"
                >
                  Floor F7 → F0 • 8 floors • Extreme danger
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Frame Indicator (Debug) */}
      <div className="fixed top-4 left-4 text-gray-600 text-xs tracking-wide">
        Frame {currentFrame}/6
      </div>

      {/* Skip Button - All frames except final */}
      {currentFrame !== 6 && (
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1 }}
          onClick={onComplete}
          className="fixed bottom-8 right-8 z-50 px-6 py-3 bg-red-600/80 hover:bg-red-500 border-2 border-red-400 rounded-lg backdrop-blur-sm transition-all duration-300 flex items-center gap-2 group"
        >
          <span className="text-white font-bold">SKIP</span>
          <SkipForward className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
        </motion.button>
      )}
    </div>
  );
}
