import { memo } from 'react';
import { motion } from 'motion/react';

interface GameHUDProps {
  health: number;
  maxHealth: number;
  corruption: number;
  currentFloor: number;
  logsCollected?: number;
  totalLogs?: number;
}

const GameHUDComponent = ({ health, maxHealth, corruption, currentFloor, logsCollected = 0, totalLogs = 0 }: GameHUDProps) => {
  const healthPercentage = (health / maxHealth) * 100;
  const floorNames: { [key: number]: string } = {
    7: 'F7 - DATA ROOM',
    6: 'F6 - MEDBAY',
    5: 'F5 - KITCHEN',
    4: 'F4 - ACCOUNTING',
    3: 'F3 - PRINTING ROOM',
    2: 'F2 - SLEEPING PODS',
    1: 'F1 - BALLROOM',
    0: 'F0 - GROUND FLOOR (EXIT)'
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-4 gap-4">
          
          {/* Health Bar */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-black/80 border-2 border-red-500/50 rounded-lg p-4 backdrop-blur-sm"
          >
            <div className="text-red-400 text-xs mb-2 tracking-wider">HEALTH</div>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <div className="w-full h-3 bg-gray-900 rounded-full overflow-hidden border border-red-900/50">
                  <motion.div
                    className="h-full bg-gradient-to-r from-red-600 via-red-500 to-red-400"
                    style={{ willChange: 'width' }}
                    initial={{ width: '100%' }}
                    animate={{ width: `${healthPercentage}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
              <div className="text-red-400 font-bold text-sm">
                {health}/{maxHealth}
              </div>
            </div>
          </motion.div>

          {/* Floor Counter */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-black/80 border-2 border-cyan-500/50 rounded-lg p-4 backdrop-blur-sm text-center"
          >
            <div className="text-cyan-400 text-xs mb-2 tracking-wider">CURRENT FLOOR</div>
            <div className="text-white font-bold text-lg tracking-wider">
              {floorNames[currentFloor] || 'UNKNOWN'}
            </div>
          </motion.div>

          {/* AI Corruption Meter */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-black/80 border-2 border-yellow-500/50 rounded-lg p-4 backdrop-blur-sm"
          >
            <div className="text-yellow-400 text-xs mb-2 tracking-wider">AI CORRUPTION</div>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <div className="w-full h-3 bg-gray-900 rounded-full overflow-hidden border border-yellow-900/50">
                  <motion.div
                    className="h-full bg-gradient-to-r from-yellow-600 via-orange-500 to-red-500"
                    style={{ willChange: 'width' }}
                    initial={{ width: '0%' }}
                    animate={{ width: `${corruption}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
              <div className="text-yellow-400 font-bold text-sm">
                {corruption}%
              </div>
            </div>
          </motion.div>

          {/* Collectibles Counter */}
          {totalLogs > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-black/80 border-2 border-green-500/50 rounded-lg p-4 backdrop-blur-sm text-center"
            >
              <div className="text-green-400 text-xs mb-2 tracking-wider">COLLECTIBLES</div>
              <div className="text-white font-bold text-lg tracking-wider">
                {logsCollected}/{totalLogs}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

// Memoize to prevent unnecessary re-renders
export const GameHUD = memo(GameHUDComponent);
