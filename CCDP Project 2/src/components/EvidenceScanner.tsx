import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Scan, Check } from 'lucide-react';

interface EvidenceScannerProps {
  objectName: string;
  caption: string;
  icon: string; // emoji icon for the object
  position?: 'left' | 'center' | 'right';
  onScanned?: () => void;
  logId?: string; // Log ID for the evidence
  isCollected?: boolean; // Whether this evidence has already been collected
}

export function EvidenceScanner({
  objectName,
  caption,
  icon,
  position = 'center',
  onScanned,
  logId,
  isCollected = false
}: EvidenceScannerProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [isScanned, setIsScanned] = useState(false);
  const [showCaption, setShowCaption] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const captionTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Scanning animation
  useEffect(() => {
    if (isScanning && scanProgress < 100) {
      const timer = setTimeout(() => {
        setScanProgress(prev => Math.min(100, prev + 2));
      }, 20);
      return () => clearTimeout(timer);
    } else if (scanProgress >= 100 && !isScanned) {
      // Mark as scanned and show caption
      setIsScanned(true);
      
      // Small delay to ensure scanning overlay clears first
      setTimeout(() => {
        setShowCaption(true);
        console.log('Caption should be visible now:', { objectName, caption });
        
        // Hide caption after 4 seconds
        captionTimerRef.current = setTimeout(() => {
          setShowCaption(false);
          console.log('Caption hidden');
        }, 4000);
      }, 200);
      
      // Call the callback
      onScanned?.();
    }
  }, [isScanning, scanProgress, isScanned, onScanned, objectName, caption]);
  
  // Cleanup
  useEffect(() => {
    return () => {
      if (captionTimerRef.current) {
        clearTimeout(captionTimerRef.current);
      }
    };
  }, []);

  const handleScan = () => {
    if (!isScanned && !isScanning) {
      setIsScanning(true);
    }
  };

  const positionClasses = {
    left: 'left-24',
    center: 'left-1/2 -translate-x-1/2',
    right: 'right-48'
  };

  // Don't render if already collected
  if (isCollected) {
    return null;
  }

  return (
    <>
      {/* Scannable Object */}
      <motion.div
        className={`absolute bottom-24 ${positionClasses[position]} z-20`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleScan}
      >
        {/* Glow effect - MUCH MORE PROMINENT */}
        <motion.div
          className={`absolute inset-0 rounded-full blur-3xl ${
            isScanned ? 'bg-green-500/40' : 'bg-cyan-500/80'
          }`}
          animate={{
            scale: isScanned ? [1, 1.3, 1] : [1, 2, 1],
            opacity: isScanned ? [0.4, 0.6, 0.4] : [0.8, 1, 0.8]
          }}
          transition={{
            duration: isScanned ? 1.5 : 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
        
        {/* Additional outer glow ring */}
        {!isScanned && (
          <motion.div
            className="absolute inset-0 rounded-full blur-2xl bg-cyan-400/60"
            animate={{
              scale: [1.5, 2.5, 1.5],
              opacity: [0.6, 0.3, 0.6]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
        )}

        {/* Object container */}
        <motion.div
          className={`relative w-24 h-24 flex items-center justify-center cursor-pointer ${
            isScanned ? 'cursor-default' : 'cursor-pointer'
          }`}
          animate={{
            y: isScanned ? [0, -4, 0] : [0, -8, 0]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        >
          {/* Outer ring */}
          <motion.div
            className={`absolute inset-0 border-2 rounded-full ${
              isScanned ? 'border-green-500' : 'border-cyan-500'
            }`}
            animate={{
              rotate: 360,
              scale: isHovered ? 1.1 : 1
            }}
            transition={{
              rotate: { duration: 8, repeat: Infinity, ease: 'linear' },
              scale: { duration: 0.3 }
            }}
          />

          {/* Object icon */}
          <motion.div
            className="relative z-10 text-5xl"
            animate={{
              scale: isHovered ? 1.2 : 1
            }}
            transition={{ duration: 0.3 }}
          >
            {icon}
          </motion.div>

          {/* Scan indicator */}
          {!isScanned && (
            <motion.div
              className="absolute -top-2 -right-2 w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center"
              animate={{
                scale: isHovered ? [1, 1.3, 1] : 1
              }}
              transition={{ duration: 0.6, repeat: Infinity }}
            >
              <Scan className="w-4 h-4 text-black" />
            </motion.div>
          )}

          {/* Scanned checkmark */}
          {isScanned && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center"
            >
              <Check className="w-5 h-5 text-black" />
            </motion.div>
          )}

          {/* Scanning rings */}
          {isScanning && !isScanned && (
            <>
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="absolute inset-0 border-2 border-cyan-400 rounded-full"
                  initial={{ scale: 1, opacity: 0.8 }}
                  animate={{
                    scale: 3,
                    opacity: 0
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.5,
                    ease: 'easeOut'
                  }}
                />
              ))}
            </>
          )}
        </motion.div>

        {/* Hover prompt */}
        <AnimatePresence>
          {isHovered && !isScanned && !isScanning && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute -top-16 left-1/2 -translate-x-1/2 whitespace-nowrap"
            >
              <div className="bg-black/90 border-2 border-cyan-500 px-4 py-2 rounded-lg backdrop-blur-sm">
                <div className="text-cyan-400 text-xs tracking-wider">
                  CLICK TO SCAN
                </div>
                <div className="text-white text-sm font-bold mt-1">
                  {objectName}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Scanning overlay */}
      <AnimatePresence>
        {isScanning && !isScanned && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 pointer-events-none"
          >
            {/* Scan lines */}
            <motion.div
              className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
              animate={{ top: ['0%', '100%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            />

            {/* Center HUD */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-black/80 border-2 border-cyan-500 rounded-lg p-6 backdrop-blur-xl"
              >
                <div className="text-center space-y-4">
                  <div className="text-cyan-400 text-sm tracking-widest">
                    SCANNING EVIDENCE...
                  </div>
                  
                  <div className="flex items-center justify-center gap-3">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                      <Scan className="w-8 h-8 text-cyan-400" />
                    </motion.div>
                    <div className="text-5xl">{icon}</div>
                  </div>

                  <div className="text-white font-bold text-lg">
                    {objectName}
                  </div>

                  {/* Progress bar */}
                  <div className="w-64">
                    <div className="flex justify-between text-xs text-cyan-400 mb-2">
                      <span>ANALYSIS</span>
                      <span>{scanProgress}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-900 border border-cyan-500/50 rounded overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400"
                        style={{ width: `${scanProgress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Corner brackets */}
            {[
              { top: '20%', left: '20%', rotate: 0 },
              { top: '20%', right: '20%', rotate: 90 },
              { bottom: '20%', right: '20%', rotate: 180 },
              { bottom: '20%', left: '20%', rotate: 270 }
            ].map((pos, i) => (
              <motion.div
                key={i}
                className="absolute w-16 h-16"
                style={pos}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 0.6, scale: 1 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="relative w-full h-full" style={{ transform: `rotate(${pos.rotate}deg)` }}>
                  <div className="absolute top-0 left-0 w-8 h-0.5 bg-cyan-400" />
                  <div className="absolute top-0 left-0 w-0.5 h-8 bg-cyan-400" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Caption overlay - Evidence Information Display - Using Portal for guaranteed visibility */}
      {typeof window !== 'undefined' && createPortal(
        <AnimatePresence>
          {showCaption && isScanned && caption && (
            <motion.div
              key={`caption-${logId || objectName}`}
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="fixed inset-0 z-[9999] pointer-events-none flex items-start justify-center pt-32 px-4"
            >
              <motion.div
                className="pointer-events-auto bg-gradient-to-b from-green-950/98 to-black/98 border-2 border-green-500 rounded-xl p-6 backdrop-blur-xl shadow-2xl shadow-green-500/50 max-w-2xl w-full"
                animate={{
                  boxShadow: [
                    '0 0 40px rgba(34, 197, 94, 0.5)',
                    '0 0 80px rgba(34, 197, 94, 0.7)',
                    '0 0 40px rgba(34, 197, 94, 0.5)'
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {/* Header */}
                <div className="flex items-center gap-4 mb-4 pb-4 border-b border-green-500/30">
                  <div className="text-5xl flex-shrink-0">{icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-green-400 text-xs tracking-widest mb-1">
                      EVIDENCE COLLECTED
                    </div>
                    <div className="text-white font-bold text-xl">
                      {objectName}
                    </div>
                  </div>
                  <motion.div
                    className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                  >
                    <Check className="w-6 h-6 text-black" />
                  </motion.div>
                </div>

                {/* Caption - Evidence Description */}
                <motion.div 
                  className="text-white leading-relaxed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <p className="italic">"{caption}"</p>
                </motion.div>

                {/* Close hint */}
                <motion.div 
                  className="text-green-400/60 text-xs mt-4 text-center tracking-wider"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  [AUTO-DISMISS IN 4 SECONDS]
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
