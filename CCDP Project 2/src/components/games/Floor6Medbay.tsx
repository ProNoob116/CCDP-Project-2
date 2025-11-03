import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Activity, Zap, SkipForward } from 'lucide-react';
import medbayImage from 'figma:asset/2817bfa3cd41a53425e625bee2eb27050b2d00c8.png';
import { EvidenceScanner } from '../EvidenceScanner';

interface Floor6MedbayProps {
  onComplete: () => void;
  onFail: () => void;
  onHealthIncrease: (amount: number) => void;
  onCollectLog?: (logId: string) => void;
  collectedLogs?: string[];
}

export function Floor6Medbay({ onComplete, onFail, onHealthIncrease, onCollectLog, collectedLogs = [] }: Floor6MedbayProps) {
  const [gaugePosition, setGaugePosition] = useState(0);
  const [direction, setDirection] = useState(1);
  const [successfulClicks, setSuccessfulClicks] = useState(0);
  const [showFeedback, setShowFeedback] = useState<'success' | 'fail' | 'heal' | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [speed] = useState(2);
  const [aiVoiceLine, setAiVoiceLine] = useState<string | null>(null);
  const [healingPodActive, setHealingPodActive] = useState(false);
  const requiredClicks = 1;
  const completionTriggeredRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  const onHealthIncreaseRef = useRef(onHealthIncrease);
  
  // Keep refs in sync with latest props
  useEffect(() => {
    onCompleteRef.current = onComplete;
    onHealthIncreaseRef.current = onHealthIncrease;
  });

  // AI Voice Lines
  const voiceLines = {
    start: "MEDICAL AI ONLINE - HEALING PROTOCOL READY",
    success: "NANOBOTS STABILISED - ADMINISTERING TREATMENT",
    fail: "ERROR: NANOBOT SWARM DESTABILISED",
    healing: "REGENERATIVE SERUM INJECTED - VITALS IMPROVING",
    complete: "HEALING COMPLETE - ALL SYSTEMS NOMINAL"
  };

  useEffect(() => {
    setAiVoiceLine(voiceLines.start);
    setTimeout(() => setAiVoiceLine(null), 3000);
  }, []);

  useEffect(() => {
    // Stop gauge movement after successful sync
    if (!gameStarted || showSuccess) return;

    const interval = setInterval(() => {
      setGaugePosition(prev => {
        const newPos = prev + direction * speed;
        
        if (newPos >= 100) {
          setDirection(-1);
          return 100;
        }
        if (newPos <= 0) {
          setDirection(1);
          return 0;
        }
        
        return newPos;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [direction, gameStarted, speed, showSuccess]);

  const handleClick = () => {
    if (!gameStarted) {
      setGameStarted(true);
      return;
    }

    // Green zone is 45-55 (10% window)
    const isInGreenZone = gaugePosition >= 45 && gaugePosition <= 55;
    
    if (isInGreenZone) {
      // Immediately stop the game to prevent lag
      setGameStarted(false);
      setShowFeedback('success');
      setAiVoiceLine(voiceLines.success);
      const newCount = successfulClicks + 1;
      setSuccessfulClicks(newCount);
      
      // Activate healing pod animation
      setHealingPodActive(true);
      setTimeout(() => {
        setShowFeedback('heal');
        setAiVoiceLine(voiceLines.healing);
      }, 800);
      
      setTimeout(() => {
        setShowFeedback(null);
        setAiVoiceLine(null);
        setHealingPodActive(false);
      }, 2000);
    } else {
      setShowFeedback('fail');
      setAiVoiceLine(voiceLines.fail);
      onFail();
      // Reset on failure
      setTimeout(() => {
        setSuccessfulClicks(0);
        setShowFeedback(null);
        setAiVoiceLine(null);
        setHealingPodActive(false);
      }, 1500);
    }
  };

  useEffect(() => {
    if (successfulClicks === requiredClicks && !completionTriggeredRef.current) {
      completionTriggeredRef.current = true;
      setShowSuccess(true);
      setGameStarted(false);
      setAiVoiceLine(voiceLines.complete);
      // Heal the player
      onHealthIncreaseRef.current(20);
      
      // Keep success overlay visible, then call onComplete
      // The overlay will naturally disappear when component unmounts during floor transition
      setTimeout(() => {
        onCompleteRef.current();
      }, 2500);
    }
  }, [successfulClicks, requiredClicks]);

  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={medbayImage}
          alt="Medbay"
          className="w-full h-full object-cover"
          style={{ filter: 'brightness(0.6) blur(1px)' }}
        />
        {/* Dark overlay with green tint */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-green-950/40 to-black/70" />
      </div>

      {/* Animated particles overlay - Only show when game is not in success state */}
      {!showSuccess && (
        <div className="absolute inset-0 z-10">
          {/* Reduced particles for better performance */}
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-green-400/30 rounded-full"
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
            backgroundImage: 'linear-gradient(rgba(34, 197, 94, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(34, 197, 94, 0.1) 1px, transparent 1px)',
            backgroundSize: '30px 30px'
          }} />
        </div>
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
            <div className="bg-green-950/95 border-2 border-green-500 rounded-xl px-8 py-4 backdrop-blur-md shadow-2xl shadow-green-500/30">
              <motion.div
                animate={{ opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-green-400 text-lg font-bold tracking-wider flex items-center gap-2"
              >
                <Activity className="w-5 h-5" />
                MEDICAL AI: {aiVoiceLine}
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
          className="text-center mb-12 bg-black/60 backdrop-blur-sm border border-green-500/30 rounded-lg p-6 max-w-3xl w-full space-y-3"
        >
          <div className="text-green-300 text-xl tracking-wider">
            Synchronise the nanobots by clicking in the GREEN ZONE
          </div>
          <div className="text-cyan-400 text-sm flex items-center justify-center gap-2">
            <Zap className="w-4 h-4" />
            Perfect timing required - activate healing protocol
          </div>
        </motion.div>

        {/* Holographic Medical Interface */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="relative w-full max-w-3xl"
        >
          {/* Healing Pod Container */}
          <div className="relative bg-gradient-to-b from-green-950/30 to-black/60 border-2 border-green-500/40 rounded-2xl p-12 backdrop-blur-sm shadow-2xl shadow-green-500/20 overflow-hidden">
            
            {/* Corner brackets */}
            <div className="absolute top-4 left-4 w-16 h-16 border-t-2 border-l-2 border-green-400"></div>
            <div className="absolute top-4 right-4 w-16 h-16 border-t-2 border-r-2 border-green-400"></div>
            <div className="absolute bottom-4 left-4 w-16 h-16 border-b-2 border-l-2 border-green-400"></div>
            <div className="absolute bottom-4 right-4 w-16 h-16 border-b-2 border-r-2 border-green-400"></div>

            {/* Medical Icon */}
            <motion.div 
              className="text-center mb-8"
              animate={healingPodActive ? {
                scale: [1, 1.1, 1],
              } : {}}
              transition={{ duration: 0.5, repeat: healingPodActive ? 3 : 0 }}
            >
              <Heart className="w-24 h-24 text-green-400 mx-auto mb-4" />
              <div className="text-green-400 text-sm tracking-wider">AUTOMATED HEALING POD</div>
              <div className="text-cyan-400 text-xs mt-1">MODEL: NAHRAN-MED-2057</div>
            </motion.div>

            {/* Nanobot Synchronisation Gauge */}
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-green-300 text-sm tracking-wider mb-2">NANOBOT SYNCHRONISATION</div>
                <div className="text-xs text-gray-400">Align the nanobots in the optimal zone</div>
              </div>

              {/* Main Gauge */}
              <div className="relative h-24 bg-black/60 border-2 border-green-500/30 rounded-xl overflow-hidden">
                {/* Danger zones (red) */}
                <div className="absolute left-0 top-0 bottom-0 w-[45%] bg-red-900/30 border-r-2 border-red-500/50">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-red-400 text-xs font-bold tracking-wider opacity-50">
                    DANGER
                  </div>
                </div>
                <div className="absolute right-0 top-0 bottom-0 w-[45%] bg-red-900/30 border-l-2 border-red-500/50">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-red-400 text-xs font-bold tracking-wider opacity-50">
                    DANGER
                  </div>
                </div>

                {/* Green zone (success) */}
                <div 
                  className="absolute left-[45%] top-0 bottom-0 w-[10%] bg-green-500/30 border-x-2 border-green-400"
                  style={{
                    boxShadow: '0 0 15px rgba(34, 197, 94, 0.5)'
                  }}
                >
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-green-300 font-bold tracking-wider text-sm">
                    SYNC
                  </div>
                </div>

                {/* Moving indicator (nanobot swarm) */}
                <motion.div
                  className="absolute top-0 bottom-0 w-2 z-10 bg-gradient-to-b from-cyan-400 via-blue-500 to-cyan-400 rounded-full"
                  style={{ 
                    left: `${gaugePosition}%`,
                    boxShadow: '0 0 20px rgba(59, 130, 246, 0.9)'
                  }}
                />

                {/* Position markers */}
                <div className="absolute bottom-1 left-0 right-0 flex justify-between px-2 text-xs text-gray-500">
                  <span>0</span>
                  <span>25</span>
                  <span className="text-green-400 font-bold">50</span>
                  <span>75</span>
                  <span>100</span>
                </div>
              </div>

              {/* Activation Button */}
              <motion.button
                onClick={handleClick}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={showSuccess}
                className={`w-full py-6 rounded-xl font-bold text-xl tracking-wider transition-all duration-300 border-2 relative overflow-hidden ${
                  !gameStarted
                    ? 'bg-gradient-to-r from-green-600 to-cyan-600 border-green-400 text-white shadow-lg shadow-green-500/30'
                    : 'bg-gradient-to-r from-cyan-600 to-blue-600 border-cyan-400 text-white shadow-lg shadow-cyan-500/30'
                }`}
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  {!gameStarted ? (
                    <>
                      <Heart className="w-6 h-6" />
                      INITIALISE HEALING PROTOCOL
                    </>
                  ) : (
                    <>
                      <Zap className="w-6 h-6" />
                      SYNCHRONISE NANOBOTS
                    </>
                  )}
                </span>
              </motion.button>

              {/* Real-time feedback */}
              <AnimatePresence>
                {gameStarted && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-center"
                  >
                    <div className={`inline-block px-6 py-3 rounded-lg border-2 ${
                      gaugePosition >= 45 && gaugePosition <= 55
                        ? 'bg-green-900/80 border-green-500/50 text-green-400'
                        : 'bg-gray-900/80 border-gray-600/50 text-gray-400'
                    }`}>
                      <div className="text-sm tracking-wider">
                        SYNC STATUS: {gaugePosition >= 45 && gaugePosition <= 55 ? 'READY' : 'OUT OF RANGE'}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Healing Pod Activation Effect */}
            <AnimatePresence>
              {healingPodActive && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 pointer-events-none"
                >
                  {/* Healing wave effect - optimized */}
                  {Array.from({ length: 2 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute inset-0 border-4 border-green-400 rounded-2xl"
                      initial={{ scale: 0.9, opacity: 0.6 }}
                      animate={{ scale: 1.3, opacity: 0 }}
                      transition={{ duration: 0.8, delay: i * 0.2 }}
                    />
                  ))}

                  {/* Reduced nanobot particles - optimized */}
                  {Array.from({ length: 6 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 bg-green-400 rounded-full"
                      style={{
                        left: '50%',
                        top: '50%'
                      }}
                      animate={{
                        x: (Math.random() - 0.5) * 300,
                        y: (Math.random() - 0.5) * 300,
                        opacity: [1, 0],
                        scale: [1, 0]
                      }}
                      transition={{
                        duration: 1,
                        delay: Math.random() * 0.3
                      }}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* Evidence Scanner - Medical Bracelet - Strategically placed near medical terminal on the right */}
      <EvidenceScanner
        objectName="MEDICAL BRACELET"
        caption="Subject #EC-116. Neural compatibility: 98.7%"
        icon="⌚"
        position="right"
        logId="f6_medical_bracelet"
        onScanned={() => onCollectLog?.('f6_medical_bracelet')}
        isCollected={collectedLogs?.includes('f6_medical_bracelet')}
      />

      {/* Skip Button - Disabled when showing success */}
      {!showSuccess && (
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1 }}
          onClick={() => {
            if (!completionTriggeredRef.current) {
              completionTriggeredRef.current = true;
              onComplete();
            }
          }}
          className="fixed bottom-8 right-8 z-40 px-6 py-3 bg-green-600/80 hover:bg-green-500 border-2 border-green-400 rounded-lg backdrop-blur-sm transition-all duration-300 flex items-center gap-2 group"
        >
          <span className="text-white font-bold">SKIP</span>
          <SkipForward className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
        </motion.button>
      )}

      {/* Feedback Messages */}
      <AnimatePresence>
        {showFeedback && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: -50 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50"
          >
            <div className={`${
              showFeedback === 'success' || showFeedback === 'heal' ? 'bg-green-600/90 border-green-400' : 'bg-red-600/90 border-red-400'
            } border-4 rounded-xl px-12 py-8 backdrop-blur-md shadow-2xl`}>
              <motion.div
                animate={{
                  scale: showFeedback === 'fail' ? [1, 1.1, 1] : [1, 1.2, 1],
                }}
                transition={{ duration: 0.5 }}
                className="text-white text-4xl font-bold"
              >
                {showFeedback === 'success' ? 'NANOBOTS SYNCHRONISED' :
                 showFeedback === 'heal' ? '+20 HEALTH RESTORED' :
                 'SYNCHRONISATION FAILED'}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Overlay - pointer-events-none allows Radio messages to be clicked */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 pointer-events-none"
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
                    HEALING COMPLETE
                  </motion.div>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="text-green-300 text-3xl"
                  >
                    Medical AI protocol successful
                  </motion.p>
                </motion.div>

                {/* Optimized healing particles */}
                {Array.from({ length: 15 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-green-400 rounded-full"
                    style={{ left: '50%', top: '50%' }}
                    animate={{
                      x: (Math.random() - 0.5) * 600,
                      y: (Math.random() - 0.5) * 600,
                      opacity: [1, 0],
                      scale: [1, 0]
                    }}
                    transition={{
                      duration: 1.2,
                      delay: 0.2 + Math.random() * 0.2,
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
