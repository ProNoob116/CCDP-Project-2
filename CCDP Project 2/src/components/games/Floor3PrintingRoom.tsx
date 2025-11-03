import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, AlertTriangle, CheckCircle, Search, MapPin, Radio } from 'lucide-react';
import printingRoomImage from 'figma:asset/eddbabdef5cce7ac02ff4e8c8e7d0d6fd53ed5f6.png';
import { EvidenceScanner } from '../EvidenceScanner';

interface Floor3PrintingRoomProps {
  onComplete: () => void;
  onFail: () => void;
  onCollectLog?: (logId: string) => void;
  collectedLogs?: string[];
}

interface DocumentFragment {
  id: number;
  position: { x: number; y: number };
  collected: boolean;
  content: string;
  clue: string;
}

export function Floor3PrintingRoom({ onComplete, onFail, onCollectLog, collectedLogs = [] }: Floor3PrintingRoomProps) {
  const [gameStarted, setGameStarted] = useState(false);
  const [fragments, setFragments] = useState<DocumentFragment[]>([]);
  const [collectedCount, setCollectedCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showFaxPrinting, setShowFaxPrinting] = useState(false);
  const [faxProgress, setFaxProgress] = useState(0);
  const [revealedLocation, setRevealedLocation] = useState(false);
  const [showLocationFoundOverlay, setShowLocationFoundOverlay] = useState(false);
  const [hoverFragment, setHoverFragment] = useState<number | null>(null);
  const requiredFragments = 5;

  // Generate document fragments
  const generateFragments = (): DocumentFragment[] => {
    const clues = [
      { content: 'FLOOR: 0', clue: 'Security logs show activity on ground floor' },
      { content: 'SECTOR: B', clue: 'Maintenance reports unusual power drain' },
      { content: 'ROOM: 2-A', clue: 'Restricted access - Level 5 clearance' },
      { content: 'STATUS: ALIVE', clue: 'Life signs detected 18 hours ago' },
      { content: 'TIME: 03:47', clue: 'Last known communication timestamp' }
    ];

    return clues.map((clue, index) => ({
      id: index,
      position: {
        x: 15 + (index % 3) * 30 + Math.random() * 10,
        y: 20 + Math.floor(index / 3) * 35 + Math.random() * 10
      },
      collected: false,
      content: clue.content,
      clue: clue.clue
    }));
  };

  // Initialize game
  useEffect(() => {
    setFragments(generateFragments());
  }, []);

  // Timer
  useEffect(() => {
    if (!gameStarted || timeLeft <= 0 || showSuccess) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          onFail();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStarted, timeLeft, showSuccess, onFail]);

  // Fax printing animation
  useEffect(() => {
    if (showFaxPrinting) {
      const interval = setInterval(() => {
        setFaxProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setRevealedLocation(true);
            // Show Continue button after 2 seconds
            setTimeout(() => {
              setShowSuccess(true);
            }, 2000);
            return 100;
          }
          return prev + 2;
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [showFaxPrinting]);

  const handleFragmentCollect = (fragment: DocumentFragment) => {
    if (fragment.collected || !gameStarted) return;

    const newFragments = fragments.map(f =>
      f.id === fragment.id ? { ...f, collected: true } : f
    );
    setFragments(newFragments);

    const newCount = collectedCount + 1;
    setCollectedCount(newCount);

    if (newCount >= requiredFragments) {
      setTimeout(() => {
        setShowFaxPrinting(true);
      }, 500);
    }
  };

  const handleStart = () => {
    setGameStarted(true);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={printingRoomImage}
          alt="Printing Room"
          className="w-full h-full object-cover"
          style={{ filter: 'brightness(0.3)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-gray-900/50 to-black/80" />
      </div>

      {/* Tech grid overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none opacity-10" style={{
        backgroundImage: 'linear-gradient(rgba(59, 130, 246, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.5) 1px, transparent 1px)',
        backgroundSize: '30px 30px'
      }} />

      {/* Scan lines */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          backgroundImage: 'linear-gradient(transparent 50%, rgba(59, 130, 246, 0.03) 50%)',
          backgroundSize: '100% 4px'
        }}
        animate={{ backgroundPositionY: ['0px', '4px'] }}
        transition={{ duration: 0.1, repeat: Infinity, ease: 'linear' }}
      />

      <div className="relative z-10 flex flex-col items-center min-h-screen p-8 pt-32 pb-16">
        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12 bg-black/60 backdrop-blur-sm border border-blue-500/30 rounded-lg p-6 max-w-3xl w-full space-y-3"
        >
          <div className="text-blue-300 text-xl tracking-wider">
            Collect document fragments to reveal Elena's location
          </div>
          <div className="text-blue-400 text-sm flex items-center justify-center gap-2">
            <FileText className="w-4 h-4" />
            Click fragments before time runs out • {collectedCount}/{requiredFragments} collected
            {gameStarted && <span className={`ml-4 ${timeLeft <= 10 ? 'text-red-400' : 'text-orange-400'}`}>⏱ {timeLeft}s</span>}
          </div>
        </motion.div>

        {/* Main Game Area */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="w-full max-w-6xl flex-1 flex items-center justify-center"
        >
          {!gameStarted ? (
            <motion.button
              onClick={handleStart}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative px-10 py-6 rounded-2xl font-bold text-xl tracking-wider bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-600 border-4 border-cyan-400 text-white shadow-2xl overflow-hidden group"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 0.5 }}
              />
              <span className="relative z-10 flex items-center gap-3">
                <Search className="w-6 h-6" />
                SEARCH FOR ELENA'S LOCATION
                <FileText className="w-6 h-6" />
              </span>
            </motion.button>
          ) : showFaxPrinting ? (
            <div className="w-full max-w-3xl">
              {/* Fax Machine */}
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-gradient-to-b from-gray-800 to-gray-900 border-4 border-gray-700 rounded-2xl p-8 shadow-2xl"
              >
                <div className="text-center mb-6">
                  <div className="text-green-400 text-2xl font-bold tracking-wider mb-2 flex items-center justify-center gap-3">
                    <Radio className="w-8 h-8 animate-pulse" />
                    FAX TRANSMISSION IN PROGRESS
                  </div>
                  <div className="text-gray-400 text-sm tracking-wider">
                    Reconstructing location data from fragments...
                  </div>
                </div>

                {/* Fax printing animation */}
                <div className="bg-white rounded-lg p-6 min-h-96 relative overflow-hidden border-4 border-gray-600">
                  {/* Paper texture */}
                  <div className="absolute inset-0 opacity-5" style={{
                    backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)'
                  }} />

                  {/* Printing progress overlay */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-transparent"
                    initial={{ y: 0 }}
                    animate={{ y: '100%' }}
                    transition={{ duration: 5, ease: 'linear' }}
                  />

                  {/* Fax content */}
                  <div className="relative z-10 space-y-4 text-black">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: faxProgress > 10 ? 1 : 0 }}
                      className="border-b-2 border-black pb-2"
                    >
                      <div className="text-xs tracking-widest">CLASSIFIED INTELLIGENCE</div>
                      <div className="text-2xl font-bold">AGENT LOCATION REPORT</div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: faxProgress > 25 ? 1 : 0 }}
                      className="space-y-2"
                    >
                      <div className="flex justify-between text-sm">
                        <span className="font-bold">AGENT:</span>
                        <span>ELENA CROSS</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="font-bold">STATUS:</span>
                        <span className="text-green-600 font-bold">ALIVE</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="font-bold">LAST CONTACT:</span>
                        <span>03:47 AM</span>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: faxProgress > 50 ? 1 : 0 }}
                      className="border-t-2 border-black pt-4"
                    >
                      <div className="text-lg font-bold mb-2 flex items-center gap-2">
                        <MapPin className="w-5 h-5" />
                        CONFIRMED LOCATION:
                      </div>
                    </motion.div>

                    {revealedLocation && (
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-yellow-100 border-4 border-yellow-500 rounded-lg p-6 text-center"
                      >
                        <div className="text-3xl font-bold text-red-600 mb-2">
                          FLOOR 2
                        </div>
                        <div className="text-xl font-bold text-gray-800">
                          SLEEPING POD ROOM
                        </div>
                        <div className="text-sm text-gray-600 mt-2">
                          SECTOR B • ROOM 2-A
                        </div>
                      </motion.div>
                    )}

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: faxProgress > 75 ? 1 : 0 }}
                      className="text-xs text-gray-600 pt-4 border-t border-gray-400"
                    >
                      <div>TRANSMISSION ID: FAX-{Math.floor(Math.random() * 10000)}</div>
                      <div>AUTHENTICATED: AGENT CROSS, SIMON</div>
                      <div>CLASSIFICATION: TOP SECRET</div>
                    </motion.div>
                  </div>

                  {/* Scan line effect */}
                  <motion.div
                    className="absolute left-0 right-0 h-1 bg-green-400/50 blur-sm"
                    animate={{ y: ['0%', '100%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  />
                </div>

                {/* Progress indicator */}
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-gray-400 mb-2">
                    <span>TRANSMISSION PROGRESS</span>
                    <span className="font-bold text-green-400">{Math.round(faxProgress)}%</span>
                  </div>
                  <div className="w-full h-2 bg-black/80 border border-green-500/30 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-green-600 to-green-400"
                      style={{ width: `${faxProgress}%` }}
                    />
                  </div>
                </div>
              </motion.div>

              {showSuccess && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  className="mt-6 text-center space-y-6"
                >
                  <div>
                    <div className="text-4xl font-bold text-green-400 mb-2 flex items-center justify-center gap-3">
                      <CheckCircle className="w-12 h-12" />
                      LOCATION CONFIRMED
                    </div>
                    <div className="text-green-300 text-xl">
                      Elena is in the Sleeping Pod Room - Floor 2!
                    </div>
                  </div>
                  
                  {/* Continue button - triggers location found overlay */}
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowLocationFoundOverlay(true)}
                    className="bg-gradient-to-r from-green-600 to-cyan-600 hover:from-green-700 hover:to-cyan-700 text-white px-12 py-4 rounded-xl font-bold text-xl border-2 border-green-400 shadow-[0_0_20px_rgba(34,197,94,0.5)] transition-all"
                  >
                    CONTINUE →
                  </motion.button>
                </motion.div>
              )}
            </div>
          ) : (
            <div className="w-full">
              {/* Instructions */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-8 bg-black/60 backdrop-blur-sm border border-cyan-500/30 rounded-lg p-4"
              >
                <div className="text-cyan-300 text-xl tracking-wider mb-2">
                  COLLECT ALL LOCATION FRAGMENTS
                </div>
                <div className="text-cyan-400/70 text-sm">
                  🔍 Find the scattered documents to piece together Elena's location
                </div>
              </motion.div>

              {/* Document fragments scattered area */}
              <div className="relative bg-gradient-to-b from-gray-900/80 via-gray-800/80 to-gray-900/80 border-4 border-gray-700 rounded-2xl p-8 shadow-2xl min-h-[500px] overflow-hidden">
                {/* Warning label */}
                <div className="absolute top-4 right-4 bg-yellow-950/80 border-2 border-yellow-500 px-4 py-2 rounded z-10">
                  <div className="text-yellow-400 text-xs tracking-widest flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    CLASSIFIED DOCUMENTS
                  </div>
                </div>

                {/* Fragments */}
                {fragments.map((fragment) => (
                  <motion.button
                    key={fragment.id}
                    onClick={() => handleFragmentCollect(fragment)}
                    onHoverStart={() => setHoverFragment(fragment.id)}
                    onHoverEnd={() => setHoverFragment(null)}
                    disabled={fragment.collected}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                      opacity: fragment.collected ? 0 : 1,
                      scale: fragment.collected ? 0 : 1,
                      y: fragment.collected ? -100 : 0
                    }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                    className={`absolute ${fragment.collected ? 'pointer-events-none' : 'cursor-pointer'}`}
                    style={{
                      left: `${fragment.position.x}%`,
                      top: `${fragment.position.y}%`,
                    }}
                  >
                    {/* Document paper */}
                    <div className="relative">
                      <motion.div
                        className="w-32 h-40 bg-gradient-to-b from-white to-gray-100 border-2 border-gray-400 rounded shadow-lg overflow-hidden"
                        animate={fragment.collected ? {} : {
                          boxShadow: [
                            '0 0 10px rgba(34, 197, 94, 0.3)',
                            '0 0 20px rgba(34, 197, 94, 0.6)',
                            '0 0 10px rgba(34, 197, 94, 0.3)'
                          ]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        {/* Paper lines */}
                        <div className="absolute inset-0" style={{
                          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 19px, rgba(0,0,0,0.1) 19px, rgba(0,0,0,0.1) 20px)'
                        }} />

                        {/* Content */}
                        <div className="relative p-3 h-full flex flex-col justify-center items-center">
                          <FileText className="w-8 h-8 text-cyan-600 mb-2" />
                          <div className="text-black text-xs font-bold text-center break-words">
                            {fragment.content}
                          </div>
                        </div>

                        {/* Collect indicator */}
                        {!fragment.collected && (
                          <motion.div
                            className="absolute inset-0 bg-green-500/20 border-2 border-green-400 flex items-center justify-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: hoverFragment === fragment.id ? 1 : 0 }}
                          >
                            <div className="text-green-600 font-bold text-sm">COLLECT</div>
                          </motion.div>
                        )}
                      </motion.div>

                      {/* Tooltip on hover */}
                      <AnimatePresence>
                        {hoverFragment === fragment.id && !fragment.collected && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute -top-16 left-1/2 -translate-x-1/2 bg-black/90 border border-cyan-500 rounded-lg px-3 py-2 whitespace-nowrap z-20"
                          >
                            <div className="text-cyan-300 text-xs">{fragment.clue}</div>
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-cyan-500" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.button>
                ))}

                {/* Collection hint */}
                {collectedCount > 0 && collectedCount < requiredFragments && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-cyan-950/80 border border-cyan-500 rounded-lg px-6 py-3"
                  >
                    <div className="text-cyan-300 text-sm">
                      Keep searching! {requiredFragments - collectedCount} more fragment{requiredFragments - collectedCount !== 1 ? 's' : ''} needed
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Evidence Scanner - Shredded Document - Strategically placed near left printer/shredder area */}
      <EvidenceScanner
        objectName="SHREDDED DOCUMENT"
        caption="Someone tried to destroy evidence of Elena's location. They didn't finish the job."
        icon="📄"
        position="left"
        logId="f3_shredded_document"
        onScanned={() => onCollectLog?.('f3_shredded_document')}
        isCollected={collectedLogs?.includes('f3_shredded_document')}
      />

      {/* Success Overlay - LOCATION FOUND! (triggered by Continue button) */}
      <AnimatePresence>
        {showLocationFoundOverlay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onAnimationComplete={() => {
              // Trigger descend after overlay animation
              setTimeout(() => {
                onComplete();
              }, 2000);
            }}
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
                    LOCATION FOUND!
                  </motion.div>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="text-green-300 text-3xl"
                  >
                    Elena's coordinates recovered
                  </motion.p>
                </motion.div>

                {/* Success particles */}
                {Array.from({ length: 25 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-green-400 rounded-full"
                    style={{
                      left: `${50 + (Math.random() - 0.5) * 40}%`,
                      top: `${50 + (Math.random() - 0.5) * 40}%`
                    }}
                    animate={{
                      y: [0, -100 - Math.random() * 100],
                      x: [(Math.random() - 0.5) * 50, (Math.random() - 0.5) * 100],
                      opacity: [1, 0],
                      scale: [1, 0]
                    }}
                    transition={{
                      duration: 1.5,
                      delay: Math.random() * 0.5
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
