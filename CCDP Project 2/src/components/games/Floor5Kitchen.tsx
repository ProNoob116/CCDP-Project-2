import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SkipForward, Flame, AlertTriangle } from 'lucide-react';
import kitchenImage from 'figma:asset/df4d82eb21a3947570700df3e6a23e86c6b9dc63.png';
import { EvidenceScanner } from '../EvidenceScanner';

interface Floor5KitchenProps {
  onComplete: () => void;
  onFail: () => void;
  onCollectLog?: (logId: string) => void;
  collectedLogs?: string[];
}

interface Valve {
  id: number;
  x: number;
  y: number;
  active: boolean;
}

export function Floor5Kitchen({ onComplete, onFail, onCollectLog, collectedLogs = [] }: Floor5KitchenProps) {
  const [timeLeft, setTimeLeft] = useState(5);
  const [valves] = useState<Valve[]>([
    { id: 1, x: 15, y: 25, active: true },
    { id: 2, x: 40, y: 35, active: true },
    { id: 3, x: 60, y: 25, active: true },
    { id: 4, x: 30, y: 60, active: true },
    { id: 5, x: 70, y: 65, active: true },
  ]);
  const [shutValves, setShutValves] = useState<number[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [aiVoiceLine, setAiVoiceLine] = useState<string | null>(null);

  // AI Voice Lines
  const voiceLines = {
    start: "GAS LEAK DETECTED - EMERGENCY SHUTDOWN REQUIRED",
    valveShut: "VALVE SEALED - CONTINUE SHUTDOWN PROTOCOL",
    timeWarning: "WARNING: CRITICAL TIME REMAINING",
    complete: "ALL VALVES SECURED - GAS LEAK CONTAINED"
  };

  useEffect(() => {
    setAiVoiceLine(voiceLines.start);
    setTimeout(() => setAiVoiceLine(null), 3000);
  }, []);

  useEffect(() => {
    if (!gameStarted || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        const newTime = prev - 1;
        if (newTime === 2) {
          setAiVoiceLine(voiceLines.timeWarning);
          setTimeout(() => setAiVoiceLine(null), 2000);
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStarted, timeLeft]);

  // Separate effect to handle failure
  useEffect(() => {
    if (gameStarted && timeLeft <= 0) {
      onFail();
    }
  }, [timeLeft, gameStarted, onFail]);

  useEffect(() => {
    if (shutValves.length === valves.length && gameStarted) {
      setShowSuccess(true);
      setGameStarted(false);
      setAiVoiceLine(voiceLines.complete);
      setTimeout(() => {
        onComplete();
      }, 3000);
    }
  }, [shutValves.length, valves.length, gameStarted, onComplete]);

  const handleValveClick = (valveId: number) => {
    if (shutValves.includes(valveId)) return;
    
    if (!gameStarted) {
      setGameStarted(true);
    }
    
    setShutValves(prev => [...prev, valveId]);
    setAiVoiceLine(voiceLines.valveShut);
    setTimeout(() => setAiVoiceLine(null), 1500);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={kitchenImage}
          alt="Kitchen"
          className="w-full h-full object-cover"
          style={{ filter: 'brightness(0.5) blur(1px)' }}
        />
        {/* Dark overlay with red tint */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-red-950/40 to-black/70" />
      </div>

      {/* Animated particles overlay */}
      <div className="absolute inset-0 z-10">
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-red-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 1, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
        ))}

        {/* Digital grid */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'linear-gradient(rgba(239, 68, 68, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(239, 68, 68, 0.1) 1px, transparent 1px)',
          backgroundSize: '30px 30px'
        }} />
      </div>

      {/* Danger overlay when game started */}
      {gameStarted && !showSuccess && (
        <motion.div
          className="absolute inset-0 bg-red-500/10 z-10"
          animate={{
            opacity: timeLeft <= 2 ? [0.1, 0.4, 0.1] : [0.05, 0.15, 0.05]
          }}
          transition={{ duration: 0.5, repeat: Infinity }}
        />
      )}

      {/* AI Voice Line Display */}
      <AnimatePresence>
        {aiVoiceLine && (
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className="fixed top-32 left-1/2 -translate-x-1/2 z-50"
          >
            <div className="bg-red-950/95 border-2 border-red-500 rounded-xl px-8 py-4 backdrop-blur-md shadow-2xl shadow-red-500/30">
              <motion.div
                animate={{ opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-red-400 text-lg font-bold tracking-wider flex items-center gap-2"
              >
                <AlertTriangle className="w-5 h-5" />
                EMERGENCY AI: {aiVoiceLine}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 flex flex-col items-center min-h-screen p-8 pt-32 pb-16">
        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12 bg-black/60 backdrop-blur-sm border border-red-500/30 rounded-lg p-6 max-w-3xl w-full space-y-3"
        >
          <div className="text-red-300 text-xl tracking-wider">
            Shut down all gas valves before time runs out
          </div>
          <div className="text-orange-400 text-sm flex items-center justify-center gap-2">
            <Flame className="w-4 h-4" />
            Click all valves quickly - gas leak is critical
          </div>
        </motion.div>

        {/* Gas Valve Control Panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="relative w-full max-w-4xl"
        >
          {/* Main Container */}
          <div className="relative bg-gradient-to-b from-red-950/30 to-black/60 border-2 border-red-500/40 rounded-2xl p-12 backdrop-blur-sm shadow-2xl shadow-red-500/20 overflow-hidden">
            
            {/* Corner brackets */}
            <div className="absolute top-4 left-4 w-16 h-16 border-t-2 border-l-2 border-red-400"></div>
            <div className="absolute top-4 right-4 w-16 h-16 border-t-2 border-r-2 border-red-400"></div>
            <div className="absolute bottom-4 left-4 w-16 h-16 border-b-2 border-l-2 border-red-400"></div>
            <div className="absolute bottom-4 right-4 w-16 h-16 border-b-2 border-r-2 border-red-400"></div>

            {/* Panel Header */}
            <div className="text-center mb-8">
              <Flame className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <div className="text-red-400 text-sm tracking-wider">EMERGENCY GAS SHUTDOWN SYSTEM</div>
              <div className="text-xs text-gray-400 mt-1">
                VALVES SECURED: <span className="text-white font-bold">{shutValves.length}/5</span>
              </div>
            </div>

            {/* Timer Display */}
            {gameStarted && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-6"
              >
                <div className={`inline-block px-8 py-4 rounded-xl border-2 ${
                  timeLeft <= 2 
                    ? 'bg-red-600/80 border-red-400 animate-pulse' 
                    : 'bg-orange-900/80 border-orange-500/50'
                }`}>
                  <div className="text-sm tracking-wider mb-1 ${timeLeft <= 2 ? 'text-white' : 'text-orange-300'}">
                    TIME REMAINING
                  </div>
                  <motion.div 
                    className={`text-5xl font-bold ${timeLeft <= 2 ? 'text-white' : 'text-orange-400'}`}
                    animate={timeLeft <= 2 ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  >
                    {timeLeft}s
                  </motion.div>
                </div>
              </motion.div>
            )}

            {/* Valve Control Grid */}
            <div className="relative h-[400px] bg-black/50 border-2 border-red-500/30 rounded-xl overflow-hidden mb-6">
              {/* Gas leak effect lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
                <defs>
                  <linearGradient id="gasGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#f97316" stopOpacity="0.1" />
                  </linearGradient>
                </defs>
                {valves.map((valve, i) => (
                  <motion.circle
                    key={`leak-${valve.id}`}
                    cx={`${valve.x}%`}
                    cy={`${valve.y}%`}
                    r={shutValves.includes(valve.id) ? "0" : "30"}
                    fill="url(#gasGradient)"
                    animate={shutValves.includes(valve.id) ? {} : {
                      r: [20, 40, 20],
                      opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                  />
                ))}
              </svg>

              {/* Valves */}
              {valves.map((valve) => {
                const isShut = shutValves.includes(valve.id);

                return (
                  <motion.div
                    key={valve.id}
                    className="absolute"
                    style={{
                      left: `${valve.x}%`,
                      top: `${valve.y}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    <motion.button
                      onClick={() => handleValveClick(valve.id)}
                      disabled={isShut}
                      className={`relative w-24 h-24 rounded-full border-4 transition-all duration-300 ${
                        isShut
                          ? 'bg-green-500/20 border-green-400 cursor-default'
                          : 'bg-red-500/30 border-red-400 cursor-pointer hover:bg-red-500/50'
                      }`}
                      whileHover={!isShut ? { scale: 1.1 } : {}}
                      whileTap={!isShut ? { scale: 0.95 } : {}}
                      animate={isShut ? {
                        boxShadow: '0 0 20px rgba(34, 197, 94, 0.5)'
                      } : {
                        boxShadow: [
                          '0 0 20px rgba(239, 68, 68, 0.5)',
                          '0 0 40px rgba(239, 68, 68, 0.8)',
                          '0 0 20px rgba(239, 68, 68, 0.5)'
                        ]
                      }}
                      transition={{ duration: 1, repeat: isShut ? 0 : Infinity }}
                    >
                      {/* Valve icon */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <motion.svg 
                          className={`w-14 h-14 ${isShut ? 'text-green-400' : 'text-red-400'}`}
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                          animate={isShut ? { rotate: 90 } : { rotate: 0 }}
                          transition={{ duration: 0.5 }}
                        >
                          <circle cx="12" cy="12" r="9" strokeWidth={2} />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d="M12 8v8m-4-4h8" 
                          />
                        </motion.svg>
                      </div>

                      {/* Valve label */}
                      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs">
                        <span className={isShut ? 'text-green-400 font-bold' : 'text-red-400'}>
                          VALVE {valve.id}
                        </span>
                      </div>

                      {/* Checkmark when shut */}
                      {isShut && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-green-500 rounded-full flex items-center justify-center z-10"
                        >
                          <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </motion.div>
                      )}
                    </motion.button>
                  </motion.div>
                );
              })}
            </div>

            {/* Status indicator */}
            <div className="text-center">
              <div className={`inline-block px-6 py-3 rounded-lg border-2 ${
                shutValves.length >= 5
                  ? 'bg-green-900/80 border-green-500/50 text-green-400'
                  : gameStarted
                  ? 'bg-red-900/80 border-red-600/50 text-red-400'
                  : 'bg-gray-900/80 border-gray-600/50 text-gray-400'
              }`}>
                <div className="text-sm tracking-wider">
                  STATUS: {
                    shutValves.length >= 5 
                      ? 'ALL VALVES SECURED' 
                      : gameStarted 
                      ? `${5 - shutValves.length} VALVES STILL OPEN`
                      : 'CLICK ANY VALVE TO BEGIN'
                  }
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Evidence Scanner - Coffee Mug - Strategically placed on left counter */}
      <EvidenceScanner
        objectName="COFFEE MUG (LIPSTICK STAIN)"
        caption="Her favorite. Still on her desk. Still waiting."
        icon="☕"
        position="left"
        logId="f5_coffee_mug"
        onScanned={() => onCollectLog?.('f5_coffee_mug')}
        isCollected={collectedLogs?.includes('f5_coffee_mug')}
      />

      {/* Evidence Scanner - Chef's Keycard - Strategically placed near right kitchen equipment */}
      <EvidenceScanner
        objectName="CHEF'S KEYCARD"
        caption="Owner: Marcus Chen. Last clocked in: 2 months ago."
        icon="🔑"
        position="right"
        logId="f5_chef_keycard"
        onScanned={() => onCollectLog?.('f5_chef_keycard')}
        isCollected={collectedLogs?.includes('f5_chef_keycard')}
      />

      {/* Skip Button */}
      <motion.button
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1 }}
        onClick={() => onComplete()}
        className="fixed bottom-8 right-8 z-40 px-6 py-3 bg-red-600/80 hover:bg-red-500 border-2 border-red-400 rounded-lg backdrop-blur-sm transition-all duration-300 flex items-center gap-2 group"
      >
        <span className="text-white font-bold">SKIP</span>
        <SkipForward className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
      </motion.button>

      {/* Success Overlay */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50"
          >
            <motion.div
              className="absolute inset-0 bg-green-500"
              animate={{ opacity: [0, 0.4, 0] }}
              transition={{ duration: 0.5, times: [0, 0.3, 1] }}
            />
            
            <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-md">
              <div className="text-center space-y-6">
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
                >
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                      textShadow: [
                        '0 0 20px rgba(34, 197, 94, 0.5)',
                        '0 0 50px rgba(34, 197, 94, 1)',
                        '0 0 20px rgba(34, 197, 94, 0.5)'
                      ]
                    }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="text-8xl font-bold text-green-400 mb-6"
                  >
                    GAS LEAK CONTAINED
                  </motion.div>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="text-green-300 text-3xl"
                  >
                    Emergency shutdown successful
                  </motion.p>
                </motion.div>

                {/* Success particles */}
                {Array.from({ length: 25 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-green-400 rounded-full"
                    style={{ left: '50%', top: '50%' }}
                    animate={{
                      x: (Math.random() - 0.5) * 800,
                      y: (Math.random() - 0.5) * 800,
                      opacity: [1, 0],
                      scale: [1, 0]
                    }}
                    transition={{
                      duration: 1.5,
                      delay: 0.3 + Math.random() * 0.3,
                      ease: 'easeOut'
                    }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
