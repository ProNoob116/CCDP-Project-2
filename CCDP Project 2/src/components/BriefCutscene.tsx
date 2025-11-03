import { motion } from 'motion/react';
import { SkipForward } from 'lucide-react';

interface BriefCutsceneProps {
  lines: string[];
  onComplete: () => void;
  color?: 'cyan' | 'red' | 'green' | 'yellow';
}

export function BriefCutscene({ lines, onComplete, color = 'cyan' }: BriefCutsceneProps) {
  const colorClasses = {
    cyan: 'text-cyan-400 border-cyan-500',
    red: 'text-red-400 border-red-500',
    green: 'text-green-400 border-green-500',
    yellow: 'text-yellow-400 border-yellow-500'
  };

  const glowClasses = {
    cyan: 'blue-glow-title',
    red: 'red-glow-title',
    green: 'green-glow-title',
    yellow: 'yellow-glow-title'
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onComplete}
      style={{ willChange: 'opacity' }}
      className="fixed inset-0 z-50 bg-black flex items-center justify-center cursor-pointer"
    >
      {/* Tech Grid Background */}
      <div className="absolute inset-0 tech-grid opacity-10" />

      {/* Scan lines */}
      <motion.div
        className="absolute inset-0"
        style={{
          backgroundImage: 'linear-gradient(transparent 50%, rgba(255, 255, 255, 0.02) 50%)',
          backgroundSize: '100% 4px',
          willChange: 'background-position'
        }}
        animate={{ backgroundPositionY: ['0px', '4px'] }}
        transition={{ duration: 0.1, repeat: Infinity, ease: 'linear' }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-8">
        <div className={`bg-black/80 border-2 ${colorClasses[color].split(' ')[1]} rounded-xl p-12 backdrop-blur-md`}>
          {/* Corner brackets */}
          <div className={`absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 ${colorClasses[color].split(' ')[1]}`}></div>
          <div className={`absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 ${colorClasses[color].split(' ')[1]}`}></div>
          <div className={`absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 ${colorClasses[color].split(' ')[1]}`}></div>
          <div className={`absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 ${colorClasses[color].split(' ')[1]}`}></div>

          <div className="space-y-6">
            {lines.map((line, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.8, duration: 0.6 }}
                style={{ willChange: 'transform, opacity' }}
                className={`${colorClasses[color].split(' ')[0]} text-2xl tracking-wide ${index === 0 ? glowClasses[color] : ''}`}
              >
                {line}
              </motion.div>
            ))}

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: lines.length * 0.8 + 0.5 }}
              onClick={onComplete}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`mt-8 w-full bg-gradient-to-r from-${color}-600 to-${color}-700 hover:from-${color}-700 hover:to-${color}-800 text-white px-8 py-4 rounded-lg font-bold text-xl tracking-wider border-2 border-${color}-400 transition-all duration-300`}
              style={{
                background: color === 'cyan' ? 'linear-gradient(to right, #0891b2, #0e7490)' :
                           color === 'red' ? 'linear-gradient(to right, #dc2626, #b91c1c)' :
                           color === 'green' ? 'linear-gradient(to right, #16a34a, #15803d)' :
                           'linear-gradient(to right, #eab308, #ca8a04)',
                willChange: 'transform, opacity'
              }}
            >
              → CONTINUE
            </motion.button>
          </div>
        </div>
      </div>

      {/* Click to Continue Prompt */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: lines.length * 0.8 + 1 }}
        style={{ willChange: 'transform, opacity' }}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
      >
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{
            background: 'rgba(0, 0, 0, 0.8)',
            willChange: 'opacity'
          }}
          className={`border-2 ${colorClasses[color].split(' ')[1]} rounded-lg px-8 py-3 backdrop-blur-md shadow-2xl`}
        >
          <span className={`${colorClasses[color].split(' ')[0]} tracking-wider font-bold`}>CLICK ANYWHERE TO CONTINUE</span>
        </motion.div>
      </motion.div>

      {/* Skip Button */}
      <motion.button
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1 }}
        onClick={onComplete}
        style={{ willChange: 'transform, opacity' }}
        className="fixed top-8 right-8 z-50 px-6 py-3 bg-red-600/80 hover:bg-red-500 border-2 border-red-400 rounded-lg backdrop-blur-sm transition-all duration-300 flex items-center gap-2 group"
      >
        <span className="text-white font-bold">SKIP</span>
        <SkipForward className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
      </motion.button>
    </motion.div>
  );
}
