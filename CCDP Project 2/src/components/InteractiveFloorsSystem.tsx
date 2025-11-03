import { useState, useEffect, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GameHUD } from './GameHUD';
import { BriefCutscene } from './BriefCutscene';
import { RadioMessageQueue } from './RadioMessage';
import { getFloorMessages, commanderMessages } from '../data/commanderMessages';
import { ElevatorTransition } from './ElevatorTransition';
import { Loader2 } from 'lucide-react';

// Lazy load floor components for better performance
const Floor7DataRoom = lazy(() => import('./games/Floor7DataRoom').then(m => ({ default: m.Floor7DataRoom })));
const Floor6Medbay = lazy(() => import('./games/Floor6Medbay').then(m => ({ default: m.Floor6Medbay })));
const Floor5Kitchen = lazy(() => import('./games/Floor5Kitchen').then(m => ({ default: m.Floor5Kitchen })));
const Floor4Accounting = lazy(() => import('./games/Floor4Accounting').then(m => ({ default: m.Floor4Accounting })));
const Floor3PrintingRoom = lazy(() => import('./games/Floor3PrintingRoom').then(m => ({ default: m.Floor3PrintingRoom })));
const Floor2SleepingPods = lazy(() => import('./games/Floor2SleepingPods').then(m => ({ default: m.Floor2SleepingPods })));
const Floor1Ballroom = lazy(() => import('./games/Floor1Ballroom').then(m => ({ default: m.Floor1Ballroom })));
const BasementEscape = lazy(() => import('./games/BasementEscape').then(m => ({ default: m.BasementEscape })));

interface InteractiveFloorsSystemProps {
  onComplete: (achievements: string[]) => void;
  onExit: () => void;
  initialPauseTutorialSeen?: boolean;
  onPauseTutorialDismissed?: () => void;
  onStatsUpdate?: (stats: { health: number; corruption: number; currentFloor: number; logsCollected: number }) => void;
  externalIsPaused?: boolean;
  onPauseChange?: (isPaused: boolean) => void;
}

const floorData = {
  7: { name: 'DATA ROOM', subtitle: 'FIREWALL BREACH PROTOCOL', color: 'cyan', threat: 'LOW' },
  6: { name: 'MEDBAY', subtitle: 'MEDICAL RECOVERY', color: 'blue', threat: 'MEDIUM' },
  5: { name: 'KITCHEN', subtitle: 'GAS LINE SHUTDOWN', color: 'orange', threat: 'MEDIUM' },
  4: { name: 'ACCOUNTING', subtitle: 'INFILTRATOR DETECTED', color: 'purple', threat: 'HIGH' },
  3: { name: 'PRINTING ROOM', subtitle: 'SYSTEM OVERLOAD', color: 'indigo', threat: 'HIGH' },
  2: { name: 'SLEEPING PODS', subtitle: 'MEMORY ACCESS', color: 'pink', threat: 'CRITICAL' },
  1: { name: 'BALLROOM', subtitle: 'TITAN ENCOUNTER', color: 'red', threat: 'EXTREME' },
  0: { name: 'GROUND FLOOR (EXIT)', subtitle: 'FINAL OVERRIDE', color: 'white', threat: 'FINAL' }
};

export function InteractiveFloorsSystem({ onComplete, onExit, initialPauseTutorialSeen = false, onPauseTutorialDismissed, onStatsUpdate, externalIsPaused, onPauseChange }: InteractiveFloorsSystemProps) {
  const [currentFloor, setCurrentFloor] = useState(7);
  const [health, setHealth] = useState(100);
  const [corruption, setCorruption] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showFloorIntro, setShowFloorIntro] = useState(true);
  const [showCutscene, setShowCutscene] = useState(false);
  const [cutsceneLines, setCutsceneLines] = useState<string[]>([]);
  const [cutsceneColor, setCutsceneColor] = useState<'cyan' | 'red' | 'green' | 'yellow'>('cyan');
  const [radioMessages, setRadioMessages] = useState<any[]>([]);
  const [showRadio, setShowRadio] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [missionIntroComplete, setMissionIntroComplete] = useState(false);
  const [isShowingCompletionMessages, setIsShowingCompletionMessages] = useState(false);
  const [collectedLogs, setCollectedLogs] = useState<string[]>([]);
  const [previousFloor, setPreviousFloor] = useState(7);
  const [showFloorFailure, setShowFloorFailure] = useState(false);
  const [restartingFloor, setRestartingFloor] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([]);
  const [floorStartTime, setFloorStartTime] = useState<number>(Date.now());
  const [initialHealth] = useState(100);
  const [showPauseTutorial, setShowPauseTutorial] = useState(!initialPauseTutorialSeen);
  const [entryMessagesShownForFloor, setEntryMessagesShownForFloor] = useState<number | null>(null);
  const maxHealth = 100;

  // Mark game as started without showing messages - messages only appear in Data Room
  useEffect(() => {
    if (!gameStarted) {
      setGameStarted(true);
      setMissionIntroComplete(true); // Skip intro wait, allow F7 messages immediately
    }
  }, [gameStarted]);

  // Keyboard controls for pause
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        // If tutorial is showing, dismiss it instead of pausing
        if (showPauseTutorial) {
          setShowPauseTutorial(false);
        } else {
          setIsPaused(prev => !prev);
        }
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [showPauseTutorial]);

  // Reset floor timer when floor changes
  useEffect(() => {
    setFloorStartTime(Date.now());
  }, [currentFloor]);

  // Send stats updates to parent
  useEffect(() => {
    if (onStatsUpdate) {
      onStatsUpdate({
        health,
        corruption,
        currentFloor,
        logsCollected: collectedLogs.length
      });
    }
  }, [health, corruption, currentFloor, collectedLogs.length, onStatsUpdate]);

  // Sync external pause state
  useEffect(() => {
    if (externalIsPaused !== undefined && !showPauseTutorial) {
      setIsPaused(externalIsPaused);
    }
  }, [externalIsPaused, showPauseTutorial]);

  // Notify parent of pause changes
  useEffect(() => {
    if (onPauseChange && !showPauseTutorial) {
      onPauseChange(isPaused);
    }
  }, [isPaused, onPauseChange, showPauseTutorial]);

  // Floor intro on mount and floor change
  useEffect(() => {
    // CRITICAL FIX: Don't run if we're transitioning or showing cutscene
    if (isTransitioning || showCutscene) return;
    
    // Only show floor intro if mission intro is complete (prevents showing on initial F7)
    if (!missionIntroComplete) return;
    
    // Reset entry message tracking when floor changes
    setEntryMessagesShownForFloor(null);
    
    setShowFloorIntro(true);
    const timer = setTimeout(() => {
      setShowFloorIntro(false);
      
      // Optimized: Reduced breathing room for faster pacing
      setTimeout(() => {
        // CRITICAL FIX: Only show entry messages if:
        // 1. We haven't shown them for this floor yet
        // 2. We're NOT showing completion messages
        // 3. Radio is not already showing
        // 4. NOT showing Point of No Return (F4 special message)
        // 5. NOT currently on Floor 4 (has special Commander Grey message instead)
        // 6. NOT currently transitioning
        // 7. NOT showing a cutscene
        if (
          entryMessagesShownForFloor !== currentFloor &&
          !isShowingCompletionMessages && 
          !showRadio && 
          !isTransitioning && // Don't show if transitioning
          !showCutscene // Don't show if cutscene is playing
        ) {
          // Show entry messages for all floors (small, concise briefings)
          const entryMessages = getFloorMessages(currentFloor, 'entry');
          if (entryMessages.length > 0) {
            // Mark that we've shown messages for this floor
            setEntryMessagesShownForFloor(currentFloor);
            
            // Use only the FIRST message for each floor to keep it concise
            // Use normal popup mode for entry messages so they don't block gameplay
            const popupMessages = [entryMessages[0]].map(msg => ({
              ...msg,
              cinematic: false, // Override to use corner popup mode
              showAvatar: true,
              duration: 4000, // Optimized: Reduced from 5000ms to 4000ms
              requireButtonClick: !msg.speaker.includes('COMMANDER GREY') // Non-Commander messages require button click
            }));
            setRadioMessages(popupMessages);
            setShowRadio(true);
          }
        }
      }, 400); // Optimized: Reduced from 800ms to 400ms
    }, 2500); // Optimized: Reduced from 4000ms to 2500ms
    return () => clearTimeout(timer);
  }, [currentFloor, missionIntroComplete]); // Only depend on floor changes and mission start

  const getCutsceneForFloor = (floor: number): { lines: string[], color: 'cyan' | 'red' | 'green' | 'yellow' } | null => {
    switch (floor) {
      // REMOVED F6 cutscene - redundant with F7 completion + F6 entry messages
      // REMOVED F5 cutscene - redundant with F6 completion + F5 entry messages
      
      case 4:
        // REMOVED F4 cutscene - redundant Point of No Return cutscene
        return null;
      case 3:
        // REMOVED F3 cutscene - redundant with F4 completion + F3 entry messages
        return null;
      case 2:
        // REMOVED F2 cutscene - too much content between F3→F2 (completion msg + cutscene + elevator + intro + entry msg)
        // F2 entry message already provides dramatic reveal ("this floor isn't on any blueprints")
        return null;
      case 1:
        return null; // Skip cutscene, go straight to elevator descent - boss intro messages handle the dramatic tension
      case 0:
        return null; // Skip cutscene, go straight to elevator descent
      default:
        return null;
    }
  };

  const handleFloorComplete = () => {
    // Check for Speed Demon achievement (complete floor in under 10 seconds)
    const floorTime = (Date.now() - floorStartTime) / 1000;
    if (floorTime < 10 && !unlockedAchievements.includes('speed_demon')) {
      setUnlockedAchievements(prev => [...prev, 'speed_demon']);
    }

    // SPECIAL CASE: Floor 0 (Basement/Ground Floor) - Skip completion messages and go straight to epilogue
    if (currentFloor === 0) {
      // Calculate final achievements
      const corruptionIncrease = 12.5;
      const newCorruption = Math.min(100, corruption + corruptionIncrease);
      const finalAchievements = [...unlockedAchievements];
      
      // Tactical Veteran - Complete the mission (always awarded)
      if (!finalAchievements.includes('tactical_veteran')) {
        finalAchievements.push('tactical_veteran');
      }
      
      // Perfectionist - No health lost
      if (health === initialHealth && !finalAchievements.includes('perfectionist')) {
        finalAchievements.push('perfectionist');
      }
      
      // Archivist - All logs collected
      if (collectedLogs.length === 9 && !finalAchievements.includes('archivist')) {
        finalAchievements.push('archivist');
      }
      
      // Trigger epilogue immediately
      onComplete(finalAchievements);
      return;
    }

    // CRITICAL FIX: Clear any existing messages AND flags before showing completion
    setShowRadio(false);
    setRadioMessages([]);
    setEntryMessagesShownForFloor(null); // Reset entry message tracking
    
    // Show completion messages first - USE POPUP MODE (less intrusive)
    const completeMessages = getFloorMessages(currentFloor, 'complete');
    if (completeMessages.length > 0) {
      // Use popup mode for completion messages so they don't completely block the view
      const popupMessages = completeMessages.map(msg => ({
        ...msg,
        cinematic: false, // Use corner popup mode
        showAvatar: true,
        duration: 5000, // Shorter duration for better pacing
        autoDismissOnInteraction: false, // CRITICAL: Prevent accidental dismissal during floor completion
        requireButtonClick: !msg.speaker.includes('COMMANDER GREY') // Non-Commander messages require button click
      }));
      setRadioMessages(popupMessages);
      setShowRadio(true);
      setIsShowingCompletionMessages(true); // Flag that these are completion messages
    } else {
      // No messages, proceed immediately
      proceedToNextFloor();
    }
  };

  const proceedToNextFloor = () => {
    // Increase corruption for each floor completed
    const corruptionIncrease = 12.5; // 8 floors = 100% corruption
    const newCorruption = Math.min(100, corruption + corruptionIncrease);
    setCorruption(newCorruption);

    // Transition to next floor
    if (currentFloor === 0) {
      // Ground floor complete - mission done!
      // Check final achievements
      const finalAchievements = [...unlockedAchievements];
      
      // Tactical Veteran - Complete the mission (always awarded)
      if (!finalAchievements.includes('tactical_veteran')) {
        finalAchievements.push('tactical_veteran');
      }
      
      // Perfectionist - No health lost
      if (health === initialHealth && !finalAchievements.includes('perfectionist')) {
        finalAchievements.push('perfectionist');
      }
      
      // Archivist - All logs collected
      if (collectedLogs.length === 9 && !finalAchievements.includes('archivist')) {
        finalAchievements.push('archivist');
      }
      
      onComplete(finalAchievements);
      return;
    }

    // Show cutscene before transitioning
    const nextFloor = currentFloor - 1;
    const cutscene = getCutsceneForFloor(nextFloor);
    
    if (cutscene) {
      setCutsceneLines(cutscene.lines);
      setCutsceneColor(cutscene.color);
      setShowCutscene(true);
    } else {
      startTransition();
    }
  };

  const handleCutsceneComplete = () => {
    setShowCutscene(false);
    startTransition();
  };

  const startTransition = () => {
    setIsTransitioning(true);
    setPreviousFloor(currentFloor);
  };

  const handleElevatorComplete = () => {
    const nextFloor = currentFloor - 1;
    setCurrentFloor(nextFloor);
    setIsTransitioning(false);
  };



  const handleCollectLog = (logId: string) => {
    setCollectedLogs(prev => {
      // FIXED: Prevent duplicate collection - only add if not already collected
      if (prev.includes(logId)) {
        return prev; // Already collected, don't add again
      }
      const newLogs = [...prev, logId];
      // Check for Archivist achievement
      if (newLogs.length === 9 && !unlockedAchievements.includes('archivist')) {
        setUnlockedAchievements(achievementsPrev => [...achievementsPrev, 'archivist']);
      }
      return newLogs;
    });
  };

  const handleFloorFail = () => {
    // Special handling for Floor 5 (Kitchen) - just restart the floor
    if (currentFloor === 5) {
      setShowFloorFailure(true);
      setTimeout(() => {
        setShowFloorFailure(false);
        setRestartingFloor(true);
        // Restart the floor by resetting the floor intro
        setShowFloorIntro(true);
        setTimeout(() => {
          setShowFloorIntro(false);
          setRestartingFloor(false);
        }, 4000);
      }, 2500);
      return;
    }

    // Normal failure handling for other floors
    // Reduce health on failure
    setHealth(prev => {
      const newHealth = Math.max(0, prev - 10);
      if (newHealth === 0) {
        // Game over
        setTimeout(() => {
          onExit();
        }, 3000);
      } else if (newHealth <= 30) {
        // Show low health warning - USE POPUP MODE (not cinematic)
        const warningMessage = {
          ...commanderMessages.warnings.lowHealth,
          cinematic: false,
          showAvatar: true
        };
        setRadioMessages([warningMessage]);
        setShowRadio(true);
      }
      return newHealth;
    });
  };

  // DISABLED: Health and corruption warnings removed to prevent loops
  // These warnings were causing feedback loops and aren't critical to gameplay
  // Players can see their health/corruption on the HUD
  
  // useEffect(() => {
  //   if (health <= 30 && health > 0) {
  //     const timer = setTimeout(() => {
  //       const warningMessage = {
  //         ...commanderMessages.warnings.lowHealth,
  //         cinematic: false,
  //         showAvatar: true
  //       };
  //       setRadioMessages([warningMessage]);
  //       setShowRadio(true);
  //     }, 1000);
  //     return () => clearTimeout(timer);
  //   }
  // }, [health]);

  // useEffect(() => {
  //   if (corruption >= 70) {
  //     const timer = setTimeout(() => {
  //       const warningMessage = {
  //         ...commanderMessages.warnings.highCorruption,
  //         cinematic: false,
  //         showAvatar: true
  //       };
  //       setRadioMessages([warningMessage]);
  //       setShowRadio(true);
  //     }, 1000);
  //     return () => clearTimeout(timer);
  //   }
  // }, [corruption]);

  const handleHealthIncrease = (amount: number = 10) => {
    // Increase health (for consuming safe food, healing, etc.)
    setHealth(prev => Math.min(maxHealth, prev + amount));
  };

  // Loading fallback component
  const LoadingFallback = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md">
      <div className="text-center space-y-6">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        >
          <Loader2 className="w-16 h-16 text-cyan-400" />
        </motion.div>
        <div className="text-cyan-400 tracking-widest text-lg">
          LOADING FLOOR DATA...
        </div>
        <div className="flex gap-1 justify-center">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="w-2 h-8 bg-cyan-400 rounded-full"
              style={{ willChange: 'height' }}
              animate={{
                height: [8, Math.random() * 30 + 10, 8],
              }}
              transition={{
                duration: 0.5,
                repeat: Infinity,
                delay: i * 0.1,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );

  const renderCurrentFloor = () => {
    switch (currentFloor) {
      case 7:
        return <Floor7DataRoom onComplete={handleFloorComplete} onFail={handleFloorFail} onCollectLog={handleCollectLog} collectedLogs={collectedLogs} />;
      case 6:
        return <Floor6Medbay onComplete={handleFloorComplete} onFail={handleFloorFail} onHealthIncrease={handleHealthIncrease} onCollectLog={handleCollectLog} collectedLogs={collectedLogs} />;
      case 5:
        return <Floor5Kitchen onComplete={handleFloorComplete} onFail={handleFloorFail} onCollectLog={handleCollectLog} collectedLogs={collectedLogs} />;
      case 4:
        return <Floor4Accounting onComplete={handleFloorComplete} onFail={handleFloorFail} onCollectLog={handleCollectLog} collectedLogs={collectedLogs} />;
      case 3:
        return <Floor3PrintingRoom onComplete={handleFloorComplete} onFail={handleFloorFail} onCollectLog={handleCollectLog} collectedLogs={collectedLogs} />;
      case 2:
        return <Floor2SleepingPods onComplete={handleFloorComplete} onFail={handleFloorFail} onCollectLog={handleCollectLog} collectedLogs={collectedLogs} />;
      case 1:
        return <Floor1Ballroom onComplete={handleFloorComplete} onFail={handleFloorFail} onCollectLog={handleCollectLog} collectedLogs={collectedLogs} />;
      case 0:
        return <BasementEscape onComplete={handleFloorComplete} onFail={handleFloorFail} onCollectLog={handleCollectLog} collectedLogs={collectedLogs} />;
      default:
        return null;
    }
  };

  const currentFloorData = floorData[currentFloor as keyof typeof floorData];

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      {/* Atmospheric Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Scanlines */}
        <div className="absolute inset-0 opacity-10">
          <div className="scan-line"></div>
        </div>
        
        {/* Tech Grid */}
        <div className="absolute inset-0 tech-grid opacity-5"></div>

        {/* Vignette */}
        <div className="absolute inset-0 bg-gradient-radial"></div>

        {/* Corruption Visual Effect */}
        {corruption > 0 && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-b from-red-900/0 via-transparent to-red-900/0"
            style={{ willChange: 'opacity' }}
            animate={{
              opacity: corruption / 200
            }}
          />
        )}
      </div>

      {/* Game HUD - Always visible */}
      <GameHUD 
        health={health}
        maxHealth={maxHealth}
        corruption={corruption}
        currentFloor={currentFloor}
        logsCollected={collectedLogs.length}
        totalLogs={9}
      />

      {/* Pause elements now handled by App.tsx globally */}

      {/* Floor Intro Overlay */}
      <AnimatePresence>
        {showFloorIntro && !isTransitioning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ willChange: 'opacity' }}
            className="fixed inset-0 z-40 flex items-center justify-center bg-black/90 backdrop-blur-sm pointer-events-none"
          >
            <div className="text-center space-y-8">
              {/* Floor Number with Cinematic Effect - Optimized */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0, y: 30 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                style={{ willChange: 'transform, opacity' }}
              >
                <div className="text-8xl md:text-9xl font-bold text-white mb-4" style={{
                  textShadow: `0 0 30px ${currentFloorData?.color === 'cyan' ? '#06b6d4' : 
                    currentFloorData?.color === 'green' ? '#22c55e' :
                    currentFloorData?.color === 'orange' ? '#f97316' :
                    currentFloorData?.color === 'purple' ? '#a855f7' :
                    currentFloorData?.color === 'indigo' ? '#6366f1' :
                    currentFloorData?.color === 'pink' ? '#ec4899' :
                    currentFloorData?.color === 'red' ? '#dc2626' : '#ffffff'}`
                }}>
                  {currentFloor === 0 ? 'F0' : `F${currentFloor}`}
                </div>
              </motion.div>

              {/* Floor Name - Optimized */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.3 }}
                style={{ willChange: 'transform, opacity' }}
                className="space-y-3"
              >
                <div className={`text-4xl md:text-5xl font-bold tracking-wider ${
                  currentFloorData?.color === 'cyan' ? 'text-cyan-400' :
                  currentFloorData?.color === 'green' ? 'text-green-400' :
                  currentFloorData?.color === 'orange' ? 'text-orange-400' :
                  currentFloorData?.color === 'purple' ? 'text-purple-400' :
                  currentFloorData?.color === 'indigo' ? 'text-indigo-400' :
                  currentFloorData?.color === 'pink' ? 'text-pink-400' :
                  currentFloorData?.color === 'red' ? 'text-red-400' : 'text-white'
                }`}>
                  {currentFloorData?.name}
                </div>
                <div className="text-xl md:text-2xl text-gray-400 tracking-widest">
                  {currentFloorData?.subtitle}
                </div>
              </motion.div>

              {/* Threat Level */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.4 }}
                style={{ willChange: 'transform, opacity' }}
                className="inline-flex items-center gap-3 px-6 py-3 rounded-full border-2 bg-black/50 backdrop-blur-sm"
                style={{
                  borderColor: currentFloorData?.threat === 'FINAL' ? '#ffffff' :
                    currentFloorData?.threat === 'EXTREME' ? '#dc2626' :
                    currentFloorData?.threat === 'CRITICAL' ? '#f97316' :
                    currentFloorData?.threat === 'HIGH' ? '#f59e0b' :
                    currentFloorData?.threat === 'MEDIUM' ? '#eab308' : '#22c55e'
                }}
              >
                <div className="w-3 h-3 rounded-full animate-pulse" style={{
                  backgroundColor: currentFloorData?.threat === 'FINAL' ? '#ffffff' :
                    currentFloorData?.threat === 'EXTREME' ? '#dc2626' :
                    currentFloorData?.threat === 'CRITICAL' ? '#f97316' :
                    currentFloorData?.threat === 'HIGH' ? '#f59e0b' :
                    currentFloorData?.threat === 'MEDIUM' ? '#eab308' : '#22c55e'
                }}></div>
                <span className="text-sm font-bold tracking-wider text-white">
                  THREAT LEVEL: {currentFloorData?.threat}
                </span>
              </motion.div>

              {/* Scanning Animation */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ delay: 0.9, duration: 2, repeat: Infinity }}
                style={{ willChange: 'opacity' }}
                className="text-cyan-400 text-sm tracking-widest"
              >
                /// SCANNING ENVIRONMENT ///
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floor Content - Optimized transition */}
      <AnimatePresence mode="wait">
        {!isTransitioning && !showFloorIntro && !showFloorFailure && (
          <motion.div
            key={`${currentFloor}-${restartingFloor ? 'restart' : 'normal'}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ willChange: 'opacity' }}
          >
            <Suspense fallback={<LoadingFallback />}>
              {renderCurrentFloor()}
            </Suspense>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Data Log Collector - REMOVED: Using AR Scanner collectibles instead */}

      {/* Elevator Transition */}
      <AnimatePresence>
        {isTransitioning && (
          <ElevatorTransition
            fromFloor={previousFloor}
            toFloor={currentFloor - 1}
            onComplete={handleElevatorComplete}
          />
        )}
      </AnimatePresence>



      {/* Cutscene Overlay */}
      <AnimatePresence>
        {showCutscene && (
          <BriefCutscene 
            lines={cutsceneLines}
            color={cutsceneColor}
            onComplete={handleCutsceneComplete}
          />
        )}
      </AnimatePresence>



      {/* Radio Messages */}
      {showRadio && radioMessages.length > 0 && (
        <RadioMessageQueue 
          messages={radioMessages}
          onComplete={() => {
            console.log('RadioMessageQueue completed, isShowingCompletionMessages:', isShowingCompletionMessages);
            
            // CRITICAL FIX: Store flags before clearing to prevent race conditions
            const wasShowingCompletion = isShowingCompletionMessages;
            const wasMissionIntro = !missionIntroComplete && currentFloor === 7;
            
            // Clear all message-related state immediately
            setShowRadio(false);
            setRadioMessages([]);
            
            // Handle completion messages flow
            if (wasShowingCompletion) {
              setIsShowingCompletionMessages(false);
              // Balanced wait for smooth pacing (800ms gives breathing room between completion and transition)
              setTimeout(() => {
                console.log('Proceeding to next floor from:', currentFloor);
                proceedToNextFloor();
              }, 800);
            }
            
            // After mission start messages complete, mark as complete
            // The floor intro useEffect will handle showing entry messages
            if (wasMissionIntro) {
              setMissionIntroComplete(true);
            }
          }}
        />
      )}

      {/* Floor Failure Screen (for Floor 5 restart) */}
      <AnimatePresence>
        {showFloorFailure && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50"
          >
            {/* Orange flash for kitchen */}
            <motion.div
              className="absolute inset-0 bg-orange-600"
              animate={{
                opacity: [0, 0.4, 0]
              }}
              transition={{ duration: 0.5, times: [0, 0.3, 1] }}
            />
            
            {/* Main content */}
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-orange-900/60 via-black/90 to-black backdrop-blur-md">
              <div className="text-center space-y-6">
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4, type: 'spring' }}
                  className="text-7xl font-bold text-orange-400"
                  style={{
                    textShadow: '0 0 30px rgba(249, 115, 22, 0.8)'
                  }}
                >
                  GAS LEAK CRITICAL
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="space-y-3"
                >
                  <p className="text-orange-300 text-2xl">Emergency containment failed</p>
                  <p className="text-white text-xl opacity-70">Resetting floor systems...</p>
                </motion.div>

                {/* Restarting indicator */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ delay: 1, duration: 1.5, repeat: Infinity }}
                  className="text-cyan-400 text-sm tracking-widest"
                >
                  RESTARTING FLOOR 5...
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Game Over Screen - Enhanced */}
      <AnimatePresence>
        {health === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50"
          >
            {/* Red flash */}
            <motion.div
              className="absolute inset-0 bg-red-600"
              animate={{
                opacity: [0, 0.5, 0, 0.3, 0]
              }}
              transition={{ duration: 0.8, times: [0, 0.1, 0.2, 0.3, 1] }}
            />
            
            {/* Main content */}
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-red-900/80 via-black/90 to-black backdrop-blur-md">
              <div className="text-center space-y-8">
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.6, type: 'spring' }}
                  className="intense-glitch text-8xl font-bold text-red-400"
                >
                  MISSION FAILED
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2, duration: 0.6 }}
                  className="space-y-4"
                >
                  <p className="text-red-300 text-3xl">Agent Cross has been compromised</p>
                  <p className="text-white text-xl opacity-70">Systems shutting down...</p>
                </motion.div>

                {/* Static noise effect */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.3, 0] }}
                  transition={{ delay: 1.5, duration: 2, repeat: Infinity }}
                  className="text-gray-500 text-sm tracking-widest"
                >
                  CONNECTION LOST
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
