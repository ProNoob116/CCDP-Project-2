import { motion } from 'motion/react';
import { Achievement } from '../data/achievements';

interface AchievementBadgeProps {
  achievement: Achievement;
  unlocked: boolean;
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
  delay?: number;
}

export function AchievementBadge({ 
  achievement, 
  unlocked, 
  size = 'medium',
  showLabel = true,
  delay = 0
}: AchievementBadgeProps) {
  const sizeClasses = {
    small: 'w-16 h-16 text-2xl',
    medium: 'w-24 h-24 text-4xl',
    large: 'w-32 h-32 text-5xl'
  };

  const labelSizes = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-base'
  };

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay, type: 'spring', stiffness: 200, damping: 15 }}
      className="flex flex-col items-center gap-3"
    >
      {/* Badge Circle */}
      <motion.div
        className={`${sizeClasses[size]} rounded-full border-4 flex items-center justify-center relative overflow-hidden ${
          unlocked ? 'border-opacity-100' : 'border-opacity-30'
        }`}
        style={{
          borderColor: unlocked ? achievement.color : '#444',
          backgroundColor: unlocked ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.6)'
        }}
        animate={unlocked ? {
          boxShadow: [
            `0 0 20px ${achievement.glowColor}`,
            `0 0 40px ${achievement.glowColor}`,
            `0 0 20px ${achievement.glowColor}`
          ]
        } : {}}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {/* Background glow effect */}
        {unlocked && (
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: `radial-gradient(circle, ${achievement.glowColor} 0%, transparent 70%)`
            }}
            animate={{
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}

        {/* Icon */}
        <div 
          className={`relative z-10 ${unlocked ? '' : 'grayscale opacity-40'}`}
          style={{
            filter: unlocked ? `drop-shadow(0 0 8px ${achievement.color})` : 'none'
          }}
        >
          {achievement.icon}
        </div>

        {/* Locked overlay */}
        {!unlocked && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <svg 
              className="w-1/2 h-1/2 text-gray-600" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
              />
            </svg>
          </div>
        )}

        {/* Shine effect for unlocked */}
        {unlocked && (
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%)'
            }}
            animate={{
              x: ['-200%', '200%']
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatDelay: 2,
              ease: 'linear'
            }}
          />
        )}
      </motion.div>

      {/* Label */}
      {showLabel && (
        <div className="text-center max-w-[200px]">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: delay + 0.2 }}
            className={`font-bold tracking-wider ${labelSizes[size]} ${
              unlocked ? 'text-white' : 'text-gray-600'
            }`}
            style={{
              textShadow: unlocked ? `0 0 10px ${achievement.color}` : 'none'
            }}
          >
            {achievement.title}
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay + 0.3 }}
            className={`text-xs text-gray-400 mt-1 ${unlocked ? 'opacity-80' : 'opacity-40'}`}
          >
            {achievement.description}
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
