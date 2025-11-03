import { useState, useEffect } from 'react';
import { MainMenu } from './components/MainMenu';
import { AchievementsPage } from './components/AchievementsPage';
import { CreditsPage } from './components/CreditsPage';
import { MissionBriefingPage } from './components/MissionBriefingPage';
import { ElevatorLiftInterface } from './components/ElevatorLiftInterface';
import { DossiersPage } from './components/DossiersPageEnhanced'; // Active version - Enhanced with unlock mechanics
// Alternative: import { DossiersPageNew } from './components/DossiersPageNew'; // Simpler version
import { EpiloguePage } from './components/EpiloguePage';
import { DigitalClock } from './components/DigitalClock';
import { CinematicEntrySequence } from './components/CinematicEntrySequence';
import { InteractiveOpeningSequence } from './components/InteractiveOpeningSequence';
import { InteractiveFloorsSystem } from './components/InteractiveFloorsSystem';
import { PauseMenu } from './components/PauseMenu';
import { Pause } from 'lucide-react';
import { BackgroundMusic } from './components/BackgroundMusic';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./components/ui/alert-dialog";

export default function App() {
  const [currentPage, setCurrentPage] = useState<'main-menu' | 'achievements' | 'credits' | 'interactive-opening' | 'mission-briefing' | 'personnel-dossiers' | 'authorised-briefing' | 'cinematic-entry' | 'main-game' | 'interactive-floors' | 'epilogue'>('main-menu');
  const [previousPage, setPreviousPage] = useState<'mission-briefing' | 'authorised-briefing'>('mission-briefing');
  const [currentFloor, setCurrentFloor] = useState(7);
  const [dossiersViewed, setDossiersViewed] = useState(false);
  const [showNoReturnAlert, setShowNoReturnAlert] = useState(false);
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [health, setHealth] = useState(100);
  const [corruption, setCorruption] = useState(0);
  const [logsCollected, setLogsCollected] = useState(0);
  const [pauseTutorialSeen, setPauseTutorialSeen] = useState(false);

  // Keyboard controls for global pause
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Don't pause during interactive opening, main menu, achievements, or credits
      if (currentPage === 'interactive-opening' || currentPage === 'main-menu' || currentPage === 'achievements' || currentPage === 'credits') return;
      
      if (e.key === 'Escape') {
        setIsPaused(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentPage]);

  const handleViewDossiers = () => {
    // Store the current page as the previous page before navigating to dossiers
    setPreviousPage(currentPage as 'mission-briefing' | 'authorised-briefing');
    setCurrentPage('personnel-dossiers');
  };

  const handleBackFromDossiers = () => {
    // Show the "no way back" alert instead of immediately going back
    setShowNoReturnAlert(true);
  };

  const handleConfirmNoReturn = () => {
    // Close the alert without navigating anywhere
    setShowNoReturnAlert(false);
  };

  const handleAuthorized = () => {
    setDossiersViewed(true);
    setCurrentPage('authorised-briefing');
  };

  const handleBackToDossiers = () => {
    setCurrentPage('personnel-dossiers');
  };

  const handleBeginDescent = () => {
    setCurrentPage('cinematic-entry');
  };

  const handleCinematicComplete = () => {
    setCurrentPage('interactive-floors');
  };

  const handleBackToAuthorizedBriefing = () => {
    setCurrentPage('authorised-briefing');
  };

  const handleFloorsSystemComplete = (achievements: string[]) => {
    setUnlockedAchievements(achievements);
    setCurrentPage('epilogue');
  };

  const handleFloorsSystemExit = () => {
    setCurrentPage('authorised-briefing');
  };

  const handleBackToInsertionAuthorizing = () => {
    setCurrentPage('mission-briefing');
  };

  const handleBackToHUD = () => {
    setCurrentPage('authorised-briefing');
  };
  
  const handleFloorChange = (floor: number) => {
    setCurrentFloor(floor);
  };

  const handleEnterRoom = (room: number) => {
    // This function is handled within FloorsPage now
    // The game state management is internal to FloorsPage
    console.log(`Entering room ${room}`);
  };

  const handleExitBuilding = () => {
    setCurrentPage('epilogue');
  };

  const handleBackToTower = () => {
    setCurrentPage('main-game');
  };

  const handleRestart = () => {
    // Reset all state to initial values and return to main menu
    setCurrentPage('main-menu');
    setCurrentFloor(7);
    setDossiersViewed(false);
    setPreviousPage('mission-briefing');
    // Keep unlocked achievements for the achievements page
    setHealth(100);
    setCorruption(0);
    setLogsCollected(0);
    setIsPaused(false);
  };

  const handleOpeningComplete = () => {
    // After opening sequence (which includes CROSS decrypt), go straight to dossiers
    setCurrentPage('personnel-dossiers');
    setDossiersViewed(true);
  };

  return (
    <div className="min-h-screen bg-black text-white font-mono">
      <BackgroundMusic srcList={["/audio/Paper Wars.mp3"]} />
      {/* Digital Clock - Always visible except during interactive opening, main menu, achievements, and credits */}
      {currentPage !== 'interactive-opening' && currentPage !== 'main-menu' && currentPage !== 'achievements' && currentPage !== 'credits' && <DigitalClock />}

      {/* Global Pause Button - Always visible except during interactive opening, main menu, achievements, and credits */}
      {currentPage !== 'interactive-opening' && currentPage !== 'main-menu' && currentPage !== 'achievements' && currentPage !== 'credits' && (
        <button
          onClick={() => setIsPaused(true)}
          className="fixed top-8 left-6 z-50 bg-cyan-600/90 hover:bg-cyan-700 text-white p-3 rounded font-bold tracking-wide transition-all duration-300 border border-cyan-500/50 backdrop-blur-sm pointer-events-auto shadow-lg shadow-cyan-500/20 flex items-center gap-2"
          style={{ fontFamily: 'JetBrains Mono, monospace' }}
          title="Pause (ESC)"
        >
          <Pause className="w-5 h-5" />
        </button>
      )}

      {/* Global Pause Menu */}
      <PauseMenu
        isPaused={isPaused}
        onResume={() => setIsPaused(false)}
        onExit={() => {
          setIsPaused(false);
          // Return to appropriate page based on current state
          if (currentPage === 'interactive-floors') {
            setCurrentPage('authorised-briefing');
          }
        }}
        unlockedAchievements={unlockedAchievements}
        health={health}
        corruption={corruption}
        currentFloor={currentFloor}
        logsCollected={logsCollected}
      />
      
      {currentPage === 'main-menu' && (
        <MainMenu
          onStartGame={() => setCurrentPage('interactive-opening')}
          onAchievements={() => setCurrentPage('achievements')}
          onCredits={() => setCurrentPage('credits')}
        />
      )}

      {currentPage === 'achievements' && (
        <AchievementsPage
          onBack={() => setCurrentPage('main-menu')}
          unlockedAchievements={unlockedAchievements}
        />
      )}

      {currentPage === 'credits' && (
        <CreditsPage onBack={() => setCurrentPage('main-menu')} />
      )}

      {currentPage === 'interactive-opening' && (
        <InteractiveOpeningSequence onComplete={handleOpeningComplete} />
      )}

      {currentPage === 'mission-briefing' && (
        <MissionBriefingPage 
          onViewDossiers={handleViewDossiers}
          isAuthorized={false}
          dossiersViewed={dossiersViewed}
        />
      )}

      {currentPage === 'personnel-dossiers' && (
        <div className="relative">
          {/* Back Button with Alert Dialog - Positioned on right since pause is on left */}
          <AlertDialog open={showNoReturnAlert} onOpenChange={setShowNoReturnAlert}>
            <AlertDialogTrigger asChild>
              {/* Button removed */}
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-gray-900/95 border-2 border-red-600/50 backdrop-blur-md">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-red-400 text-xl font-bold tracking-wide" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                  SYSTEM WARNING
                </AlertDialogTitle>
                <AlertDialogDescription className="text-white text-lg mt-4" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                  <span className="text-red-300 font-bold text-2xl block mb-2 animate-pulse">
                    "There is no way back. Cross."
                  </span>
                  <span className="text-gray-300 text-sm">
                    Mission parameters have changed. You must continue forward. The dossiers contain classified intelligence that cannot be unlearned.
                  </span>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogAction 
                  onClick={handleConfirmNoReturn}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold border border-red-500/50"
                  style={{ fontFamily: 'JetBrains Mono, monospace' }}
                >
                  UNDERSTOOD - CONTINUE MISSION
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          
          {/* Dossiers Page */}
          <DossiersPage onAuthorized={handleAuthorized} />
        </div>
      )}

      {currentPage === 'authorised-briefing' && (
        <div className="relative">
          {/* Back Button - Only goes back to dossiers - Positioned on right since pause is on left */}
          <button
            onClick={handleBackToDossiers}
            className="fixed top-8 left-24 z-50 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded font-bold tracking-wide transition-all duration-300 border border-red-500/50"
            style={{ fontFamily: 'JetBrains Mono, monospace' }}
          >
            ← Go Back
          </button>
          <MissionBriefingPage 
            onViewDossiers={handleViewDossiers}
            onBeginDescent={handleBeginDescent}
            onBackToHUD={handleBackToHUD}
            isAuthorized={true}
            dossiersViewed={dossiersViewed}
          />
        </div>
      )}

      {currentPage === 'cinematic-entry' && (
        <CinematicEntrySequence onComplete={handleCinematicComplete} />
      )}

      {currentPage === 'interactive-floors' && (
        <InteractiveFloorsSystem 
          onComplete={handleFloorsSystemComplete}
          onExit={handleFloorsSystemExit}
          initialPauseTutorialSeen={pauseTutorialSeen}
          onPauseTutorialDismissed={() => setPauseTutorialSeen(true)}
          onStatsUpdate={(stats) => {
            setHealth(stats.health);
            setCorruption(stats.corruption);
            setCurrentFloor(stats.currentFloor);
            setLogsCollected(stats.logsCollected);
          }}
          externalIsPaused={isPaused}
          onPauseChange={setIsPaused}
        />
      )}

      {currentPage === 'main-game' && (
        <ElevatorLiftInterface 
          onExitBuilding={handleExitBuilding}
          onBackToAuthorisation={handleBackToAuthorizedBriefing}
        />
      )}

      {currentPage === 'epilogue' && (
        <EpiloguePage onComplete={handleRestart} unlockedAchievements={unlockedAchievements} />
      )}
    </div>
  );
}