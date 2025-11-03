import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SkipForward, DoorOpen, Zap } from 'lucide-react';

interface BasementEscapeProps {
  onComplete: () => void;
  onFail: () => void;
  onCollectLog?: (logId: string) => void;
  collectedLogs?: string[];
}

export function BasementEscape({ onComplete, onCollectLog, collectedLogs = [] }: BasementEscapeProps) {
  const [isHolding, setIsHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showElevatorEscape, setShowElevatorEscape] = useState(false);
  const [aiVoiceLine, setAiVoiceLine] = useState<string | null>(null);
  const requiredProgress = 100;
  const fillSpeed = 1.5;

  // AI Voice Lines
  const voiceLines = {
    start: "EMERGENCY EXIT PROTOCOL - HOLD TO OVERRIDE",
    holding: "OVERRIDE IN PROGRESS - MAINTAIN HOLD",
    complete: "GROUND FLOOR ACCESS GRANTED - MISSION COMPLETE"
  };

  useEffect(() => {
    setAiVoiceLine(voiceLines.start);
    setTimeout(() => setAiVoiceLine(null), 3000);
  }, []);

  useEffect(() => {
    if (!isHolding) {
      if (progress > 0) {
        const timer = setTimeout(() => {
          setProgress(prev => Math.max(0, prev - 5));
        }, 100);
        return () => clearTimeout(timer);
      }
      return;
    }

    if (progress === 0) {
      setAiVoiceLine(voiceLines.holding);
    }

    const interval = setInterval(() => {
      setProgress(prev => Math.min(prev + fillSpeed, requiredProgress));
    }, 100);

    return () => clearInterval(interval);
  }, [isHolding, progress]);

  useEffect(() => {
    if (progress >= requiredProgress && !showSuccess) {
      setShowSuccess(true);
      setIsHolding(false);
      setAiVoiceLine(voiceLines.complete);
      setTimeout(() => {
        setShowElevatorEscape(true);
      }, 1500);
      setTimeout(() => {
        onComplete();
      }, 10500); // 10.5 seconds total - enough for full flashbang animation sequence and 2 second display of success message
    }
  }, [progress, showSuccess, onComplete]);

  const handleMouseDown = () => {
    setIsHolding(true);
  };

  const handleMouseUp = () => {
    setIsHolding(false);
    setAiVoiceLine(null);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      {/* Background with dark texture */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black" />
        <div className="absolute inset-0 bg-gradient-to-b from-orange-950/40 via-black/50 to-orange-950/40" />
      </div>

      {/* Animated particles overlay - Optimized */}
      <div className="absolute inset-0 z-10">
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-orange-400/30 rounded-full"
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
          backgroundImage: 'linear-gradient(rgba(251, 146, 60, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(251, 146, 60, 0.1) 1px, transparent 1px)',
          backgroundSize: '30px 30px'
        }} />
      </div>

      {/* Escape alarm effect */}
      {isHolding && (
        <motion.div
          className="absolute inset-0 bg-orange-500/10 z-10"
          animate={{
            opacity: [0.1, 0.3, 0.1]
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
            <div className="bg-orange-950/95 border-2 border-orange-500 rounded-xl px-8 py-4 backdrop-blur-md shadow-2xl shadow-orange-500/30">
              <motion.div
                animate={{ opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-orange-400 text-lg font-bold tracking-wider flex items-center gap-2"
              >
                <Zap className="w-5 h-5" />
                EXIT AI: {aiVoiceLine}
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
          className="text-center mb-12 bg-black/60 backdrop-blur-sm border border-orange-500/30 rounded-lg p-6 max-w-3xl w-full space-y-3"
        >
          <div className="text-orange-300 text-xl tracking-wider">
            Hold the button to override the emergency exit
          </div>
          <div className="text-yellow-400 text-sm flex items-center justify-center gap-2">
            <DoorOpen className="w-4 h-4" />
            Release too early and you'll lose progress
          </div>
        </motion.div>

        {/* Emergency Override Interface */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="relative w-full max-w-3xl"
        >
          {/* Main Container */}
          <div className="relative bg-gradient-to-b from-orange-950/30 to-black/60 border-2 border-orange-500/40 rounded-2xl p-12 backdrop-blur-sm shadow-2xl shadow-orange-500/20 overflow-hidden">
            
            {/* Corner brackets */}
            <div className="absolute top-4 left-4 w-16 h-16 border-t-2 border-l-2 border-orange-400"></div>
            <div className="absolute top-4 right-4 w-16 h-16 border-t-2 border-r-2 border-orange-400"></div>
            <div className="absolute bottom-4 left-4 w-16 h-16 border-b-2 border-l-2 border-orange-400"></div>
            <div className="absolute bottom-4 right-4 w-16 h-16 border-b-2 border-r-2 border-orange-400"></div>

            {/* System Header */}
            <div className="text-center mb-8">
              <DoorOpen className="w-20 h-20 text-orange-400 mx-auto mb-4" />
              <div className="text-orange-400 text-sm tracking-wider">EMERGENCY EXIT OVERRIDE</div>
              <div className="text-xs text-gray-400 mt-1">F0 - GROUND FLOOR</div>
            </div>

            {/* Progress Display */}
            <div className="mb-8">
              <div className="flex justify-between text-sm text-orange-300 mb-2">
                <span>OVERRIDE PROGRESS</span>
                <span className="font-bold">{Math.round(progress)}%</span>
              </div>
              <div className="w-full h-12 bg-black border-2 border-orange-500/50 rounded-xl overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-orange-600 to-yellow-400"
                  style={{ width: `${progress}%` }}
                  animate={isHolding ? {
                    boxShadow: [
                      '0 0 10px rgba(251, 146, 60, 0.5)',
                      '0 0 30px rgba(251, 146, 60, 0.8)',
                      '0 0 10px rgba(251, 146, 60, 0.5)'
                    ]
                  } : {}}
                  transition={{ duration: 0.8, repeat: isHolding ? Infinity : 0 }}
                >
                  <motion.div
                    className="h-full bg-gradient-to-r from-transparent via-white/40 to-transparent"
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  />
                </motion.div>
              </div>
            </div>

            {/* Override Button */}
            <div className="bg-black/50 border-2 border-orange-500/30 rounded-xl p-12 mb-6">
              <div className="text-center mb-6">
                <div className="text-sm text-orange-300 mb-2 tracking-wider">
                  {isHolding ? 'OVERRIDING SYSTEMS...' : 'HOLD BUTTON TO OVERRIDE'}
                </div>
              </div>
              
              <motion.button
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onTouchStart={handleMouseDown}
                onTouchEnd={handleMouseUp}
                disabled={showSuccess}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`w-full py-12 rounded-2xl font-bold text-3xl tracking-wider transition-all duration-300 border-4 relative overflow-hidden ${
                  isHolding
                    ? 'bg-gradient-to-r from-orange-600 to-yellow-600 border-orange-400 text-white shadow-2xl shadow-orange-500/50'
                    : 'bg-gradient-to-r from-orange-700 to-orange-600 border-orange-500 text-white shadow-lg shadow-orange-500/30'
                }`}
                animate={isHolding ? {
                  boxShadow: [
                    '0 0 30px rgba(251, 146, 60, 0.5)',
                    '0 0 60px rgba(251, 146, 60, 1)',
                    '0 0 30px rgba(251, 146, 60, 0.5)'
                  ]
                } : {}}
                transition={{ duration: 0.8, repeat: isHolding ? Infinity : 0 }}
              >
                <span className="relative z-10 flex items-center justify-center gap-4">
                  <DoorOpen className="w-10 h-10" />
                  {isHolding ? 'OVERRIDING...' : 'HOLD TO OVERRIDE'}
                </span>

                {/* Button fill effect */}
                {isHolding && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-300"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ 
                      scale: [1, 1.5, 1],
                      opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                )}
              </motion.button>

              <div className="text-xs text-orange-400 mt-4 text-center">
                {progress > 0 && progress < 100 && !isHolding && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-400"
                  >
                    ⚠ PROGRESS DECAYING - HOLD BUTTON
                  </motion.div>
                )}
              </div>
            </div>

            {/* Status indicator */}
            <div className="text-center">
              <div className={`inline-block px-6 py-3 rounded-lg border-2 ${
                showSuccess
                  ? 'bg-green-900/80 border-green-500/50 text-green-400'
                  : isHolding
                  ? 'bg-orange-900/80 border-orange-600/50 text-orange-400 animate-pulse'
                  : progress > 0
                  ? 'bg-yellow-900/80 border-yellow-600/50 text-yellow-400'
                  : 'bg-gray-900/80 border-gray-600/50 text-gray-400'
              }`}>
                <div className="text-sm tracking-wider">
                  STATUS: {
                    showSuccess 
                      ? 'OVERRIDE COMPLETE' 
                      : isHolding 
                      ? 'OVERRIDE IN PROGRESS'
                      : progress > 0
                      ? 'PARTIAL OVERRIDE - CONTINUE'
                      : 'READY TO OVERRIDE'
                  }
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Skip Button */}
      <motion.button
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1 }}
        onClick={() => onComplete()}
        className="fixed bottom-8 right-8 z-40 px-6 py-3 bg-orange-600/80 hover:bg-orange-500 border-2 border-orange-400 rounded-lg backdrop-blur-sm transition-all duration-300 flex items-center gap-2 group"
      >
        <span className="text-white font-bold">SKIP</span>
        <SkipForward className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
      </motion.button>

      {/* Success Overlay */}
      <AnimatePresence>
        {showSuccess && !showElevatorEscape && (
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
                    className="text-9xl font-bold text-green-400 mb-6"
                  >
                    ESCAPED!
                  </motion.div>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="text-green-300 text-4xl"
                  >
                    Mission Complete
                  </motion.p>
                </motion.div>

                {/* Success particles - Optimized */}
                {Array.from({ length: 16 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-3 h-3 bg-green-400 rounded-full"
                    style={{ left: '50%', top: '50%' }}
                    animate={{
                      x: (Math.random() - 0.5) * 1000,
                      y: (Math.random() - 0.5) * 1000,
                      opacity: [1, 0],
                      scale: [1, 0]
                    }}
                    transition={{
                      duration: 1.5,
                      delay: Math.random() * 0.3,
                      ease: 'easeOut'
                    }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FINAL ELEVATOR ESCAPE ANIMATION */}
      <AnimatePresence>
        {showElevatorEscape && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[100] bg-black"
          >
            {/* Elevator shaft dark background */}
            <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-800 to-gray-900">
              {/* Vertical shaft lines - DESCENDING */}
              <motion.div 
                className="absolute inset-0 flex justify-center gap-32"
                animate={{ y: [0, 2000] }}
                transition={{ duration: 4, ease: 'easeIn', repeat: Infinity }}
              >
                <div className="w-1 h-[200%] bg-gradient-to-b from-transparent via-gray-600 to-transparent" />
                <div className="w-1 h-[200%] bg-gradient-to-b from-transparent via-gray-600 to-transparent" />
              </motion.div>
            </div>

            {/* Elevator interior view */}
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Elevator doors */}
              <div className="relative w-full h-full">
                {/* Left door */}
                <motion.div
                  className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-gray-800 to-gray-700 border-r-4 border-gray-600"
                  initial={{ x: 0 }}
                  animate={{ x: 0 }}
                  transition={{ delay: 3 }}
                >
                  {/* Door details */}
                  <div className="absolute inset-4 border-2 border-gray-600/50" />
                  <div className="absolute top-1/2 right-8 -translate-y-1/2 w-2 h-16 bg-gray-600 rounded-full" />
                </motion.div>

                {/* Right door */}
                <motion.div
                  className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-gray-800 to-gray-700 border-l-4 border-gray-600"
                  initial={{ x: 0 }}
                  animate={{ x: 0 }}
                  transition={{ delay: 3 }}
                >
                  {/* Door details */}
                  <div className="absolute inset-4 border-2 border-gray-600/50" />
                  <div className="absolute top-1/2 left-8 -translate-y-1/2 w-2 h-16 bg-gray-600 rounded-full" />
                </motion.div>

                {/* Descending text */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: [0, 1, 1, 0], y: [-20, 0, 0, 20] }}
                  transition={{ duration: 3, times: [0, 0.2, 0.8, 1] }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 text-center"
                >
                  <div className="text-green-400 text-6xl font-bold mb-4">EXITING</div>
                  <div className="text-green-300 text-2xl">Ground Floor Exit...</div>
                </motion.div>

                {/* Door opening animation at 3 seconds */}
                <motion.div
                  className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-gray-800 to-gray-700 border-r-4 border-gray-600 origin-left"
                  animate={{ x: '-100%' }}
                  transition={{ delay: 3, duration: 1.5, ease: 'easeInOut' }}
                >
                  <div className="absolute inset-4 border-2 border-gray-600/50" />
                  <div className="absolute top-1/2 right-8 -translate-y-1/2 w-2 h-16 bg-gray-600 rounded-full" />
                </motion.div>

                <motion.div
                  className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-gray-800 to-gray-700 border-l-4 border-gray-600 origin-right"
                  animate={{ x: '100%' }}
                  transition={{ delay: 3, duration: 1.5, ease: 'easeInOut' }}
                >
                  <div className="absolute inset-4 border-2 border-gray-600/50" />
                  <div className="absolute top-1/2 left-8 -translate-y-1/2 w-2 h-16 bg-gray-600 rounded-full" />
                </motion.div>
              </div>
            </div>

            {/* FLASHBANG WHITE EXPLOSION - SMOOTH 3 SECOND FADE IN */}
            <motion.div
              className="absolute inset-0 bg-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0, 1, 1] }}
              transition={{ 
                delay: 4.5,
                duration: 3,
                times: [0, 0.3, 0.9, 1],
                ease: "easeIn"
              }}
            />

            {/* Radial light burst effect - Optimized */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0, 1, 0] }}
              transition={{ delay: 4.5, duration: 1 }}
            >
              {Array.from({ length: 12 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 bg-white"
                  style={{
                    height: '200%',
                    transformOrigin: 'center',
                    transform: `rotate(${i * 30}deg)`,
                  }}
                  initial={{ scaleY: 0, opacity: 0 }}
                  animate={{ scaleY: [0, 1, 1], opacity: [0, 1, 0] }}
                  transition={{ 
                    delay: 4.5,
                    duration: 0.8,
                    times: [0, 0.5, 1]
                  }}
                />
              ))}
            </motion.div>

            {/* Final "TO BE CONTINUED" or mission complete text */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0, 1] }}
              transition={{ delay: 5.5, duration: 0.5 }}
            >
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 5.8 }}
                  className="text-6xl font-bold text-black mb-4"
                >
                  ESCAPED NAHRAN-7
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 6.2 }}
                  className="text-3xl text-gray-700"
                >
                  Agent Cross - Mission Complete
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
