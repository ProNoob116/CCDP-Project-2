import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { SkipForward, Shield, Lock, Unlock, AlertTriangle } from 'lucide-react';

interface CommandCenterAuthorizationProps {
  dossiersViewed: boolean;
  onViewDossiers?: () => void;
  onBeginDescent?: () => void;
}

export function CommandCenterAuthorization({
  dossiersViewed,
  onViewDossiers,
  onBeginDescent
}: CommandCenterAuthorizationProps) {
  const [threatLevel] = useState(100);

  return (
    <div className="relative min-h-screen overflow-hidden bg-black flex items-center justify-center p-4 sm:p-8">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated gradient backdrop */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-black to-gray-900" />
        
        {/* Enhanced grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(rgba(59, 130, 246, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />
        
        {/* Radial gradient spotlight */}
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.05) 0%, transparent 50%, rgba(0, 0, 0, 0.5) 100%)'
        }} />
        
        {/* Reduced ambient particles for performance */}
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute rounded-full"
            style={{
              left: `${(i * 12.5) + Math.random() * 10}%`,
              top: `${Math.random() * 100}%`,
              width: 2,
              height: 2,
              background: dossiersViewed 
                ? 'rgba(74, 222, 128, 0.3)' 
                : 'rgba(59, 130, 246, 0.3)',
              filter: 'blur(1px)',
            }}
            animate={{
              y: [0, -60, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 6 + (i * 0.5),
              repeat: Infinity,
              delay: i * 0.4,
              ease: 'easeInOut'
            }}
          />
        ))}
        
        {/* Scan line effect */}
        <motion.div
          className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent"
          animate={{ top: ['0%', '100%'] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      <div className="w-full max-w-5xl relative z-10 space-y-12">
        
        {/* Status Header with Icon */}
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center"
        >
          <motion.div 
            className="inline-flex flex-col items-center gap-6"
            animate={{
              opacity: [0.8, 1, 0.8]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            {/* Status Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 200, damping: 15 }}
              className="relative"
            >
              {/* Icon glow */}
              <div className={`absolute inset-0 rounded-full blur-2xl ${
                dossiersViewed ? 'bg-green-500/40' : 'bg-yellow-500/40'
              }`} />
              
              <div className={`relative w-24 h-24 rounded-full border-4 flex items-center justify-center ${
                dossiersViewed 
                  ? 'bg-gradient-to-br from-green-500/20 to-green-600/30 border-green-500/60' 
                  : 'bg-gradient-to-br from-yellow-500/20 to-yellow-600/30 border-yellow-500/60'
              } shadow-[0_0_40px_rgba(74,222,128,0.3)]`}>
                {dossiersViewed ? (
                  <Unlock className="w-12 h-12 text-green-400 drop-shadow-[0_0_12px_rgba(74,222,128,0.8)]" />
                ) : (
                  <Lock className="w-12 h-12 text-yellow-400 drop-shadow-[0_0_12px_rgba(234,179,8,0.8)]" />
                )}
              </div>
            </motion.div>
            
            {/* Status Text */}
            <motion.h1 
              className={`text-5xl sm:text-6xl md:text-7xl font-bold tracking-wider ${
                dossiersViewed ? 'text-green-400' : 'text-yellow-400'
              }`}
              style={{ fontFamily: 'JetBrains Mono, monospace' }}
              animate={{
                textShadow: dossiersViewed 
                  ? [
                      '0 0 30px rgba(74, 222, 128, 0.6), 0 0 60px rgba(74, 222, 128, 0.3)',
                      '0 0 40px rgba(74, 222, 128, 0.8), 0 0 80px rgba(74, 222, 128, 0.4)',
                      '0 0 30px rgba(74, 222, 128, 0.6), 0 0 60px rgba(74, 222, 128, 0.3)'
                    ]
                  : [
                      '0 0 20px rgba(234, 179, 8, 0.5), 0 0 40px rgba(234, 179, 8, 0.2)',
                      '0 0 30px rgba(234, 179, 8, 0.7), 0 0 60px rgba(234, 179, 8, 0.3)',
                      '0 0 20px rgba(234, 179, 8, 0.5), 0 0 40px rgba(234, 179, 8, 0.2)'
                    ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              {dossiersViewed ? 'AUTHORISATION COMPLETE' : 'AUTHORIZATION PENDING'}
            </motion.h1>
            
            {/* Subtitle */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className={`text-sm tracking-[0.3em] uppercase ${
                dossiersViewed ? 'text-green-500/70' : 'text-yellow-500/70'
              }`}
              style={{ fontFamily: 'JetBrains Mono, monospace' }}
            >
              {dossiersViewed ? 'Command Access Granted' : 'Awaiting Personnel Review'}
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Main Mission Display Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          {/* Multi-layer glow */}
          <div className={`absolute -inset-2 rounded-3xl blur-2xl opacity-50 ${
            dossiersViewed ? 'bg-gradient-to-r from-green-500/20 via-cyan-500/20 to-green-500/20' : 'bg-gradient-to-r from-blue-500/20 via-cyan-500/20 to-blue-500/20'
          }`} />
          <div className={`absolute -inset-1 rounded-2xl blur-xl ${
            dossiersViewed ? 'bg-green-500/20' : 'bg-blue-500/20'
          }`} />
          
          {/* Main card container */}
          <div className={`relative bg-gradient-to-b from-gray-900/98 via-gray-900/95 to-black/98 border-2 rounded-2xl backdrop-blur-2xl overflow-hidden ${
            dossiersViewed ? 'border-green-500/40' : 'border-blue-500/40'
          } shadow-[0_20px_60px_rgba(0,0,0,0.8)]`}>
            
            {/* Inner shadow for depth */}
            <div className="absolute inset-0 rounded-2xl shadow-[inset_0_2px_20px_rgba(0,0,0,0.6)]" />
            
            <div className="relative p-8 sm:p-10 md:p-12">
              {/* Header Section */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 pb-6 border-b border-gray-700/50">
                <div className="mb-4 sm:mb-0">
                  <div className="text-xs text-gray-500 tracking-[0.2em] uppercase mb-2" style={{ fontFamily: 'JetBrains Mono, monospace' }}>Operation</div>
                  <div className="text-2xl sm:text-3xl text-white font-bold tracking-wide flex items-center gap-3" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                    <Shield className="w-6 h-6 text-cyan-400" />
                    NAHRAN DESCENT
                  </div>
                </div>
                <div className="text-left sm:text-right">
                  <div className="text-xs text-gray-500 tracking-[0.2em] uppercase mb-2" style={{ fontFamily: 'JetBrains Mono, monospace' }}>Agent ID</div>
                  <div className="text-xl sm:text-2xl text-cyan-400 font-bold drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                    CROSS-07
                  </div>
                </div>
              </div>
              
              {/* Status Grid with Enhanced Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">
                {[
                  { label: 'Agent Status', value: 'ACTIVE', complete: true, color: 'green', icon: '✓' },
                  { label: 'Authorization', value: dossiersViewed ? 'GRANTED' : 'PENDING', complete: dossiersViewed, color: dossiersViewed ? 'green' : 'yellow', icon: dossiersViewed ? '✓' : '⟳' },
                  { label: 'Systems', value: 'ONLINE', complete: true, color: 'cyan', icon: '✓' },
                  { label: 'Target', value: 'NAHRAN-7', complete: true, color: 'red', icon: '!' }
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="relative group"
                  >
                    {/* Card glow on hover */}
                    <div className={`absolute -inset-0.5 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                      item.color === 'green' ? 'bg-green-500/20' :
                      item.color === 'yellow' ? 'bg-yellow-500/20' :
                      item.color === 'cyan' ? 'bg-cyan-500/20' :
                      'bg-red-500/20'
                    }`} />
                    
                    <div className="relative bg-black/60 border-2 border-gray-700/60 rounded-xl p-5 hover:border-gray-600 transition-all duration-300 shadow-[0_4px_16px_rgba(0,0,0,0.4)] hover:shadow-[0_6px_24px_rgba(0,0,0,0.6)]">
                      {/* Inner shadow */}
                      <div className="absolute inset-0 rounded-xl shadow-[inset_0_2px_8px_rgba(0,0,0,0.3)]" />
                      
                      <div className="relative">
                        <div className="text-xs text-gray-500 tracking-[0.15em] uppercase mb-3" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                          {item.label}
                        </div>
                        <div className="flex items-center justify-between">
                          <motion.span 
                            className={`font-bold text-lg sm:text-xl tracking-wide ${
                              item.color === 'green' ? 'text-green-400' :
                              item.color === 'yellow' ? 'text-yellow-400' :
                              item.color === 'cyan' ? 'text-cyan-400' :
                              'text-red-500'
                            }`}
                            style={{ fontFamily: 'JetBrains Mono, monospace' }}
                            animate={{
                              textShadow: item.color === 'green' 
                                ? [
                                    '0 0 10px rgba(74, 222, 128, 0.5)',
                                    '0 0 20px rgba(74, 222, 128, 0.7)',
                                    '0 0 10px rgba(74, 222, 128, 0.5)'
                                  ]
                                : item.color === 'red'
                                ? [
                                    '0 0 10px rgba(239, 68, 68, 0.5)',
                                    '0 0 20px rgba(239, 68, 68, 0.7)',
                                    '0 0 10px rgba(239, 68, 68, 0.5)'
                                  ]
                                : item.color === 'cyan'
                                ? [
                                    '0 0 10px rgba(34, 211, 238, 0.5)',
                                    '0 0 20px rgba(34, 211, 238, 0.7)',
                                    '0 0 10px rgba(34, 211, 238, 0.5)'
                                  ]
                                : item.color === 'yellow'
                                ? [
                                    '0 0 10px rgba(234, 179, 8, 0.5)',
                                    '0 0 20px rgba(234, 179, 8, 0.7)',
                                    '0 0 10px rgba(234, 179, 8, 0.5)'
                                  ]
                                : []
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            {item.value}
                          </motion.span>
                          <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ delay: 0.7 + i * 0.1, type: 'spring', stiffness: 200 }}
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                              item.color === 'green' ? 'bg-green-500/20 border-2 border-green-500/60 text-green-400 shadow-[0_0_12px_rgba(74,222,128,0.3)]' :
                              item.color === 'yellow' ? 'bg-yellow-500/20 border-2 border-yellow-500/60 text-yellow-400 shadow-[0_0_12px_rgba(234,179,8,0.3)]' :
                              item.color === 'cyan' ? 'bg-cyan-500/20 border-2 border-cyan-500/60 text-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.3)]' :
                              'bg-red-500/20 border-2 border-red-500/60 text-red-400 shadow-[0_0_12px_rgba(239,68,68,0.3)]'
                            }`}
                          >
                            {item.icon}
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Threat Level Indicator - Enhanced */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="relative"
              >
                {/* Glow effect */}
                <div className="absolute -inset-1 bg-red-500/10 rounded-xl blur-lg" />
                
                <div className="relative bg-gradient-to-br from-red-950/40 via-red-950/30 to-black/60 border-2 border-red-500/40 rounded-xl p-6 shadow-[0_8px_24px_rgba(239,68,68,0.2)]">
                  {/* Inner shadow */}
                  <div className="absolute inset-0 rounded-xl shadow-[inset_0_2px_12px_rgba(0,0,0,0.4)]" />
                  
                  <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="w-5 h-5 text-red-400" />
                        <div className="text-xs text-red-400 tracking-[0.2em] uppercase" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                          Threat Assessment
                        </div>
                      </div>
                      <motion.div 
                        className="text-red-400 font-bold text-2xl drop-shadow-[0_0_10px_rgba(239,68,68,0.6)]"
                        style={{ fontFamily: 'JetBrains Mono, monospace' }}
                        animate={{
                          scale: [1, 1.05, 1]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        {threatLevel}%
                      </motion.div>
                    </div>
                    
                    {/* Progress bar with enhanced styling */}
                    <div className="relative w-full h-3 bg-black/80 rounded-full overflow-hidden border border-gray-700/50 shadow-[inset_0_2px_8px_rgba(0,0,0,0.6)]">
                      <motion.div
                        className="absolute left-0 top-0 h-full bg-gradient-to-r from-yellow-500 via-orange-500 to-red-600"
                        initial={{ width: '0%' }}
                        animate={{ width: `${threatLevel}%` }}
                        transition={{ delay: 1.2, duration: 1.5, ease: 'easeOut' }}
                        style={{
                          boxShadow: '0 0 15px rgba(239, 68, 68, 0.6)'
                        }}
                      />
                      {/* Shimmer effect */}
                      <motion.div
                        className="absolute left-0 top-0 h-full w-1/5 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                        animate={{ left: ['0%', '100%'] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                      />
                    </div>
                    
                    <div className="text-xs text-red-400/80 mt-3 tracking-wider" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                      EXTREME - HOSTILE ENVIRONMENT CONFIRMED
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
            
            {/* Enhanced bottom accent bar */}
            <div className={`h-2 bg-gradient-to-r from-transparent ${
              dossiersViewed ? 'via-green-500/70' : 'via-blue-500/70'
            } to-transparent shadow-[0_0_20px_rgba(59,130,246,0.5)]`} />
          </div>
        </motion.div>

        {/* Action Buttons */}
        <div className="flex justify-center">
          {/* View Dossiers Button */}
          {onViewDossiers && !dossiersViewed && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              {/* Multi-layer button glow */}
              <motion.div
                className="absolute -inset-6 bg-gradient-to-r from-blue-600/30 via-cyan-600/40 to-blue-600/30 rounded-2xl blur-3xl"
                animate={{ opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <motion.div
                className="absolute -inset-3 bg-gradient-to-r from-blue-600/20 via-cyan-600/30 to-blue-600/20 rounded-xl blur-2xl"
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />

              <motion.button
                onClick={onViewDossiers}
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.98 }}
                className="relative bg-gradient-to-br from-blue-600 via-cyan-600 to-blue-600 text-white px-12 sm:px-16 py-5 sm:py-6 rounded-xl font-bold text-lg sm:text-xl tracking-widest transition-all duration-300 border-2 border-blue-400/60 overflow-hidden shadow-[0_12px_36px_rgba(59,130,246,0.4)]"
                style={{ fontFamily: 'JetBrains Mono, monospace' }}
              >
                {/* Shimmer effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{ x: ['-200%', '200%'] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                />
                <span className="relative z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">
                  VIEW PERSONNEL DOSSIERS
                </span>
              </motion.button>
            </motion.div>
          )}
          
          {/* Begin Descent Button */}
          {onBeginDescent && dossiersViewed && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, type: 'spring', stiffness: 150, damping: 15 }}
              className="relative"
            >
              {/* Intense multi-layer pulsing glow */}
              <motion.div
                className="absolute -inset-10 bg-gradient-to-r from-red-600/40 via-red-500/50 to-red-600/40 rounded-full blur-3xl"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.5, 0.9, 0.5]
                }}
                transition={{ duration: 2.5, repeat: Infinity }}
              />
              <motion.div
                className="absolute -inset-6 bg-red-500/30 rounded-2xl blur-2xl"
                animate={{
                  opacity: [0.6, 1, 0.6]
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />

              <motion.button
                onClick={onBeginDescent}
                whileHover={{ scale: 1.08, y: -5 }}
                whileTap={{ scale: 1.03 }}
                className="relative bg-gradient-to-br from-red-600 via-red-500 to-red-600 text-white px-16 sm:px-20 py-6 sm:py-8 rounded-2xl font-bold text-2xl sm:text-3xl tracking-widest border-4 border-red-400/70 overflow-hidden"
                style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  boxShadow: '0 0 50px rgba(239, 68, 68, 0.6), 0 0 100px rgba(239, 68, 68, 0.3), 0 12px 36px rgba(0, 0, 0, 0.6)'
                }}
              >
                {/* Animated shimmer */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  animate={{ x: ['-200%', '200%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                />
                
                {/* Pulsing inner border */}
                <motion.div
                  className="absolute inset-0 border-2 border-white/50 rounded-2xl"
                  animate={{ opacity: [0.3, 0.8, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />

                <span className="relative z-10 flex items-center gap-4 drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]">
                  BEGIN DESCENT
                  <motion.span
                    animate={{ x: [0, 10, 0] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                    className="text-4xl"
                  >
                    →
                  </motion.span>
                </span>
              </motion.button>

              {/* Warning text with glow */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ delay: 1.5, duration: 2.5, repeat: Infinity }}
                className="absolute -bottom-14 left-1/2 -translate-x-1/2 text-red-400 text-sm tracking-[0.3em] whitespace-nowrap drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]"
                style={{ fontFamily: 'JetBrains Mono, monospace' }}
              >
              </motion.div>
            </motion.div>
          )}
        </div>

        {/* Footer Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="text-center space-y-2"
        >
          <div className="text-xs text-gray-600 tracking-[0.2em] uppercase" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
            Nahran Corporation Tower - Floor 7 Entry Point
          </div>
          <div className="text-xs text-gray-700 tracking-wider" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
            Classified - Level 5 Clearance Required
          </div>
        </motion.div>
      </div>

      {/* Skip Button */}
      {!dossiersViewed && onViewDossiers && (
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.5 }}
          onClick={onViewDossiers}
          className="fixed bottom-8 right-8 z-50 px-6 py-3 bg-black/90 hover:bg-red-600 border-2 border-red-500/40 hover:border-red-500 rounded-xl backdrop-blur-md transition-all duration-300 flex items-center gap-2 group shadow-[0_8px_24px_rgba(0,0,0,0.4)] hover:shadow-[0_12px_32px_rgba(239,68,68,0.3)]"
          style={{ fontFamily: 'JetBrains Mono, monospace' }}
        >
          <span className="text-white font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">SKIP</span>
          <SkipForward className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
        </motion.button>
      )}
    </div>
  );
}
