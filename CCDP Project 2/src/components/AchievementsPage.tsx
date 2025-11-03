import { motion } from 'motion/react';
import { ArrowLeft, Lock, Trophy, Target } from 'lucide-react';
import ballroomImage from 'figma:asset/ca901b29453018089577073da7adea355d2f5c06.png';
import { achievements, Achievement } from '../data/achievements';

interface AchievementsPageProps {
  onBack: () => void;
  unlockedAchievements?: string[];
}

export function AchievementsPage({ onBack, unlockedAchievements = [] }: AchievementsPageProps) {
  const unlockedCount = unlockedAchievements.length;
  const totalCount = achievements.length;
  const completionPercentage = Math.round((unlockedCount / totalCount) * 100);

  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={ballroomImage}
          alt="Background"
          className="w-full h-full object-cover"
          style={{ filter: 'brightness(0.15) blur(12px)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/90 to-black" />
      </div>

      {/* Vignette */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black opacity-80" />

      {/* Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: Math.random() * 3 + 1,
              height: Math.random() * 3 + 1,
              background: 'rgba(234, 179, 8, 0.3)',
            }}
            animate={{
              y: [0, -80, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 6 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      {/* Scan Lines */}
      <motion.div
        className="absolute inset-0 pointer-events-none opacity-5"
        style={{
          backgroundImage: 'linear-gradient(transparent 50%, rgba(255, 255, 255, 0.05) 50%)',
          backgroundSize: '100% 4px',
        }}
        animate={{ backgroundPositionY: ['0px', '4px'] }}
        transition={{ duration: 0.1, repeat: Infinity, ease: 'linear' }}
      />

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          onClick={onBack}
          className="fixed top-8 left-8 z-50 bg-gray-900/80 hover:bg-gray-800 border-2 border-gray-700 rounded-xl px-6 py-3 backdrop-blur-md transition-all duration-300 group flex items-center gap-3"
        >
          <ArrowLeft className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
          <span className="text-gray-400 group-hover:text-white tracking-wider transition-colors">
            BACK
          </span>
        </motion.button>

        {/* Content */}
        <div className="flex-1 flex items-center justify-center py-24 px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full max-w-5xl"
          >
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-center mb-12"
            >
              <motion.div
                animate={{
                  textShadow: [
                    '0 0 20px rgba(234, 179, 8, 0.5)',
                    '0 0 40px rgba(234, 179, 8, 0.8)',
                    '0 0 20px rgba(234, 179, 8, 0.5)',
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="text-6xl md:text-7xl font-bold tracking-wider bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent mb-4"
              >
                ACHIEVEMENTS
              </motion.div>
              <div className="h-px bg-gradient-to-r from-transparent via-yellow-500 to-transparent max-w-md mx-auto mb-8" />

              {/* Progress Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-br from-yellow-950/40 to-black/60 border border-yellow-500/30 rounded-2xl p-6 backdrop-blur-sm max-w-2xl mx-auto"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Trophy className="w-8 h-8 text-yellow-400" />
                    <div className="text-left">
                      <div className="text-yellow-400 tracking-wider text-sm">
                        COMPLETION RATE
                      </div>
                      <div className="text-white text-2xl font-bold">
                        {unlockedCount} / {totalCount}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-yellow-400 tracking-wider text-sm">
                      PROGRESS
                    </div>
                    <div className="text-white text-2xl font-bold">
                      {completionPercentage}%
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-3 bg-black/80 border border-yellow-500/30 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${completionPercentage}%` }}
                    transition={{ delay: 0.6, duration: 1, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-yellow-600 to-orange-500 relative"
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                      animate={{ x: ['-100%', '200%'] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    />
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>

            {/* Achievement Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {achievements.map((achievement, index) => {
                const isUnlocked = unlockedAchievements.includes(achievement.id);

                return (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                    className="group relative"
                  >
                    {/* Achievement Card */}
                    <div
                      className={`
                        relative overflow-hidden rounded-2xl p-6 backdrop-blur-sm border-2 transition-all duration-300
                        ${
                          isUnlocked
                            ? 'bg-gradient-to-br from-gray-900/80 to-black/80 border-yellow-500/50'
                            : 'bg-gradient-to-br from-gray-900/40 to-black/40 border-gray-700/30'
                        }
                      `}
                      style={{
                        boxShadow: isUnlocked
                          ? `0 0 20px ${achievement.glowColor}`
                          : 'none',
                      }}
                    >
                      {/* Locked Overlay */}
                      {!isUnlocked && (
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-10">
                          <Lock className="w-12 h-12 text-gray-600" />
                        </div>
                      )}

                      {/* Content */}
                      <div className="flex items-start gap-4">
                        {/* Icon */}
                        <motion.div
                          animate={
                            isUnlocked
                              ? {
                                  scale: [1, 1.1, 1],
                                  rotate: [0, 5, -5, 0],
                                }
                              : {}
                          }
                          transition={
                            isUnlocked
                              ? { duration: 2, repeat: Infinity }
                              : {}
                          }
                          className={`text-5xl ${!isUnlocked && 'grayscale opacity-30'}`}
                        >
                          {achievement.icon}
                        </motion.div>

                        {/* Text */}
                        <div className="flex-1">
                          <h3
                            className={`text-xl font-bold tracking-wider mb-2 ${
                              isUnlocked ? 'text-white' : 'text-gray-600'
                            }`}
                          >
                            {achievement.title}
                          </h3>
                          <p
                            className={`text-sm tracking-wide ${
                              isUnlocked ? 'text-gray-400' : 'text-gray-700'
                            }`}
                          >
                            {achievement.description}
                          </p>

                          {/* Unlocked Badge */}
                          {isUnlocked && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.8 + index * 0.1, type: 'spring' }}
                              className="mt-3 inline-flex items-center gap-2 bg-green-950/50 border border-green-500/50 rounded-full px-3 py-1"
                            >
                              <Target className="w-3 h-3 text-green-400" />
                              <span className="text-green-400 text-xs tracking-wider">
                                UNLOCKED
                              </span>
                            </motion.div>
                          )}
                        </div>
                      </div>

                      {/* Shimmer effect for unlocked achievements */}
                      {isUnlocked && (
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                          animate={{ x: ['-100%', '200%'] }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            repeatDelay: 2,
                            ease: 'linear',
                          }}
                        />
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Footer */}
            {unlockedCount === totalCount && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.5 }}
                className="mt-12 text-center bg-gradient-to-r from-yellow-950/60 to-orange-950/60 border-2 border-yellow-500 rounded-2xl p-8 backdrop-blur-sm"
              >
                <motion.div
                  animate={{
                    textShadow: [
                      '0 0 20px rgba(234, 179, 8, 0.8)',
                      '0 0 40px rgba(234, 179, 8, 1)',
                      '0 0 20px rgba(234, 179, 8, 0.8)',
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-yellow-400 text-3xl font-bold tracking-wider mb-2"
                >
                  🏆 MASTER OPERATIVE 🏆
                </motion.div>
                <p className="text-yellow-300 tracking-wider">
                  ALL ACHIEVEMENTS UNLOCKED
                </p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Corner Brackets */}
      <div className="absolute top-8 left-8 opacity-20">
        <div className="w-16 h-16 border-t-2 border-l-2 border-yellow-500" />
      </div>
      <div className="absolute top-8 right-8 opacity-20">
        <div className="w-16 h-16 border-t-2 border-r-2 border-yellow-500" />
      </div>
      <div className="absolute bottom-8 left-8 opacity-20">
        <div className="w-16 h-16 border-b-2 border-l-2 border-yellow-500" />
      </div>
      <div className="absolute bottom-8 right-8 opacity-20">
        <div className="w-16 h-16 border-b-2 border-r-2 border-yellow-500" />
      </div>
    </div>
  );
}
