import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DescentTransition } from "./DescentTransition";
import { DataRoomGame } from "./games/DataRoomGame";
import { MedbayGame } from "./games/MedbayGame";
import { KitchenGame } from "./games/KitchenGame";
import { AccountingGame } from "./games/AccountingGame";
import { PrintRoomGame } from "./games/PrintRoomGame";
import { SleepingPodGame } from "./games/SleepingPodGame";
import { FinalBallroomGame } from "./games/FinalBallroomGame";

interface ElevatorLiftInterfaceProps {
  onExitBuilding: () => void;
  onBackToAuthorisation: () => void;
}

export function ElevatorLiftInterface({ onExitBuilding, onBackToAuthorisation }: ElevatorLiftInterfaceProps) {
  const [currentFloor, setCurrentFloor] = useState(7);
  const [unlockedFloors, setUnlockedFloors] = useState<Set<number>>(new Set([7]));
  const [completedFloors, setCompletedFloors] = useState<Set<number>>(new Set());
  const [currentGame, setCurrentGame] = useState<number | null>(null);
  const [isDescending, setIsDescending] = useState(false);
  const [descentFrom, setDescentFrom] = useState(7);
  const [descentTo, setDescentTo] = useState(6);
  const [showStory, setShowStory] = useState(true);
  const [health, setHealth] = useState(100);

  const floors = [
    { 
      number: 7, 
      name: 'DATA ROOM', 
      status: 'SAFE ZONE',
      story: 'The elevator hums softly. Server racks line the walls, their LEDs blinking like distant stars. This is your entry point - the safest floor in NAHRAN-7.',
      color: 'cyan'
    },
    { 
      number: 6, 
      name: 'MEDBAY', 
      status: 'STERILE',
      story: 'Medical equipment gleams under harsh white lights. The scent of antiseptic fills the air. You sense help here... but also something watching.',
      color: 'blue'
    },
    { 
      number: 5, 
      name: 'KITCHEN', 
      status: 'COMPROMISED',
      story: 'Industrial ovens stand dormant. The temperature is wrong. Something toxic has contaminated this space.',
      color: 'yellow'
    },
    { 
      number: 4, 
      name: 'ACCOUNTING', 
      status: 'AUTOMATED',
      story: 'Endless cubicles stretch into darkness. Computer screens flicker with corrupted data. The AI accountants never sleep.',
      color: 'orange'
    },
    { 
      number: 3, 
      name: 'PRINTING ROOM', 
      status: 'HOSTILE',
      story: 'Machines whir and clank. Paper feeds through automated systems. The printers have become something... more.',
      color: 'red'
    },
    { 
      number: 2, 
      name: 'SLEEPING PODS', 
      status: 'CLASSIFIED',
      story: 'Secret chambers hidden from blueprints. Pods line the walls like coffins. Someone... or something... still dreams here.',
      color: 'purple'
    },
    { 
      number: 1, 
      name: 'BALLROOM', 
      status: 'FINAL DESTINATION',
      story: 'The heart of NAHRAN-7. Where all answers lie. Where Elena waits. This is where everything ends... or begins.',
      color: 'red'
    },
  ];

  const getCurrentFloorData = () => floors.find(f => f.number === currentFloor)!;

  const handleEnterFloor = () => {
    setShowStory(false);
    setCurrentGame(currentFloor);
  };

  const handleExitGame = () => {
    setCurrentGame(null);
    setShowStory(true);
  };

  const handleGameComplete = (floor: number) => {
    setCompletedFloors(prev => new Set([...prev, floor]));
    setCurrentGame(null);
    setShowStory(true);
    
    // Unlock next floor
    if (floor === 7) {
      setUnlockedFloors(prev => new Set([...prev, 6]));
    } else if (floor === 2) {
      setUnlockedFloors(prev => new Set([...prev, 1]));
    } else if (floor > 1) {
      setUnlockedFloors(prev => new Set([...prev, floor - 1]));
    }

    // Heal from medbay
    if (floor === 6) {
      setHealth(100);
    }
  };

  const handleDescendToFloor = (targetFloor: number) => {
    if (!unlockedFloors.has(targetFloor)) return;
    setDescentFrom(currentFloor);
    setDescentTo(targetFloor);
    setIsDescending(true);
  };

  const handleDescentComplete = () => {
    setIsDescending(false);
    setCurrentFloor(descentTo);
    setShowStory(true);
  };

  // Show descent animation
  if (isDescending) {
    return <DescentTransition fromFloor={descentFrom} toFloor={descentTo} onComplete={handleDescentComplete} />;
  }

  // Show game
  if (currentGame !== null) {
    const gameElement = (() => {
      switch (currentGame) {
        case 7: return <DataRoomGame onComplete={() => handleGameComplete(7)} onExit={handleExitGame} />;
        case 6: return <MedbayGame onComplete={() => handleGameComplete(6)} onExit={handleExitGame} />;
        case 5: return <KitchenGame onComplete={() => handleGameComplete(5)} onExit={handleExitGame} />;
        case 4: return <AccountingGame onComplete={() => handleGameComplete(4)} onExit={handleExitGame} />;
        case 3: return <PrintRoomGame onComplete={() => handleGameComplete(3)} onExit={handleExitGame} />;
        case 2: return <SleepingPodGame onComplete={() => handleGameComplete(2)} onExit={handleExitGame} />;
        case 1: return <FinalBallroomGame onComplete={() => handleGameComplete(1)} onExit={handleExitGame} />;
        default: return null;
      }
    })();
    return gameElement;
  }

  const floorData = getCurrentFloorData();
  const isCompleted = completedFloors.has(currentFloor);

  return (
    <div className="fixed inset-0 bg-black overflow-hidden" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
      {/* Elevator Interior Background */}
      <div className="absolute inset-0">
        {/* Metal walls */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900" />
        
        {/* Panel lines */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(90deg, transparent 49%, rgba(100,100,100,0.3) 50%, transparent 51%)',
          backgroundSize: '200px 100%'
        }} />
        
        {/* Ambient lighting */}
        <div className={`absolute inset-0 opacity-20 transition-colors duration-1000`} style={{
          background: `radial-gradient(circle at 50% 0%, ${floorData.color === 'cyan' ? '#06b6d4' : floorData.color === 'blue' ? '#3b82f6' : floorData.color === 'yellow' ? '#eab308' : floorData.color === 'orange' ? '#f97316' : floorData.color === 'purple' ? '#a855f7' : '#ef4444'} 0%, transparent 70%)`
        }} />

        {/* Floor indicator strip */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-4">
          {floors.map((floor) => (
            <div
              key={floor.number}
              className={`w-3 h-3 rounded-full transition-all duration-500 ${
                floor.number === currentFloor
                  ? `bg-${floorData.color}-400 shadow-[0_0_20px] shadow-${floorData.color}-400/80 scale-125`
                  : unlockedFloors.has(floor.number)
                    ? 'bg-gray-500'
                    : 'bg-gray-800'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-8">
        <div className="max-w-3xl w-full">
          <AnimatePresence mode="wait">
            {showStory ? (
              <motion.div
                key="story"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="space-y-8"
              >
                {/* Floor Display */}
                <motion.div
                  initial={{ y: -50 }}
                  animate={{ y: 0 }}
                  className="text-center"
                >
                  <div className={`text-8xl font-bold mb-4 text-${floorData.color}-400`}>
                    F{currentFloor}
                  </div>
                  <div className="text-3xl text-white mb-2">{floorData.name}</div>
                  <div className={`inline-block px-4 py-2 rounded border text-sm ${
                    floorData.status === 'SAFE ZONE' ? 'border-green-500/50 bg-green-900/20 text-green-400' :
                    floorData.status === 'FINAL DESTINATION' ? 'border-red-500/50 bg-red-900/20 text-red-400 animate-pulse' :
                    'border-yellow-500/50 bg-yellow-900/20 text-yellow-400'
                  }`}>
                    {floorData.status}
                  </div>
                </motion.div>

                {/* Story Text */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="bg-black/60 border border-gray-700 rounded-lg p-8 backdrop-blur-sm"
                >
                  <p className="text-gray-300 text-lg leading-relaxed italic">
                    "{floorData.story}"
                  </p>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="space-y-4"
                >
                  {/* Enter Floor Button */}
                  <button
                    onClick={handleEnterFloor}
                    className={`w-full py-6 rounded-lg font-bold text-xl transition-all duration-300 ${
                      isCompleted
                        ? 'bg-blue-600/20 hover:bg-blue-600/40 border-2 border-blue-500/50 text-blue-400'
                        : 'bg-red-600/20 hover:bg-red-600/40 border-2 border-red-500/50 text-red-400 animate-pulse'
                    }`}
                  >
                    {isCompleted ? '→ RE-ENTER FLOOR' : '→ BREACH FLOOR'}
                  </button>

                  {/* Descent Options */}
                  {currentFloor > 1 && (
                    <div className="grid grid-cols-2 gap-4">
                      {floors
                        .filter(f => f.number < currentFloor && unlockedFloors.has(f.number))
                        .slice(-2)
                        .map((floor) => (
                          <button
                            key={floor.number}
                            onClick={() => handleDescendToFloor(floor.number)}
                            className="py-4 rounded-lg font-bold text-base bg-gray-800/40 hover:bg-gray-700/60 border border-gray-600/50 text-gray-300 hover:text-white transition-all duration-300"
                          >
                            ↓ DESCEND TO F{floor.number}
                          </button>
                        ))
                      }
                    </div>
                  )}

                  {/* Exit Button */}
                  {currentFloor === 1 && isCompleted && (
                    <button
                      onClick={onExitBuilding}
                      className="w-full py-6 rounded-lg font-bold text-xl bg-gradient-to-r from-green-600/20 to-green-800/20 hover:from-green-600/40 hover:to-green-800/40 border-2 border-green-500/50 text-green-400 animate-pulse transition-all duration-300"
                    >
                      ✓ EXTRACT FROM NAHRAN-7
                    </button>
                  )}
                </motion.div>

                {/* Status Info */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 }}
                  className="flex justify-between text-xs text-gray-500 pt-4 border-t border-gray-800"
                >
                  <div>FLOORS CLEARED: {completedFloors.size}/7</div>
                  <div>AGENT: SIMON CROSS</div>
                  <div>SYSTEM: {health}%</div>
                </motion.div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>

      {/* Exit Button */}
      <button
        onClick={onBackToAuthorisation}
        className="fixed top-6 left-6 z-50 bg-red-600/80 hover:bg-red-700 text-white px-4 py-2 rounded font-bold transition-all duration-300 backdrop-blur-sm"
      >
        ← ABORT
      </button>

      {/* Elevator hum sound effect indicator */}
      <div className="fixed bottom-4 left-4 text-xs text-gray-600">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span>ELEVATOR SYSTEMS ONLINE</span>
        </div>
      </div>
    </div>
  );
}
