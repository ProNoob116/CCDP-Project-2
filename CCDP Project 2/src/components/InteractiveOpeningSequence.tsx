import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SkipForward } from 'lucide-react';
import { RadioMessage } from './RadioMessage';
import { commanderMessages } from '../data/commanderMessages';
import commanderAvatar from 'figma:asset/1ad715e94183518f89a0008c49ccf0c9d42cce31.png';

interface InteractiveOpeningSequenceProps {
  onComplete: () => void;
}

export function InteractiveOpeningSequence({ onComplete }: InteractiveOpeningSequenceProps) {
  const [stage, setStage] = useState<'story' | 'boot' | 'decrypt'>('story');
  const [storyStep, setStoryStep] = useState(0);
  const [bootProgress, setBootProgress] = useState(0);
  const [decryptInput, setDecryptInput] = useState('');
  const [decryptError, setDecryptError] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showCodeAcceptedMessages, setShowCodeAcceptedMessages] = useState(false);
  const [codeAcceptedMessageIndex, setCodeAcceptedMessageIndex] = useState(0);
  const [showCommanderPopup, setShowCommanderPopup] = useState(false);
  const [decryptSuccess, setDecryptSuccess] = useState(false);

  // Cinematic texts - moved outside component to prevent recreation
  const storyTexts = [
    { 
      text: "THE YEAR IS 2057...", 
      duration: 3000,
      style: "text-cyan-400 text-2xl md:text-3xl tracking-widest"
    },
    { 
      text: "ARTIFICIAL INTELLIGENCE HAS EVOLVED BEYOND HUMAN CONTROL", 
      duration: 4000,
      style: "text-red-400 text-xl md:text-2xl tracking-wide animate-pulse"
    },
    { 
      text: "IN THE WORLD OF HEISENBERG, THE NAHRAN-7 TOWER STANDS AS A FORTRESS OF UNETHICAL AI RESEARCH", 
      duration: 4000,
      style: "text-white text-lg md:text-xl tracking-wide"
    },
    { 
      text: "ONE LAST MISSION REMAINS...", 
      duration: 3000,
      style: "text-yellow-400 text-xl md:text-2xl tracking-wider"
    },
    { 
      text: "INFILTRATE. EXTRACT. SURVIVE.", 
      duration: 4000,
      style: "text-red-500 text-2xl md:text-4xl font-bold tracking-widest glitch"
    },
    { 
      text: "AGENT SIMON CROSS", 
      duration: 3000,
      style: "text-green-400 text-xl md:text-3xl tracking-widest font-bold"
    },
    { 
      text: "HEISENBERG NEEDS YOU!", 
      duration: 3000,
      style: "text-red-500 text-2xl md:text-3xl tracking-widest font-bold red-glow-title"
    }
  ];

  // Manual advance - auto complete when all texts shown
  useEffect(() => {
    if (stage === 'story' && storyStep >= storyTexts.length) {
      // Auto complete after all texts shown
      const finalTimer = setTimeout(() => {
        setStage('boot');
      }, 2000);
      return () => clearTimeout(finalTimer);
    }
  }, [stage, storyStep]);

  // Boot sequence - gradually increase from 0 to 100 over 4 seconds
  useEffect(() => {
    if (stage === 'boot' && bootProgress < 100) {
      // 4 seconds = 4000ms, increment every 40ms for smooth animation (100 steps)
      const timer = setTimeout(() => {
        setBootProgress(prev => Math.min(100, prev + 1));
      }, 40);
      return () => clearTimeout(timer);
    } else if (stage === 'boot' && bootProgress >= 100) {
      // Wait 1 second at 100% before transitioning
      setTimeout(() => {
        setStage('decrypt');
        // Show Commander Grey popup immediately
        setShowCommanderPopup(true);
      }, 1000); // Wait 1 second at 100%
    }
  }, [stage, bootProgress]);

  // Show Commander Grey popup when on decrypt stage (reappear if dismissed)
  useEffect(() => {
    if (stage === 'decrypt' && !showCodeAcceptedMessages && !decryptSuccess) {
      // Show popup initially
      setShowCommanderPopup(true);
      
      // Reappear every 10 seconds if dismissed
      const interval = setInterval(() => {
        setShowCommanderPopup(true);
      }, 10000);
      
      return () => clearInterval(interval);
    }
  }, [stage, showCodeAcceptedMessages, decryptSuccess]);



  const handleSkipStory = () => {
    setStage('boot');
  };

  const handleDecrypt = () => {
    if (decryptInput.toUpperCase() === 'CROSS') {
      // Set decrypt success to turn binary green
      setDecryptSuccess(true);
      
      // Wait 2 seconds before showing code accepted messages
      setTimeout(() => {
        setShowCodeAcceptedMessages(true);
        setCodeAcceptedMessageIndex(0);
      }, 2000);
    } else {
      setDecryptError(true);
      setShowHint(true);
      const input = document.getElementById('decrypt-input');
      if (input) {
        input.classList.add('animate-shake');
        setTimeout(() => {
          input.classList.remove('animate-shake');
          setDecryptError(false);
        }, 500);
      }
      setDecryptInput('');
    }
  };

  const handleCodeAcceptedMessageComplete = () => {
    if (codeAcceptedMessageIndex < commanderMessages.codeAccepted.length - 1) {
      // Show next message after 1 second
      setTimeout(() => {
        setCodeAcceptedMessageIndex(codeAcceptedMessageIndex + 1);
      }, 1000);
    } else {
      // All messages complete, go to mission briefing
      setTimeout(() => onComplete(), 1000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black overflow-hidden" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
      <AnimatePresence mode="wait">
        {/* Stage 0: Story Cinematic with NAHRAN TOWER */}
        {stage === 'story' && (
          <motion.div
            key="story"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black"
            onClick={() => storyStep < storyTexts.length && setStoryStep(prev => prev + 1)}
          >
            {/* NAHRAN Tower Background - Zooming In */}
            <motion.div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: 'url(https://images.unsplash.com/photo-1670935575098-932434dfbce4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXJrJTIwZnV0dXJpc3RpYyUyMHRvd2VyJTIwYnVpbGRpbmclMjBuaWdodHxlbnwxfHx8fDE3NjA0MjQxODR8MA&ixlib=rb-4.1.0&q=80&w=1080)',
              }}
              animate={{
                scale: [1, 1.3],
                filter: ['brightness(0.3)', 'brightness(0.5)']
              }}
              transition={{ duration: storyTexts.length * 2.5, ease: 'linear' }}
            />

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />

            {/* Red Alert Pulse */}
            <motion.div
              className="absolute inset-0 bg-red-600"
              animate={{
                opacity: [0, 0.05, 0]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />

            {/* Tech Grid Overlay */}
            <div className="absolute inset-0 tech-grid opacity-5" />

            {/* Floating Particles - Red Danger Theme */}
            <div className="absolute inset-0">
              {Array.from({ length: 30 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 rounded-full"
                  style={{
                    background: i % 2 === 0 ? '#dc2626' : '#ef4444',
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    y: [0, Math.random() * 200 - 100],
                    x: [0, Math.random() * 100 - 50],
                    opacity: [0, 1, 0],
                    scale: [0, 1.5, 0]
                  }}
                  transition={{
                    duration: Math.random() * 8 + 4,
                    repeat: Infinity,
                    ease: 'linear',
                    delay: Math.random() * 3
                  }}
                />
              ))}
            </div>

            {/* Lightning Effects on NAHRAN-7 Text */}
            {storyStep === 3 && (
              <motion.div
                className="absolute inset-0 bg-red-500"
                animate={{
                  opacity: [0, 0.3, 0, 0.5, 0]
                }}
                transition={{ duration: 0.4, times: [0, 0.1, 0.3, 0.5, 1] }}
              />
            )}

            {/* Main Text Display with Animated Entrance - VERTICALLY CENTERED */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative z-10 text-center max-w-5xl px-8">
                <AnimatePresence mode="wait">
                  {storyStep < storyTexts.length && (
                    <motion.div
                      key={storyStep}
                      initial={{ opacity: 0, y: 50, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -50, scale: 1.2 }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    >
                      <h1 className={storyTexts[storyStep].style}>
                        {storyTexts[storyStep].text}
                      </h1>
                      
                      {/* Debug Info */}
                      <div className="mt-4 text-xs text-gray-400">
                        [{storyStep + 1}/{storyTexts.length}] - Click anywhere to advance manually
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Progress Indicator with Glow */}
            <motion.div 
              className="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-80 h-2 bg-gray-900/50 rounded-full overflow-hidden border border-red-500/30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <motion.div
                className="h-full bg-gradient-to-r from-red-600 via-red-500 to-red-400 rounded-full"
                animate={{ 
                  width: `${((storyStep + 1) / storyTexts.length) * 100}%` 
                }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{
                  x: ['-100%', '200%']
                }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              />
            </motion.div>

            {/* Skip Button - LARGER AND MORE PROMINENT */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2 }}
              onClick={handleSkipStory}
              className="fixed bottom-8 right-8 bg-red-600/80 hover:bg-red-600 border-2 border-red-400 hover:border-red-300 text-white px-10 py-4 rounded-lg font-bold tracking-widest text-lg transition-all duration-300 backdrop-blur-md shadow-2xl shadow-red-500/50 hover:scale-105"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              SKIP INTRO
            </motion.button>

            {/* Click to advance hint - More Visible */}
            <motion.div 
              className="absolute bottom-8 left-8 text-sm text-cyan-400 tracking-wide"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Click anywhere to advance
            </motion.div>
          </motion.div>
        )}

        {/* Tactical HUD Overlay - Visible after story */}
        {stage !== 'story' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 pointer-events-none"
          >
            {/* Corner Brackets */}
            <div className="absolute top-0 left-0 w-24 h-24 border-l-4 border-t-4 border-cyan-500/50" />
            <div className="absolute top-0 right-0 w-24 h-24 border-r-4 border-t-4 border-cyan-500/50" />
            <div className="absolute bottom-0 left-0 w-24 h-24 border-l-4 border-b-4 border-cyan-500/50" />
            <div className="absolute bottom-0 right-0 w-24 h-24 border-r-4 border-b-4 border-cyan-500/50" />

            {/* Status Bar Top */}
            <div className="absolute top-6 left-28 right-28 flex justify-between text-cyan-400 text-xs tracking-wider">
              <div>HEISENBERG MILITARY COMMAND</div>
              <div className="flex items-center gap-2">
                <motion.div
                  className="w-2 h-2 bg-green-500 rounded-full"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
                <span>SECURE</span>
              </div>
            </div>

            {/* Status Bar Bottom */}
            <div className="absolute bottom-6 left-28 right-28 flex justify-between text-cyan-400 text-xs tracking-wider">
              <div>CLASSIFIED - YOUR EYES ONLY</div>
              <div>2057</div>
            </div>

            {/* Scan Lines */}
            <motion.div
              className="absolute inset-0 opacity-5"
              style={{
                backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(6, 182, 212, 0.8) 3px)'
              }}
              animate={{
                backgroundPosition: ['0px 0px', '0px 100px']
              }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            />
          </motion.div>
        )}

        {/* Stage 1: System Boot */}
        {stage === 'boot' && (
          <motion.div
            key="boot"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            {/* Tech Grid */}
            <div className="absolute inset-0 tech-grid opacity-10" />

            <div className="relative z-10 max-w-2xl w-full px-8">
              {/* Boot Screen */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="space-y-8"
              >
                {/* Logo/Title with Animation */}
                <div className="text-center mb-12">
                  <motion.div
                    className="text-cyan-400 text-6xl font-bold mb-4 blue-glow-title tracking-[0.3em]"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: [0.8, 1, 0.8] }}
                    transition={{ 
                      scale: { duration: 1, ease: 'backOut' },
                      opacity: { duration: 2, repeat: Infinity } 
                    }}
                  >
                    NAHRAN
                  </motion.div>
                  <motion.div
                    className="text-red-500 text-2xl tracking-[0.5em]"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    DESCENT
                  </motion.div>
                </div>

                {/* Boot Sequence - Typing Animation */}
                <div className="space-y-4">
                  <div className="text-green-400 text-sm tracking-wide space-y-2">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1 }}
                    >
                      → INITIALIZING TACTICAL SYSTEMS...
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.3 }}
                    >
                      → ESTABLISHING SECURE CONNECTION...
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.6 }}
                    >
                      → VERIFYING CLEARANCE LEVEL...
                    </motion.div>
                  </div>

                  {/* Progress Bar with Glow */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-cyan-400 text-xs">
                      <span>SYSTEM BOOT</span>
                      <span>{bootProgress}%</span>
                    </div>
                    <div className="w-full h-3 bg-gray-900 border-2 border-cyan-500/50 rounded overflow-hidden relative">
                      <motion.div
                        className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 relative"
                        animate={{
                          width: `${bootProgress}%`
                        }}
                        transition={{ duration: 0.1 }}
                      >
                        {/* Animated shine effect */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                          animate={{
                            x: ['-100%', '200%']
                          }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                        />
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Stage 2: Decrypt - MILITARY STYLE */}
        {stage === 'decrypt' && !showCodeAcceptedMessages && (
          <motion.div
            key="decrypt"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            {/* Background */}
            <div className="absolute inset-0">
              {/* Hexagonal Pattern */}
              <div className="absolute inset-0 opacity-10" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l25.98 15v30L30 60 4.02 45V15z' fill='none' stroke='%2306b6d4' stroke-width='1'/%3E%3C/svg%3E")`,
                backgroundSize: '60px 60px'
              }} />

              {/* Data Stream */}
{Array.from({ length: 10 }).map((_, i) => {
  // Randomize each stream’s behavior
  const duration = 6 + Math.random() * 6; // 6–12s fall speed
  const flashDelay = Math.random() * 5; // offset for the flash timing
  const flashDuration = 1 + Math.random() * 2; // each flash lasts 1–3s

  return (
    <motion.div
      key={i}
      className={`absolute text-opacity-100 text-7xl font-mono whitespace-pre ${
        decryptSuccess ? 'text-green-400' : 'text-red-500'
      }`}
      style={{
        left: `${i * 10}%`,
        top: -20,
        filter: 'brightness(2.0) saturate(1.6)',
      }}
      animate={{
        y: ['0vh', '110vh'],
        opacity: [0.6, 1, 0.8, 1],
        filter: [
          'brightness(1.4) saturate(1.2)',
          'brightness(1.8) saturate(1.4)',
          'brightness(2.2) saturate(1.6)',
          'brightness(1.6) saturate(1.3)',
        ],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'linear',
        delay: Math.random() * 5,
      }}
    >
      {/* Binary stream text */}
      <motion.span
        animate={{
          opacity: [0.8, 1, 0.7, 1],
          filter: decryptSuccess ? [
            'drop-shadow(0 0 6px rgba(0,255,0,0.6))',
            'drop-shadow(0 0 12px rgba(0,255,0,1))',
            'drop-shadow(0 0 6px rgba(0,255,0,0.6))',
          ] : [
            'drop-shadow(0 0 6px rgba(220,38,38,0.6))',
            'drop-shadow(0 0 12px rgba(220,38,38,1))',
            'drop-shadow(0 0 6px rgba(220,38,38,0.6))',
          ],
        }}
        transition={{
          duration: flashDuration,
          repeat: Infinity,
          delay: flashDelay,
          ease: 'easeInOut',
        }}
      >
        {Array.from({ length: 25 })
          .map(() => (Math.random() > 0.5 ? '1' : '0'))
          .join('\n')}
      </motion.span>
    </motion.div>
  );
})}

            </div>

            {/* Main Panel */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative max-w-3xl w-full mx-8"
            >
              {/* Glow */}
              <motion.div
                className="absolute -inset-2 bg-cyan-500/20 blur-xl"
                animate={{
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />

              {/* Panel */}
              <div className="relative bg-black/95 border-4 border-cyan-500 p-10">
                {/* Corner Brackets */}
                <div className="absolute top-1 left-1 w-6 h-6 border-l-2 border-t-2 border-cyan-400" />
                <div className="absolute top-1 right-1 w-6 h-6 border-r-2 border-t-2 border-cyan-400" />
                <div className="absolute bottom-1 left-1 w-6 h-6 border-l-2 border-b-2 border-cyan-400" />
                <div className="absolute bottom-1 right-1 w-6 h-6 border-r-2 border-b-2 border-cyan-400" />

                {/* Header with Animation */}
                <motion.div 
                  className="text-center mb-8"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <h1 className="text-cyan-400 text-4xl font-bold blue-glow-title tracking-[0.3em] mb-3">
                    SECURITY CLEARANCE
                  </h1>
                  <p className="text-gray-400 text-sm tracking-wider">
                    AGENT IDENTIFICATION REQUIRED
                  </p>
                </motion.div>

                {/* Input Section */}
                <motion.div 
                  className="space-y-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <div>
                    <label className={`block text-lg mb-3 tracking-wider transition-colors duration-300 ${
                      decryptSuccess ? 'text-green-400' : 'text-red-500'
                    }`}>
                      CODENAME:
                    </label>
                    <input
                      id="decrypt-input"
                      type="text"
                      value={decryptInput}
                      onChange={(e) => setDecryptInput(e.target.value.toUpperCase())}
                      onKeyPress={(e) => e.key === 'Enter' && handleDecrypt()}
                      className={`w-full bg-black border-3 px-6 py-5 text-4xl tracking-[0.5em] focus:outline-none transition-all duration-300 text-center font-bold ${
                        decryptError 
                          ? 'border-red-500 text-red-400' 
                          : decryptSuccess
                          ? 'border-green-500 text-green-400'
                          : 'border-red-500 text-red-400'
                      }`}
                      placeholder="_ _ _ _ _"
                      maxLength={5}
                      autoFocus
                    />
                  </div>

                  {/* Error */}
                  {decryptError && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-red-900/20 border-l-4 border-red-500 p-4"
                    >
                      <div className="text-red-400 text-sm tracking-wide">
                        ACCESS DENIED - Invalid codename
                      </div>
                    </motion.div>
                  )}

                  {/* Hint */}
                  {showHint && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-yellow-900/10 border border-yellow-500/30 p-4 text-center"
                    >
                      <div className="text-yellow-400 text-xs tracking-wide">
                        HINT: Agent's surname from transmission
                      </div>
                    </motion.div>
                  )}

                  {/* Submit */}
                  <motion.button
                    onClick={handleDecrypt}
                    disabled={decryptInput.length === 0}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className={`w-full flex items-center justify-center text-white px-8 py-5 text-xl font-bold tracking-widest transition-all duration-300 border-2 ${
                      decryptSuccess 
                        ? 'bg-green-600 hover:bg-green-700 border-green-400'
                        : 'bg-red-600 hover:bg-red-700 border-red-400'
                    } disabled:bg-gray-800 disabled:border-gray-600`}
                  >
                    DECRYPT ACCESS
                  </motion.button>

                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Commander Messages - Code Accepted (shown after entering correct code) */}
      {showCodeAcceptedMessages && (
        <RadioMessage
          key={codeAcceptedMessageIndex}
          speaker={commanderMessages.codeAccepted[codeAcceptedMessageIndex].speaker}
          message={commanderMessages.codeAccepted[codeAcceptedMessageIndex].message}
          duration={commanderMessages.codeAccepted[codeAcceptedMessageIndex].duration}
          priority={commanderMessages.codeAccepted[codeAcceptedMessageIndex].priority}
          showAvatar={true}
          cinematic={true}
          onComplete={handleCodeAcceptedMessageComplete}
        />
      )}

      {/* Commander Grey Popup - Password Hint */}
      <AnimatePresence>
        {showCommanderPopup && stage === 'decrypt' && !showCodeAcceptedMessages && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed top-6 right-6 z-[9999] max-w-md"
          >
            <div className="bg-blue-950/98 border-2 border-blue-500 backdrop-blur-xl overflow-hidden shadow-2xl shadow-blue-500/30">
              {/* Corner brackets */}
              <div className="absolute top-1 left-1 w-4 h-4 border-l-2 border-t-2 border-blue-400" />
              <div className="absolute top-1 right-1 w-4 h-4 border-r-2 border-t-2 border-blue-400" />
              <div className="absolute bottom-1 left-1 w-4 h-4 border-l-2 border-b-2 border-blue-400" />
              <div className="absolute bottom-1 right-1 w-4 h-4 border-r-2 border-b-2 border-blue-400" />

              <div className="flex items-start gap-3 p-4">
                {/* Commander Avatar */}
                <div className="relative flex-shrink-0">
                  <div className="w-24 h-24 border-2 border-blue-500 rounded-lg overflow-hidden relative">
                    <img 
                      src={commanderAvatar} 
                      alt="Commander Grey"
                      className="w-full h-full object-cover"
                      style={{ imageRendering: 'high-quality', mixBlendMode: 'lighten' }}
                    />
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-400/30 to-transparent"
                      animate={{ y: [-64, 64] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    />
                  </div>
                  <motion.div 
                    className="w-2 h-2 bg-blue-500 rounded-full absolute -top-1 -right-1"
                    animate={{ opacity: [1, 0.3, 1], scale: [1, 1.3, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                </div>

                {/* Message */}
                <div className="flex-1 pt-1">
                  <div className="text-blue-300 text-xs tracking-wide mb-2">
                    COMMANDER GREY - OVERWATCH
                  </div>
                  <div className="text-white text-sm leading-relaxed mb-3">
                    Cross, enter your codename to proceed with the mission. Type <span className="text-green-400 font-bold tracking-wider">CROSS</span> to decrypt access.
                  </div>
                  
                  {/* Close button */}
                  <button
                    onClick={() => setShowCommanderPopup(false)}
                    className="text-xs text-blue-400 hover:text-blue-300 tracking-wide transition-colors"
                  >
                    [ACKNOWLEDGED]
                  </button>
                </div>
              </div>

              {/* Audio indicator */}
              <div className="px-4 pb-3 pt-2 flex items-center gap-1 border-t border-blue-700/50 bg-black/30">
                <span className="text-xs text-blue-400/70 mr-2">LIVE</span>
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-1 bg-gradient-to-t from-blue-500 to-blue-300 rounded-full"
                    animate={{
                      height: [3, Math.random() * 12 + 4, 3],
                    }}
                    transition={{
                      duration: 0.4,
                      repeat: Infinity,
                      delay: i * 0.05,
                    }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Skip Button - Boot Stage */}
      {stage === 'boot' && (
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          onClick={() => setStage('decrypt')}
          className="fixed bottom-8 right-8 z-40 px-6 py-3 bg-purple-600/80 hover:bg-purple-500 border-2 border-purple-400 rounded-lg backdrop-blur-sm transition-all duration-300 flex items-center gap-2 group"
        >
          <span className="text-white font-bold">SKIP</span>
          <SkipForward className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
        </motion.button>
      )}
    </div>
  );
}
