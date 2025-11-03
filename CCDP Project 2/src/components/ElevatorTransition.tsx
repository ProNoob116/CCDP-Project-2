import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, AlertTriangle, SkipForward } from 'lucide-react';

interface ElevatorTransitionProps {
  fromFloor: number;
  toFloor: number;
  onComplete: () => void;
}

export function ElevatorTransition({ fromFloor, toFloor, onComplete }: ElevatorTransitionProps) {
  const [phase, setPhase] = useState<'descent' | 'arrival' | 'doors'>('descent');
  const [currentDisplay, setCurrentDisplay] = useState(fromFloor);
  const [progress, setProgress] = useState(0);
  const [flickering, setFlickering] = useState(false);
  const [smoothPosition, setSmoothPosition] = useState(0); // 0 = top floor, 100 = bottom floor

  useEffect(() => {
    const floorDifference = Math.abs(fromFloor - toFloor);
    const descentTime = 4000; // FIXED: 4 seconds total descent time
    const timePerFloor = descentTime / Math.max(floorDifference, 1); // Divide time across floors
    const arrivalTime = 800; // Slightly increased for smoother feel
    const doorTime = 1000; // Smooth door opening

    // Progress bar animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + (100 / (descentTime / 50));
      });
    }, 50);

    // Smooth position animation for floor indicators (updates every 16ms for 60fps)
    const startTime = Date.now();
    const smoothInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progressPercent = Math.min((elapsed / descentTime) * 100, 100);
      setSmoothPosition(progressPercent);
      
      if (progressPercent >= 100) {
        clearInterval(smoothInterval);
      }
    }, 16);

    // Floor countdown during descent
    const floorInterval = setInterval(() => {
      setCurrentDisplay((prev) => {
        const next = prev > toFloor ? prev - 1 : prev + 1;
        if (next === toFloor) {
          clearInterval(floorInterval);
        }
        return next;
      });
    }, timePerFloor);

    // Flickering effect mid-descent
    const flickerTimeout = setTimeout(() => {
      setFlickering(true);
      setTimeout(() => setFlickering(false), 400);
    }, descentTime / 2);

    // Phase: Descent → Arrival
    const arrivalTimeout = setTimeout(() => {
      setPhase('arrival');
    }, descentTime);

    // Phase: Arrival → Doors Opening
    const doorsTimeout = setTimeout(() => {
      setPhase('doors');
    }, descentTime + arrivalTime);

    // Complete
    const completeTimeout = setTimeout(() => {
      onComplete();
    }, descentTime + arrivalTime + doorTime);

    return () => {
      clearInterval(progressInterval);
      clearInterval(floorInterval);
      clearInterval(smoothInterval);
      clearTimeout(flickerTimeout);
      clearTimeout(arrivalTimeout);
      clearTimeout(doorsTimeout);
      clearTimeout(completeTimeout);
    };
  }, [fromFloor, toFloor, onComplete]);

  const getThreatColor = () => {
    if (toFloor >= 5) return 'cyan';
    if (toFloor >= 3) return 'yellow';
    if (toFloor >= 2) return 'orange';
    return 'red';
  };

  const floorNames: { [key: number]: string } = {
    7: 'DATA ROOM',
    6: 'MEDBAY',
    5: 'KITCHEN',
    4: 'ACCOUNTING',
    3: 'PRINTING ROOM',
    2: 'SLEEPING PODS',
    1: 'BALLROOM',
    0: 'GROUND FLOOR (EXIT)',
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black"
    >
      {/* Flickering overlay */}
      <AnimatePresence>
        {flickering && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.3, 0, 0.5, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 bg-red-500/20 pointer-events-none z-10"
          />
        )}
      </AnimatePresence>

      {/* PHASE 1: DESCENT */}
      {phase === 'descent' && (
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Enhanced Vertical motion lines - More prominent descent effect */}
          <div className="absolute inset-0 overflow-hidden opacity-50">
            {Array.from({ length: 40 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1.5 bg-gradient-to-b from-transparent via-cyan-400 to-transparent"
                style={{
                  left: `${2 + i * 2.5}%`,
                  height: '250%',
                  boxShadow: '0 0 8px rgba(6, 182, 212, 0.5)',
                }}
                animate={{
                  y: ['-120%', '180%'],
                }}
                transition={{
                  duration: 1.8,
                  ease: 'linear',
                  repeat: Infinity,
                  delay: i * 0.025,
                }}
              />
            ))}
          </div>

          {/* Enhanced elevator shaft background effect with stronger descent motion */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-b from-gray-900/60 via-transparent to-gray-900/60"
            animate={{
              backgroundPosition: ['0% 0%', '0% 150%'],
            }}
            transition={{
              duration: 2.5,
              ease: 'linear',
              repeat: Infinity,
            }}
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(6, 182, 212, 0.15) 42px)',
              backgroundSize: '100% 80px',
            }}
          />

          {/* Additional descending structural panels */}
          <div className="absolute inset-0 overflow-hidden opacity-30">
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={`panel-${i}`}
                className="absolute left-0 right-0 h-2 bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent"
                style={{
                  boxShadow: '0 0 15px rgba(6, 182, 212, 0.4)',
                }}
                animate={{
                  y: ['-15%', '115%'],
                }}
                transition={{
                  duration: 3,
                  ease: 'linear',
                  repeat: Infinity,
                  delay: i * 0.4,
                }}
              />
            ))}
          </div>

          {/* Descending floor markers on the sides */}
          <div className="absolute inset-0 overflow-hidden opacity-25">
            {Array.from({ length: 12 }).map((_, i) => (
              <motion.div
                key={`marker-${i}`}
                className="absolute left-4 right-4 flex justify-between items-center"
                animate={{
                  y: ['-10%', '110%'],
                }}
                transition={{
                  duration: 3.5,
                  ease: 'linear',
                  repeat: Infinity,
                  delay: i * 0.3,
                }}
              >
                <div className="w-12 h-1 bg-gradient-to-r from-cyan-400/60 to-transparent" />
                <div className="w-12 h-1 bg-gradient-to-l from-cyan-400/60 to-transparent" />
              </motion.div>
            ))}
          </div>

          {/* Enhanced Side floor indicators with cinematic smooth descent */}
          <div className="absolute left-12 top-1/4 bottom-1/4 flex flex-col justify-between">
            {(() => {
              // Calculate which specific floor-to-floor transition is happening now
              const totalFloorsToDescend = Math.abs(fromFloor - toFloor);
              const currentSegment = Math.floor((smoothPosition / 100) * totalFloorsToDescend);
              
              // Determine the current "from" and "to" floor for this segment
              const segmentFromFloor = fromFloor - currentSegment;
              const segmentToFloor = fromFloor - (currentSegment + 1);
              
              // Calculate position within this specific segment (0-1)
              const segmentProgress = ((smoothPosition / 100) * totalFloorsToDescend) - currentSegment;
              
              // Map floor numbers to their visual positions (0 = F7 at top, 7 = F0 at bottom)
              const fromPosition = 7 - segmentFromFloor; // Position in the list
              const toPosition = 7 - segmentToFloor;
              
              // Interpolate between the two positions
              const currentVisualPosition = fromPosition + (toPosition - fromPosition) * segmentProgress;
              
              // Convert to percentage (divide by 7 since there are 8 floors spanning index 0-7)
              const percentagePosition = (currentVisualPosition / 7) * 100;
              
              return (
                <>
                  {/* Smooth sliding position indicator */}
                  <motion.div
                    className="absolute left-0 w-full h-12 pointer-events-none"
                    style={{
                      top: `${percentagePosition}%`,
                      transform: 'translateY(-50%)',
                    }}
                  >
                    {/* Glowing indicator bar */}
                    <motion.div
                      animate={{
                        opacity: [0.6, 0.9, 0.6],
                        scale: [1, 1.05, 1],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                      }}
                      className="absolute -left-4 w-32 h-full bg-gradient-to-r from-cyan-400/40 via-cyan-300/60 to-transparent rounded-full blur-md"
                    />
                    <motion.div
                      animate={{
                        boxShadow: [
                          '0 0 20px rgba(6, 182, 212, 0.7)',
                          '0 0 35px rgba(6, 182, 212, 0.9)',
                          '0 0 20px rgba(6, 182, 212, 0.7)',
                        ],
                      }}
                      transition={{
                        duration: 1.2,
                        repeat: Infinity,
                      }}
                      className="absolute -left-6 w-2 h-full bg-gradient-to-b from-cyan-400 via-cyan-300 to-cyan-400 rounded-full"
                    />
                  </motion.div>

                  {/* Floor numbers */}
                  {Array.from({ length: 8 }).map((_, i) => {
                    const floorNum = 7 - i;
                    
                    // Only highlight if this floor is part of the current segment transition
                    const isInCurrentSegment = (floorNum === segmentFromFloor) || (floorNum === segmentToFloor);
                    
                    let intensity = 0;
                    if (isInCurrentSegment) {
                      if (floorNum === segmentFromFloor) {
                        // Leaving this floor - fade out
                        intensity = 1 - segmentProgress;
                      } else if (floorNum === segmentToFloor) {
                        // Arriving at this floor - fade in
                        intensity = segmentProgress;
                      }
                    }
                    
                    const isActive = intensity > 0.2;
                    
                    return (
                      <motion.div
                        key={floorNum}
                        animate={{
                          opacity: 0.3 + (intensity * 0.7),
                          scale: 1 + (intensity * 0.5),
                        }}
                        transition={{ 
                          duration: 0.1,
                          ease: 'linear'
                        }}
                        style={{
                          textShadow: isActive 
                            ? `0 0 ${10 + intensity * 25}px rgba(6, 182, 212, ${0.5 + intensity * 0.5})`
                            : '0 0 5px rgba(156, 163, 175, 0.3)',
                          color: isActive 
                            ? `rgb(${103 + intensity * 64}, ${232 - intensity * 22}, ${238 - intensity * 28})`
                            : 'rgb(156, 163, 175)',
                        }}
                        className="text-2xl font-bold tracking-wider transition-colors duration-100"
                      >
                        F{floorNum}
                      </motion.div>
                    );
                  })}
                </>
              );
            })()}
          </div>

          {/* Center display */}
          <div className="relative flex flex-col items-center gap-6">
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="flex flex-col items-center gap-2"
            >
              <ChevronDown className="w-16 h-16 text-red-500" />
              <div className="text-red-400 tracking-widest">DESCENDING</div>
            </motion.div>

            <motion.div
              key={currentDisplay}
              initial={{ scale: 1.3, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              <div className={`text-9xl font-bold text-${getThreatColor()}-400 tracking-tighter`}>
                F{currentDisplay}
              </div>
              <motion.div
                animate={{
                  opacity: [0.2, 0.5, 0.2],
                  scale: [1, 1.1, 1],
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className={`absolute inset-0 bg-${getThreatColor()}-400/20 blur-3xl`}
              />
            </motion.div>

            <div className="text-gray-400 tracking-wider">
              DESTINATION: <span className={`text-${getThreatColor()}-400 font-bold`}>F{toFloor}</span>
            </div>

            <div className="w-96 mt-4">
              <div className="text-gray-500 text-xs mb-2 tracking-wider">DESCENT PROGRESS</div>
              <div className="w-full h-2 bg-gray-900 rounded-full overflow-hidden border border-cyan-900">
                <motion.div
                  className={`h-full bg-gradient-to-r from-${getThreatColor()}-600 to-${getThreatColor()}-400`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PHASE 2: ARRIVAL */}
      {phase === 'arrival' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center space-y-6"
          >
            <motion.div
              animate={{
                textShadow: [
                  '0 0 20px rgba(34, 211, 238, 0.5)',
                  '0 0 40px rgba(34, 211, 238, 0.8)',
                  '0 0 20px rgba(34, 211, 238, 0.5)',
                ],
              }}
              transition={{ duration: 1, repeat: 2 }}
              className="text-6xl font-bold text-cyan-400 tracking-wider"
            >
              FLOOR {toFloor === 0 ? 'F0' : `F${toFloor}`}
            </motion.div>
            <div className="text-2xl text-gray-400 tracking-wider">
              {floorNames[toFloor]}
            </div>
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1, repeat: Infinity }}
              className={`text-${getThreatColor()}-400 tracking-wider`}
            >
              PREPARING ACCESS...
            </motion.div>
          </motion.div>
        </motion.div>
      )}

      {/* PHASE 3: DOORS OPENING */}
      {phase === 'doors' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0"
        >
          {/* Door halves */}
          <motion.div
            className="absolute inset-0 flex"
          >
            {/* Left door */}
            <motion.div
              initial={{ x: 0 }}
              animate={{ x: '-100%' }}
              transition={{ duration: 1.5, ease: [0.65, 0, 0.35, 1] }}
              className="w-1/2 h-full bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 border-r-4 border-cyan-500 relative"
            >
              {/* Door details */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="space-y-4 mr-12">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scaleX: 1 }}
                      animate={{ scaleX: 0 }}
                      transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                      className="h-1 w-32 bg-cyan-400/50"
                    />
                  ))}
                </div>
              </div>
              
              {/* Vertical panels */}
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute top-0 bottom-0 w-0.5 bg-gray-600/30"
                  style={{ left: `${20 + i * 15}%` }}
                />
              ))}
            </motion.div>

            {/* Right door */}
            <motion.div
              initial={{ x: 0 }}
              animate={{ x: '100%' }}
              transition={{ duration: 1.5, ease: [0.65, 0, 0.35, 1] }}
              className="w-1/2 h-full bg-gradient-to-l from-gray-900 via-gray-800 to-gray-700 border-l-4 border-cyan-500 relative"
            >
              {/* Door details */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="space-y-4 ml-12">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scaleX: 1 }}
                      animate={{ scaleX: 0 }}
                      transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                      className="h-1 w-32 bg-cyan-400/50"
                    />
                  ))}
                </div>
              </div>
              
              {/* Vertical panels */}
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute top-0 bottom-0 w-0.5 bg-gray-600/30"
                  style={{ left: `${20 + i * 15}%` }}
                />
              ))}
            </motion.div>
          </motion.div>

          {/* Door opening text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1, 0] }}
            transition={{ times: [0, 0.2, 0.8, 1], duration: 1.5 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <div className="text-center space-y-3">
              <motion.div
                animate={{
                  textShadow: [
                    '0 0 10px rgba(34, 211, 238, 0.5)',
                    '0 0 30px rgba(34, 211, 238, 0.8)',
                    '0 0 10px rgba(34, 211, 238, 0.5)',
                  ],
                }}
                transition={{ duration: 0.5, repeat: 2 }}
                className="text-4xl font-bold text-cyan-400 tracking-wider"
              >
                ACCESS GRANTED
              </motion.div>
              <div className="text-gray-400 tracking-wider">DOOR OVERRIDE COMPLETE</div>
            </div>
          </motion.div>

          {/* Light beam from opening */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-1 bg-cyan-400/50 blur-xl"
            style={{ width: '100px' }}
          />
        </motion.div>
      )}

      {/* Corner decorations */}
      {phase !== 'doors' && (
        <>
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              className={`absolute w-16 h-16 border-cyan-400 ${
                i === 0 ? 'top-8 left-8 border-t-2 border-l-2' :
                i === 1 ? 'top-8 right-8 border-t-2 border-r-2' :
                i === 2 ? 'bottom-8 left-8 border-b-2 border-l-2' :
                'bottom-8 right-8 border-b-2 border-r-2'
              }`}
            />
          ))}
        </>
      )}

      {/* Skip Button */}
      <motion.button
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        onClick={onComplete}
        className="fixed bottom-8 right-8 z-50 px-6 py-3 bg-red-600/80 hover:bg-red-500 border-2 border-red-400 rounded-lg backdrop-blur-sm transition-all duration-300 flex items-center gap-2 group"
      >
        <span className="text-white font-bold">SKIP</span>
        <SkipForward className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
      </motion.button>
    </motion.div>
  );
}
