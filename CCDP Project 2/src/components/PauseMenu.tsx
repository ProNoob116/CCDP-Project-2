import { motion, AnimatePresence } from 'motion/react';
import { AchievementBadge } from './AchievementBadge';
import { achievements } from '../data/achievements';

interface PauseMenuProps {
  isPaused: boolean;
  onResume: () => void;
  onExit: () => void;
  unlockedAchievements: string[];
  health: number;
  corruption: number;
  currentFloor: number;
  logsCollected: number;
}

export function PauseMenu({
  isPaused,
  onResume,
  onExit,
  unlockedAchievements,
  health,
  corruption,
  currentFloor,
  logsCollected
}: PauseMenuProps) {
  return (
    <AnimatePresence>
      {isPaused && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md"
          style={{ fontFamily: 'JetBrains Mono, monospace' }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="bg-gray-900/95 border-2 border-cyan-500/50 rounded-2xl p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-5xl font-bold text-cyan-400 mb-2"
                style={{ textShadow: '0 0 20px rgba(6, 182, 212, 0.6)' }}
              >
                MISSION PAUSED
              </motion.div>
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-gray-400 text-sm tracking-widest"
              >
                CURRENT FLOOR: {currentFloor === 0 ? 'F0' : `F${currentFloor}`}
              </motion.div>
            </div>

            {/* Stats Grid */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-2 gap-4 mb-8"
            >
              <div className="bg-black/40 border border-red-500/30 rounded-lg p-4">
                <div className="text-red-400 text-sm mb-1">HEALTH</div>
                <div className="text-white text-2xl font-bold">{health}%</div>
              </div>
              <div className="bg-black/40 border border-purple-500/30 rounded-lg p-4">
                <div className="text-purple-400 text-sm mb-1">CORRUPTION</div>
                <div className="text-white text-2xl font-bold">{corruption}%</div>
              </div>
              <div className="bg-black/40 border border-cyan-500/30 rounded-lg p-4">
                <div className="text-cyan-400 text-sm mb-1">LOGS COLLECTED</div>
                <div className="text-white text-2xl font-bold">{logsCollected} / 7</div>
              </div>
              <div className="bg-black/40 border border-green-500/30 rounded-lg p-4">
                <div className="text-green-400 text-sm mb-1">ACHIEVEMENTS</div>
                <div className="text-white text-2xl font-bold">{unlockedAchievements.length} / 4</div>
              </div>
            </motion.div>

            {/* Achievements Section */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mb-8"
            >
              <div className="text-center mb-6">
                <div className="text-2xl font-bold text-white mb-2">ACHIEVEMENTS</div>
                <div className="text-gray-400 text-xs tracking-wider">
                  {unlockedAchievements.length === 4 
                    ? 'ALL ACHIEVEMENTS UNLOCKED!' 
                    : `${4 - unlockedAchievements.length} REMAINING`}
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {achievements.map((achievement, index) => (
                  <AchievementBadge
                    key={achievement.id}
                    achievement={achievement}
                    unlocked={unlockedAchievements.includes(achievement.id)}
                    size="small"
                    showLabel={true}
                    delay={0.5 + index * 0.1}
                  />
                ))}
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex gap-4 justify-center"
            >
              <button
                onClick={onResume}
                className="px-8 py-4 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-bold tracking-wider transition-all duration-300 border-2 border-cyan-400/50 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-500/50"
              >
                RESUME MISSION
              </button>
            </motion.div>

            {/* Keyboard hint */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-center mt-6 text-gray-500 text-xs tracking-widest"
            >
              PRESS ESC TO RESUME
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
