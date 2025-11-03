import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { SkipForward } from 'lucide-react';
import backgroundImage from 'figma:asset/d29f77190650e961978a364aad4c31b762a255ac.png';
import { CommandCenterAuthorization } from './CommandCenterAuthorization';


// Cinematic texts - moved outside component to prevent recreation
const cinematicTexts = [
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

// Cinematic Opening Component
function CinematicOpening({ onComplete }: { onComplete: () => void }) {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [showSkip, setShowSkip] = useState(false);

  // Auto advance text
  useEffect(() => {
    console.log('Cinematic useEffect triggered - currentTextIndex:', currentTextIndex, 'total texts:', cinematicTexts.length);
    
    if (currentTextIndex < cinematicTexts.length) {
      console.log('Setting timer for text:', cinematicTexts[currentTextIndex].text, 'duration:', cinematicTexts[currentTextIndex].duration);
      const timer = setTimeout(() => {
        console.log('Timer fired! Advancing from index', currentTextIndex, 'to', currentTextIndex + 1);
        setCurrentTextIndex(prev => {
          console.log('Previous index:', prev, 'New index:', prev + 1);
          return prev + 1;
        });
      }, cinematicTexts[currentTextIndex].duration);
      return () => {
        console.log('Cleaning up timer for index:', currentTextIndex);
        clearTimeout(timer);
      };
    } else {
      console.log('All texts shown, completing cinematic in 2 seconds');
      // Auto complete after all texts shown
      const finalTimer = setTimeout(() => {
        console.log('Calling onComplete');
        onComplete();
      }, 2000);
      return () => clearTimeout(finalTimer);
    }
  }, [currentTextIndex, onComplete]);

  // Show skip button after 3 seconds
  useEffect(() => {
    const skipTimer = setTimeout(() => {
      setShowSkip(true);
    }, 3000);
    return () => clearTimeout(skipTimer);
  }, []);

  // Manual advance function
  const handleAdvance = () => {
    console.log('Manual advance clicked, current index:', currentTextIndex);
    if (currentTextIndex < cinematicTexts.length - 1) {
      setCurrentTextIndex(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  return (
  // Added onClick here so clicking anywhere on the page advances the cinematic
 <div 
  className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden bg-gradient-radial"
  onClick={handleAdvance}
>
    {/* Cinematic Background */}
    <div className="absolute inset-0 bg-black/80" />
      
    {/* Floating Particles */}
    <div className="absolute inset-0">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-red-500/30 rounded-full"
          animate={{
            x: [Math.random() * window.innerWidth, Math.random() * window.innerWidth],
            y: [Math.random() * window.innerHeight, Math.random() * window.innerHeight],
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: Math.random() * 10 + 5,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{
            left: Math.random() * 100 + '%',
            top: Math.random() * 100 + '%'
          }}
        />
      ))}
    </div>

    {/* Main Cinematic Text */}
    <motion.div 
      className="relative z-10 text-center max-w-4xl px-6"
      key={currentTextIndex}
      initial={{ opacity: 0, y: 50, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 1.2 }}
      transition={{ duration: 1, ease: "easeOut" }}
    >
      {currentTextIndex < cinematicTexts.length && (
        <>
          <h1 
            className={cinematicTexts[currentTextIndex].style}
            style={{ fontFamily: 'JetBrains Mono, monospace' }}
          >
            {cinematicTexts[currentTextIndex].text}
          </h1>
          
          {/* Debug Info */}
          <div className="mt-4 text-xs text-gray-400"
               style={{ fontFamily: 'JetBrains Mono, monospace' }}>
            [{currentTextIndex + 1}/{cinematicTexts.length}] - Click anywhere to advance manually
          </div>
        </>
      )}
    </motion.div>


      {/* Progress Indicator */}
      <motion.div 
        className="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-64 h-1 bg-gray-800 rounded-full overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <motion.div
          className="h-full bg-gradient-to-r from-red-500 to-cyan-500 rounded-full"
          animate={{ 
            width: `${((currentTextIndex + 1) / cinematicTexts.length) * 100}%` 
          }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </motion.div>

      {/* Skip Button */}
      {showSkip && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={onComplete}
          className="fixed bottom-8 right-8 bg-red-600/20 hover:bg-red-600/40 border border-red-400/50 text-red-400 px-6 py-3 rounded-lg font-bold tracking-wider transition-all duration-300 backdrop-blur-sm"
          style={{ fontFamily: 'JetBrains Mono, monospace' }}
        >
          SKIP INTRO →
        </motion.button>
      )}

      {/* Terminal Style Footer */}
      <motion.div 
        className="absolute bottom-4 left-4 text-xs text-green-400/60 font-mono"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        [CLASSIFIED] MISSION BRIEFING SYSTEM v2.7.3
      </motion.div>
    </div>
  );
}

interface MissionBriefingPageProps {
  onViewDossiers?: () => void;
  onBeginDescent?: () => void;
  onBackToHUD?: () => void;
  isAuthorized: boolean;
  dossiersViewed?: boolean;
}

type BriefingStage = 'cinematic' | 'login' | 'briefing' | 'authorization';

const stageOrder: BriefingStage[] = ['cinematic', 'login', 'briefing', 'authorization'];

export function MissionBriefingPage({ onViewDossiers, onBeginDescent, onBackToHUD, isAuthorized, dossiersViewed = false }: MissionBriefingPageProps) {
  const [currentStage, setCurrentStage] = useState<BriefingStage>('cinematic');
  
  // Helper function to go to previous stage
  const goToPreviousStage = () => {
    const currentIndex = stageOrder.indexOf(currentStage);
    if (currentIndex > 0) {
      const previousStage = stageOrder[currentIndex - 1];
      setCurrentStage(previousStage);
    }
  };
  const [loginInput, setLoginInput] = useState('');
  const [loginAuthenticated, setLoginAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [stormTimer, setStormTimer] = useState(58 * 60 + 47); // 58:47 in seconds
  const [showRadioMessage, setShowRadioMessage] = useState(false);
  const [radioMessage, setRadioMessage] = useState('');
  
  // Command Center state
  const [missionCountdown, setMissionCountdown] = useState(180); // 3 minute countdown
  const [intelMessages, setIntelMessages] = useState<string[]>([]);
  const [towerRotation, setTowerRotation] = useState(0);

  // Handle authorization stage display
  useEffect(() => {
    if (isAuthorized) {
      setCurrentStage('authorization');
      setLoginAuthenticated(true);
    } else {
      // Only start from cinematic when not authorized AND not manually navigated to authorization
      // Allow manual navigation to authorization stage even when not fully authorized
      if (currentStage !== 'authorization') {
        setCurrentStage('cinematic');
      }
    }
  }, [isAuthorized]);

  // Mission countdown timer
  useEffect(() => {
    if (currentStage === 'authorization' && missionCountdown > 0) {
      const timer = setInterval(() => {
        setMissionCountdown(prev => Math.max(0, prev - 1));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [currentStage, missionCountdown]);

  // Intel feed messages
  useEffect(() => {
    if (currentStage === 'authorization') {
      const messages = [
        'SIGINT: No hostile activity detected in perimeter',
        'WEATHER: Storm conditions optimal for insertion',
        'COMMS: All channels encrypted and secure',
        'RECON: Tower defenses mapped - 87% coverage',
        'INTEL: Elena last seen Floor 2 - 18 hours ago',
        'STATUS: AI core located in ground floor vault',
        'ALERT: Automated defense systems active',
        'UPDATE: Elevator shaft clear for descent'
      ];
      
      let index = 0;
      const interval = setInterval(() => {
        setIntelMessages(prev => {
          const newMessages = [messages[index % messages.length], ...prev].slice(0, 8);
          index++;
          return newMessages;
        });
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [currentStage]);

  // Tower rotation animation
  useEffect(() => {
    if (currentStage === 'authorization') {
      const interval = setInterval(() => {
        setTowerRotation(prev => (prev + 0.5) % 360);
      }, 50);
      return () => clearInterval(interval);
    }
  }, [currentStage]);


  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setStormTimer(prev => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format timer
  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins + ':' + secs.toString().padStart(2, '0');
  };

  // Show radio messages
  const showRadio = (message: string) => {
    setRadioMessage(message);
    setShowRadioMessage(true);
    setTimeout(() => setShowRadioMessage(false), 6000);
  };

  // Handle login
  const handleLogin = () => {
    if (loginInput.toUpperCase() === 'CROSS') {
      setLoginAuthenticated(true);
      setLoginError('');
      showRadio("Cross, NAHRAN uses experimental systems. You need tactical preparation before insertion.");
      setTimeout(() => setCurrentStage('briefing'), 2000);
    } else {
      setLoginError('ACCESS DENIED - Invalid agent codename, Type "CROSS"');
      setLoginInput('');
    }
  };



  // Proceed to next stage - skip controls and go directly to authorization
  const proceedToControls = () => {
    showRadio("Mission briefing complete. Proceeding to final authorisation.");
    setTimeout(() => setCurrentStage('authorization'), 2000);
  };



  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background Image with proper blending */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: `url(${backgroundImage})`,
            filter: 'brightness(0.4) blur(2px)'
          }}
        />
        {/* Dark gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/90" />
        {/* Red tint overlay for theme consistency */}
        <div className="absolute inset-0 bg-red-950/20" />
      </div>

      {/* Radio Message Overlay */}
      {showRadioMessage && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.8 }}
          transition={{ duration: 0.5 }}
          className="fixed top-20 left-0 right-0 z-50 flex justify-center px-4"
        >
          <div className="bg-red-900/95 border-2 border-red-500 px-6 py-4 rounded-lg max-w-3xl shadow-2xl shadow-red-500/20">
            <div className="flex items-start gap-4">
              <div className="flex flex-col items-center">
                <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse mb-1" />
                <div className="text-red-400 text-xs tracking-widest" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                  LIVE
                </div>
              </div>
              <div className="flex-1">
                <div className="text-red-300 text-xs tracking-wide mb-1" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                  ARMY RADIO - SECURE CHANNEL
                </div>
                <div className="text-white text-sm md:text-base leading-relaxed" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                  "{radioMessage}"
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-8 py-12 bg-[rgb(0,0,0)]">
        
        {/* CINEMATIC OPENING */}
        {currentStage === 'cinematic' && (
          <CinematicOpening onComplete={() => setCurrentStage('login')} />
        )}
        
        {/* LOGIN STAGE */}
        {currentStage === 'login' && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-3xl"
          >
            {/* Main Title */}
            <motion.div 
              className="mb-16 text-center"
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="inline-block relative">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-wider leading-tight">
                  <span className="text-red-500 red-glow-title block drop-shadow-[0_0_30px_rgba(220,38,38,0.5)]">
                    OPERATION:
                  </span>
                  <span className="text-red-500 red-glow-title block mt-2 drop-shadow-[0_0_30px_rgba(220,38,38,0.5)]">
                    NAHRAN DESCENT
                  </span>
                </h1>
                <motion.div 
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent mt-6 rounded-full shadow-[0_0_20px_rgba(220,38,38,0.6)]" 
                />
              </div>
            </motion.div>
            
            {/* Mission Briefing Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              {/* Enhanced multi-layer glow effect */}
              <div className="absolute -inset-2 bg-gradient-to-r from-red-500/20 via-cyan-500/20 to-red-500/20 rounded-3xl blur-2xl opacity-60" />
              <div className="absolute -inset-1 bg-gradient-to-r from-red-500/30 via-cyan-500/30 to-red-500/30 rounded-2xl blur-xl" />
              
              {/* Main card with enhanced depth */}
              <div className="relative bg-gradient-to-b from-gray-900/98 via-gray-900/95 to-black/98 border-2 border-red-500/40 rounded-2xl backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_40px_rgba(220,38,38,0.15)]">
                {/* Inner shadow for depth */}
                <div className="absolute inset-0 rounded-2xl shadow-[inset_0_2px_20px_rgba(0,0,0,0.5)]" />
                
                <div className="relative p-8 sm:p-10 md:p-12">
                  {/* Header with enhanced styling */}
                  <div className="flex items-center gap-3 mb-10">
                    <div className="w-1 h-10 bg-gradient-to-b from-cyan-400 to-cyan-600 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.6)]" />
                    <h2 className="text-2xl sm:text-3xl text-cyan-400 tracking-wide drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                      MISSION BRIEFING
                    </h2>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-left mb-4 text-green-400 text-sm tracking-widest uppercase drop-shadow-[0_0_8px_rgba(74,222,128,0.4)]" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                        Agent Authentication
                      </label>
                      <div className="relative">
                        {/* Input field with enhanced depth */}
                        <input
                          type="password"
                          value={loginInput}
                          onChange={(e) => {
                            setLoginInput(e.target.value);
                            setLoginError('');
                          }}
                          onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                          className={
                            'w-full bg-black/80 border-2 px-5 py-4 rounded-xl focus:outline-none transition-all duration-300 backdrop-blur-sm shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] ' +
                            (loginError 
                              ? 'border-red-500/70 text-red-400 focus:border-red-400 focus:shadow-[0_0_30px_rgba(239,68,68,0.3),inset_0_2px_10px_rgba(0,0,0,0.5)]' 
                              : 'border-green-500/60 text-green-400 focus:border-green-400 focus:shadow-[0_0_30px_rgba(74,222,128,0.3),inset_0_2px_10px_rgba(0,0,0,0.5)]')
                          }
                          placeholder="Enter classified codename..."
                          style={{ fontFamily: 'JetBrains Mono, monospace' }}
                        />
                        {loginInput && (
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(74,222,128,0.8)]" />
                        )}
                      </div>
                      {loginError && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-2 text-xs text-red-400 mt-3 bg-red-950/50 border border-red-500/40 rounded-lg px-4 py-2.5 shadow-[0_4px_12px_rgba(239,68,68,0.2)] backdrop-blur-sm"
                          style={{ fontFamily: 'JetBrains Mono, monospace' }}
                        >
                          <span className="text-red-500 drop-shadow-[0_0_6px_rgba(239,68,68,0.8)]">⚠</span>
                          {loginError}
                        </motion.div>
                      )}
                      {!loginError && (
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-3" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                          <span className="text-cyan-400 drop-shadow-[0_0_6px_rgba(34,211,238,0.6)]">ℹ</span>
                          <span className="tracking-wider">HINT: Type "CROSS"</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Enhanced button with depth */}
                    <button
                      onClick={handleLogin}
                      disabled={!loginInput}
                      className="w-full bg-gradient-to-br from-green-600 via-green-500 to-green-600 hover:from-green-500 hover:via-green-400 hover:to-green-500 disabled:from-gray-800 disabled:via-gray-700 disabled:to-gray-800 text-white px-8 py-4 rounded-xl font-bold transition-all duration-300 shadow-[0_8px_24px_rgba(74,222,128,0.25)] hover:shadow-[0_12px_32px_rgba(74,222,128,0.4)] disabled:shadow-[0_4px_12px_rgba(0,0,0,0.3)] tracking-widest uppercase disabled:cursor-not-allowed border border-green-400/20 hover:border-green-400/40 disabled:border-gray-700/30"
                      style={{ fontFamily: 'JetBrains Mono, monospace' }}
                    >
                      <span className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
                        {loginInput ? 'Authenticate →' : 'Enter Codename'}
                      </span>
                    </button>
                  </div>
                </div>
                
                {/* Enhanced bottom accent with glow */}
                <div className="h-1.5 bg-gradient-to-r from-transparent via-red-500/70 to-transparent shadow-[0_0_15px_rgba(220,38,38,0.5)]" />
              </div>
            </motion.div>

            {/* Classification footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="mt-8 text-center"
            >
              <div className="text-xs text-gray-600 tracking-widest uppercase" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                Classified // Level 5 Clearance Required
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* BRIEFING STAGE */}
        {currentStage === 'briefing' && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-4xl px-4"
          >
            {/* Enhanced Back Button */}
            <motion.button
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              onClick={goToPreviousStage}
              className="fixed top-8 left-8 bg-black/90 hover:bg-gradient-to-r hover:from-red-600 hover:to-red-500 text-white px-6 py-3 rounded-xl font-bold tracking-wide transition-all duration-300 border-2 border-red-500/40 hover:border-red-500 backdrop-blur-md shadow-[0_8px_24px_rgba(0,0,0,0.4)] hover:shadow-[0_12px_32px_rgba(220,38,38,0.3)]"
              style={{ fontFamily: 'JetBrains Mono, monospace' }}
            >
              <span className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">← BACK</span>
            </motion.button>

            {/* Enhanced Title */}
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="text-center mb-16"
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-red-500 red-glow-title tracking-wider drop-shadow-[0_0_40px_rgba(220,38,38,0.6)]" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                MISSION PARAMETERS
              </h1>
              <motion.div 
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="h-1 w-32 bg-gradient-to-r from-transparent via-red-500 to-transparent mx-auto mt-6 rounded-full shadow-[0_0_20px_rgba(220,38,38,0.7)]" 
              />
            </motion.div>
            
            {/* Mission Objectives Card - Enhanced */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="mb-16 relative"
            >
              {/* Enhanced multi-layer glow */}
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/20 via-cyan-500/20 to-blue-500/20 rounded-3xl blur-2xl opacity-60" />
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/30 via-cyan-500/30 to-blue-500/30 rounded-2xl blur-xl" />
              
              {/* Main card with enhanced depth */}
              <div className="relative bg-gradient-to-b from-gray-900/98 via-gray-900/95 to-black/98 border-2 border-blue-500/40 rounded-2xl backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_40px_rgba(59,130,246,0.15)]">
                {/* Inner shadow */}
                <div className="absolute inset-0 rounded-2xl shadow-[inset_0_2px_20px_rgba(0,0,0,0.5)]" />
                
                <div className="relative p-8 sm:p-10">
                  <div className="flex items-center gap-3 mb-10">
                    <div className="w-1 h-10 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.6)]" />
                    <h3 className="text-2xl text-blue-400 tracking-wide drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                      PRIMARY OBJECTIVES
                    </h3>
                  </div>
                  
                  <div className="space-y-5">
                    {[
                      { icon: '01', text: 'Infiltrate NAHRAN-7 Tower', status: 'ACTIVE' },
                      { icon: '02', text: 'Extract AI Core', status: 'PENDING' },
                      { icon: '03', text: 'Escape (Find Elena)', status: 'PENDING' }
                    ].map((objective, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + index * 0.15, ease: [0.22, 1, 0.36, 1] }}
                        className="flex items-center gap-4 bg-black/60 border border-gray-700/60 rounded-xl p-5 hover:border-green-500/60 transition-all duration-300 group hover:bg-black/80 shadow-[0_4px_16px_rgba(0,0,0,0.3)] hover:shadow-[0_6px_24px_rgba(74,222,128,0.15)]"
                      >
                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-500/30 to-cyan-500/30 border-2 border-green-500/60 rounded-lg flex items-center justify-center font-bold text-green-400 group-hover:border-green-400 transition-all duration-300 shadow-[0_4px_12px_rgba(74,222,128,0.2)] group-hover:shadow-[0_6px_16px_rgba(74,222,128,0.3)]" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                          {objective.icon}
                        </div>
                        <span className="flex-1 text-gray-100" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                          {objective.text}
                        </span>
                        <span className={`text-xs px-3 py-1.5 rounded-full border-2 shadow-md ${index === 0 ? 'text-green-400 border-green-500/60 bg-green-950/40 shadow-[0_4px_12px_rgba(74,222,128,0.15)]' : 'text-gray-500 border-gray-700/60 bg-gray-900/40 shadow-[0_4px_12px_rgba(0,0,0,0.2)]'}`} style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                          {objective.status}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
                
                {/* Enhanced bottom accent */}
                <div className="h-1.5 bg-gradient-to-r from-transparent via-blue-500/70 to-transparent shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
              </div>
            </motion.div>

            {/* Enhanced Continue Button */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="text-center relative"
            >
              {/* Enhanced button glow layers */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-80 h-20 bg-blue-500/20 blur-3xl rounded-full" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-64 h-16 bg-cyan-500/30 blur-2xl rounded-full" />
              </div>
              
              <button
                onClick={proceedToControls}
                className="relative bg-gradient-to-br from-blue-600 via-cyan-600 to-blue-600 hover:from-blue-500 hover:via-cyan-500 hover:to-blue-500 text-white px-14 py-5 rounded-xl font-bold tracking-widest uppercase transition-all duration-300 shadow-[0_12px_36px_rgba(59,130,246,0.3)] hover:shadow-[0_16px_48px_rgba(59,130,246,0.5)] border-2 border-blue-400/40 hover:border-cyan-400/60"
                style={{ fontFamily: 'JetBrains Mono, monospace' }}
              >
                <span className="drop-shadow-[0_2px_6px_rgba(0,0,0,0.4)]">
                  Continue to Tactical Training →
                </span>
              </button>
            </motion.div>
          </motion.div>
        )}



        {/* OLD CONTROLS STAGE - COMMENTED OUT */}
        {false && currentStage === 'controls' && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-8xl w-full min-h-screen flex flex-col justify-center items-center py-16"
          >
            {/* Back Button */}
            <button
              onClick={goToPreviousStage}
              className="fixed top-8 left-8 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded font-bold tracking-wide transition-all duration-300 border border-red-500/50"
              style={{ fontFamily: 'JetBrains Mono, monospace' }}
            >
              ← Go Back
            </button>



            <h1 className="text-4xl md:text-6xl font-bold text-blue-500 mb-16 text-center blue-glow-title" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
              TACTICAL CONTROLS TRAINING
            </h1>

            <div className="flex flex-col lg:flex-row gap-12 w-full max-w-8xl px-8">
              {/* Left Side - Control Training */}
              <div className="flex-1 lg:w-1/2 space-y-8">
                <div className="bg-gray-900/90 border border-blue-500/50 p-8 rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl text-blue-400">PROGRESS</h3>
                    <span className="text-green-400 font-bold">
                      {completedCombos.length}/{controlMappings.length}
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(completedCombos.length / controlMappings.length) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Current Control */}
                {currentControlStep < controlMappings.length && (
                  <div className="bg-gray-900/90 border border-green-500/50 p-8 rounded-lg">
                    <h4 className="text-lg text-green-400 mb-2">
                      CURRENT: {controlMappings[currentControlStep].action}
                    </h4>
                    <p className="text-sm text-gray-300 mb-4">
                      {controlMappings[currentControlStep].description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {controlMappings[currentControlStep].keys.map((key, index) => (
                        <div key={index}>
                          <span 
                            className={`px-3 py-2 rounded border font-bold text-sm ${
                              (controlMappings[currentControlStep].action === 'Movement' 
                                ? movementKeysPressed.has(key.toUpperCase()) 
                                : pressedKeys.has(key.toUpperCase())) 
                                ? 'bg-green-600 border-green-400 text-white' 
                                : 'bg-gray-700 border-gray-500 text-gray-300'
                            }`}
                            style={{ fontFamily: 'JetBrains Mono, monospace' }}
                          >
                            {key}
                          </span>
                          {index < controlMappings[currentControlStep].keys.length - 1 && (
                            <span className="text-gray-400 mx-2">
                              {controlMappings[currentControlStep].action === 'Movement' ? '' : '+'}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                    {controlMappings[currentControlStep].action === 'Movement' && !completedCombos.includes('Movement') && (
                      <div className="text-yellow-400 text-sm font-bold">
                        Progress: {movementKeysPressed.size}/4 keys pressed
                      </div>
                    )}
                    {completedCombos.includes(controlMappings[currentControlStep].action) && (
                      <div className="text-green-400 text-sm font-bold">
                        ✓ LEARNED
                      </div>
                    )}
                  </div>
                )}

                {/* Completed Controls */}
                <div className="bg-gray-900/90 border border-gray-600/50 p-8 rounded-lg max-h-80 overflow-y-auto">
                  <h4 className="text-lg text-gray-400 mb-4">COMPLETED TRAINING:</h4>
                  <div className="space-y-2">
                    {controlMappings.map((control, index) => (
                      <div 
                        key={control.action}
                        className={`flex items-center gap-3 p-2 rounded ${
                          completedCombos.includes(control.action) 
                            ? 'bg-green-900/30 border border-green-500/30' 
                            : 'bg-gray-800/30'
                        }`}
                      >
                        <span className={completedCombos.includes(control.action) ? 'text-green-400' : 'text-gray-600'}>
                          {completedCombos.includes(control.action) ? '✓' : '○'}
                        </span>
                        <span className={`text-sm ${completedCombos.includes(control.action) ? 'text-white' : 'text-gray-500'}`}>
                          {control.action}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Side - Interactive Tactical Keyboard */}
              <div className="flex-1 lg:w-1/2">
                <div className="bg-gray-900/90 border border-cyan-500/50 p-8 rounded-lg">
                  <h3 className="text-2xl text-cyan-400 mb-8 text-center">TACTICAL INTERFACE KEYBOARD</h3>
                  
                  {/* Keyboard Layout */}
                  <div className="space-y-3" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                    {/* Number Row */}
                    <div className="flex justify-center gap-2">
                      {['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].map((key) => (
                        <div
                          key={key}
                          className={`w-8 h-8 border rounded text-xs flex items-center justify-center transition-all duration-200 ${
                            pressedKeys.has(key) 
                              ? 'bg-green-600 border-green-400 text-white shadow-lg shadow-green-500/50' 
                              : key === '0' 
                                ? 'bg-red-900/30 border-red-500/50 text-red-400 animate-pulse' 
                                : 'bg-gray-800 border-gray-600 text-gray-300'
                          }`}
                        >
                          {key}
                        </div>
                      ))}
                    </div>

                    {/* QWERTY Row */}
                    <div className="flex justify-center gap-2">
                      {['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'].map((key) => (
                        <div
                          key={key}
                          className={`w-10 h-10 border rounded text-sm flex items-center justify-center transition-all duration-200 ${
                            pressedKeys.has(key) || movementKeysPressed.has(key)
                              ? 'bg-green-600 border-green-400 text-white shadow-lg shadow-green-500/50' 
                              : ['W', 'E'].includes(key) 
                                ? 'bg-blue-900/30 border-blue-500/50 text-blue-400' 
                                : 'bg-gray-800 border-gray-600 text-gray-300'
                          }`}
                        >
                          {key}
                        </div>
                      ))}
                    </div>

                    {/* ASDF Row */}
                    <div className="flex justify-center gap-2">
                      {['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'].map((key) => (
                        <div
                          key={key}
                          className={`w-10 h-10 border rounded text-sm flex items-center justify-center transition-all duration-200 ${
                            pressedKeys.has(key) || movementKeysPressed.has(key)
                              ? 'bg-green-600 border-green-400 text-white shadow-lg shadow-green-500/50' 
                              : ['A', 'S', 'D'].includes(key) 
                                ? 'bg-blue-900/30 border-blue-500/50 text-blue-400' 
                                : 'bg-gray-800 border-gray-600 text-gray-300'
                          }`}
                        >
                          {key}
                        </div>
                      ))}
                    </div>

                    {/* ZXCV Row */}
                    <div className="flex justify-center gap-2">
                      {['Z', 'X', 'C', 'V', 'B', 'N', 'M'].map((key) => (
                        <div
                          key={key}
                          className={`w-10 h-10 border rounded text-sm flex items-center justify-center transition-all duration-200 ${
                            pressedKeys.has(key) || movementKeysPressed.has(key)
                              ? 'bg-green-600 border-green-400 text-white shadow-lg shadow-green-500/50' 
                              : 'bg-gray-800 border-gray-600 text-gray-300'
                          }`}
                        >
                          {key}
                        </div>
                      ))}
                    </div>

                    {/* Special Keys Row */}
                    <div className="flex justify-center gap-3 mt-6">
                      <div
                        className={`px-3 py-2 border rounded text-xs font-bold transition-all duration-200 ${
                          pressedKeys.has('SHIFT') 
                            ? 'bg-green-600 border-green-400 text-white shadow-lg shadow-green-500/50' 
                            : 'bg-yellow-900/30 border-yellow-500/50 text-yellow-400'
                        }`}
                      >
                        SHIFT
                      </div>
                      <div
                        className={`px-4 py-2 border rounded text-xs font-bold transition-all duration-200 ${
                          pressedKeys.has(' ') || pressedKeys.has('SPACE')
                            ? 'bg-green-600 border-green-400 text-white shadow-lg shadow-green-500/50' 
                            : 'bg-cyan-900/30 border-cyan-500/50 text-cyan-400'
                        }`}
                      >
                        SPACE
                      </div>
                      <div
                        className={`px-3 py-2 border rounded text-xs font-bold transition-all duration-200 ${
                          pressedKeys.has('TAB') 
                            ? 'bg-green-600 border-green-400 text-white shadow-lg shadow-green-500/50' 
                            : 'bg-purple-900/30 border-purple-500/50 text-purple-400'
                        }`}
                      >
                        TAB
                      </div>
                      <div
                        className={`px-3 py-2 border rounded text-xs font-bold transition-all duration-200 ${
                          pressedKeys.has('R') 
                            ? 'bg-green-600 border-green-400 text-white shadow-lg shadow-green-500/50' 
                            : 'bg-orange-900/30 border-orange-500/50 text-orange-400'
                        }`}
                      >
                        R
                      </div>
                      <div
                        className={`px-3 py-2 border rounded text-xs font-bold transition-all duration-200 ${
                          pressedKeys.has('ESCAPE') 
                            ? 'bg-green-600 border-green-400 text-white shadow-lg shadow-green-500/50' 
                            : 'bg-red-900/30 border-red-500/50 text-red-400'
                        }`}
                      >
                        ESC
                      </div>
                    </div>

                    {/* Special Stealth Mode Indicator */}
                    <div className="mt-8 bg-black/60 border border-red-500/30 rounded p-6">
                      <div className="text-red-400 text-xs font-bold mb-2 text-center">⚠ CLASSIFIED PROTOCOL ⚠</div>
                      <div className="flex items-center justify-center gap-2">
                        <div
                          className={`px-4 py-2 border-2 rounded font-bold text-sm transition-all duration-200 ${
                            pressedKeys.has('0') 
                              ? 'bg-red-600 border-red-400 text-white shadow-lg shadow-red-500/50 animate-pulse' 
                              : 'bg-red-900/50 border-red-500/70 text-red-300 animate-pulse'
                          }`}
                        >
                          0
                        </div>
                        <span className="text-red-300 text-sm">STEALTH MODE</span>
                      </div>
                      <div className="text-red-400/70 text-xs text-center mt-2">
                        EMERGENCY ACTIVATION PROTOCOL
                      </div>
                    </div>
                  </div>


                </div>
              </div>
            </div>

            {/* Action Buttons - Positioned at bottom center */}
            <div className="w-full flex justify-center items-center gap-6 mt-16">
              {/* Skip Training Button - Only visible when training incomplete */}
              {completedCombos.length < controlMappings.length && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onClick={() => {
                    // Complete all training and set to learned
                    setCompletedCombos(controlMappings.map(ctrl => ctrl.action));
                    setMovementKeysPressed(new Set());
                    // Show completion message but DON'T proceed to next stage
                    showRadio("Cross, you'll learn in the field. All protocols marked as learned.");
                  }}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white px-8 py-4 rounded-lg font-bold text-lg tracking-wide transition-all duration-300 border border-yellow-500/50"
                  style={{ fontFamily: 'JetBrains Mono, monospace' }}
                >
                  SKIP TRAINING
                </motion.button>
              )}
              
              {/* Proceed to HUD Analysis Button - Only shown when training complete */}
              {completedCombos.length === controlMappings.length && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onClick={proceedToHUD}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg font-bold text-lg tracking-wide transition-all duration-300"
                  style={{ fontFamily: 'JetBrains Mono, monospace' }}
                >
                  PROCEED TO HUD ANALYSIS
                </motion.button>
              )}
            </div>
          </motion.div>
        )}

        {/* AUTHORIZATION COMPLETE - COMMAND CENTER */}
        {currentStage === 'authorization' && (
          <CommandCenterAuthorization
            dossiersViewed={dossiersViewed}
            onViewDossiers={onViewDossiers}
            onBeginDescent={onBeginDescent}
          />
        )}
      </div>

      {/* Skip Button - Navigate between stages */}
      {currentStage === 'login' && (
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          onClick={() => setCurrentStage('briefing')}
          className="fixed bottom-8 right-8 z-40 px-6 py-3 bg-red-600/80 hover:bg-red-500 border-2 border-red-400 rounded-lg backdrop-blur-sm transition-all duration-300 flex items-center gap-2 group"
        >
          <span className="text-white font-bold">SKIP</span>
          <SkipForward className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
        </motion.button>
      )}
      {currentStage === 'briefing' && (
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          onClick={() => setCurrentStage('authorization')}
          className="fixed bottom-8 right-8 z-40 px-6 py-3 bg-red-600/80 hover:bg-red-500 border-2 border-red-400 rounded-lg backdrop-blur-sm transition-all duration-300 flex items-center gap-2 group"
        >
          <span className="text-white font-bold">SKIP</span>
          <SkipForward className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
        </motion.button>
      )}
    </div>
  );
}