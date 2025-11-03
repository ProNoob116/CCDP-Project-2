import { motion } from 'motion/react';
import { SkipForward } from 'lucide-react';
import elaraVossImage from 'figma:asset/119bce618f44b5f1fb022af190c7cf129cc73914.png';
import sleepingPodBgImage from 'figma:asset/7269d8eabfe37e7c4cb9215e4147c3bac72ca3dd.png';

interface ElenaRecoveryCutsceneProps {
  onComplete: () => void;
}

export function ElenaRecoveryCutscene({ onComplete }: ElenaRecoveryCutsceneProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black relative overflow-hidden"
    >
      {/* Background Image - Sleeping Pods Room */}
      <div className="absolute inset-0">
        <img
          src={sleepingPodBgImage}
          alt="Sleeping Pods Room"
          className="w-full h-full object-cover"
          style={{ filter: 'brightness(0.3)' }}
        />
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
      </div>

      {/* Content - Centered both vertically and horizontally */}
      <div className="relative z-10 max-w-4xl w-full px-8 flex items-center justify-center min-h-screen">
        {/* Elena's Avatar and Dialogue */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex flex-col items-center gap-6"
        >
          {/* Avatar */}
          <motion.div
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.5 }}
            className="relative"
          >
            <motion.div
              animate={{
                boxShadow: [
                  '0 0 30px rgba(236, 72, 153, 0.3)',
                  '0 0 60px rgba(236, 72, 153, 0.6)',
                  '0 0 30px rgba(236, 72, 153, 0.3)'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="rounded-full overflow-hidden border-4 border-pink-400 w-48 h-48"
            >
              <img 
                src={elaraVossImage} 
                alt="Elena Cross"
                className="w-full h-full object-cover"
              />
            </motion.div>
            
            {/* Status indicator */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.8 }}
              className="absolute -bottom-2 -right-2 bg-green-500 border-4 border-black rounded-full px-3 py-1"
            >
              <span className="text-xs font-bold text-white">CONSCIOUS</span>
            </motion.div>
          </motion.div>

          {/* Name */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="text-center"
          >
            <div className="text-pink-400 text-sm tracking-wider mb-1">AGENT IDENTIFIED</div>
            <h2 className="text-4xl font-bold text-white">ELENA CROSS</h2>
            <div className="text-cyan-400 text-sm mt-1">CODENAME: EC</div>
          </motion.div>

          {/* Dialogue Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="bg-gradient-to-br from-gray-900/90 to-black/90 border-2 border-pink-500/50 rounded-xl p-6 backdrop-blur-sm max-w-2xl"
          >
            <div className="flex items-start gap-4">
              <div className="w-1 h-full bg-pink-400 rounded-full" />
              <div>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5 }}
                  className="text-white text-lg leading-relaxed mb-4"
                >
                  "Simon... you came. They experimented on me, tried to extract my knowledge of their systems."
                </motion.p>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 4.5 }}
                  className="text-pink-300 text-lg leading-relaxed"
                >
                  "The Ballroom... something's down there. Be careful, brother."
                </motion.p>
              </div>
            </div>
          </motion.div>

          {/* Continue prompt - PLENTY OF TIME TO READ (8 seconds after cutscene starts) */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 8.0 }}
            onClick={onComplete}
            className="mt-4 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white px-8 py-3 rounded-lg font-bold transition-all duration-300 border-2 border-pink-400"
          >
            CONTINUE MISSION
          </motion.button>
        </motion.div>

        {/* Subtle background particles */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 15 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-pink-400/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -100, 0],
                opacity: [0, 0.5, 0],
              }}
              transition={{
                duration: 4 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 3,
              }}
            />
          ))}
        </div>
      </div>



      {/* Skip Button */}
      <motion.button
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1 }}
        onClick={onComplete}
        className="fixed top-8 right-8 z-50 px-6 py-3 bg-red-600/80 hover:bg-red-500 border-2 border-red-400 rounded-lg backdrop-blur-sm transition-all duration-300 flex items-center gap-2 group"
      >
        <span className="text-white font-bold">SKIP</span>
        <SkipForward className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
      </motion.button>
    </motion.div>
  );
}
