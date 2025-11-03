import { useState, useEffect, useRef, memo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Radio, ChevronRight } from 'lucide-react';
import commanderAvatar from 'figma:asset/1ad715e94183518f89a0008c49ccf0c9d42cce31.png';
import nahranTowerBg from 'figma:asset/35f311dbc9b9311f5338519a5e9e9490451ea104.png';

interface RadioMessageProps {
  speaker: string;
  message: string;
  duration?: number;
  onComplete?: () => void;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  showAvatar?: boolean;
  cinematic?: boolean; // Large centered avatar mode
  autoDismissOnInteraction?: boolean; // Auto-dismiss when user interacts with game
  requireButtonClick?: boolean; // If true, ONLY button click works (no click-anywhere)
}

const RadioMessageComponent = ({ 
  speaker, 
  message, 
  duration = 7000, 
  onComplete,
  priority = 'medium',
  showAvatar = true,
  cinematic = false,
  autoDismissOnInteraction = true,
  requireButtonClick = false
}: RadioMessageProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isTyping, setIsTyping] = useState(true);
  const [displayedText, setDisplayedText] = useState('');

  const priorityColors = {
    low: 'border-cyan-500/70 bg-cyan-950/95',
    medium: 'border-blue-500/70 bg-blue-950/95',
    high: 'border-yellow-500/70 bg-yellow-950/95',
    critical: 'border-red-500/70 bg-red-950/95'
  };

  const priorityTextColors = {
    low: 'text-cyan-400',
    medium: 'text-blue-400',
    high: 'text-yellow-400',
    critical: 'text-red-400'
  };

  const priorityGlowColors = {
    low: 'shadow-cyan-500/50',
    medium: 'shadow-blue-500/50',
    high: 'shadow-yellow-500/50',
    critical: 'shadow-red-500/50'
  };

  // Typewriter effect
  useEffect(() => {
    // Reset states when message changes
    setDisplayedText('');
    setIsTyping(true);
    
    let index = 0;
    const typeSpeed = 25; // milliseconds per character - faster for better flow
    
    const typeInterval = setInterval(() => {
      if (index < message.length) {
        setDisplayedText(message.slice(0, index + 1));
        index++;
      } else {
        setIsTyping(false);
        clearInterval(typeInterval);
      }
    }, typeSpeed);

    return () => clearInterval(typeInterval);
  }, [message]);

  // Auto-dismiss disabled - user must click to advance
  // useEffect(() => {
  //   if (!duration || !isVisible) return;

  //   const timer = setTimeout(() => {
  //     setIsVisible(false);
  //     if (onComplete) {
  //       setTimeout(onComplete, 500);
  //     }
  //   }, duration);

  //   return () => clearTimeout(timer);
  // }, [duration, isVisible, onComplete]);

  // Disabled auto-dismiss on user interaction - user must click message directly
  // useEffect(() => {
  //   if (!autoDismissOnInteraction) return;

  //   const handleInteraction = (e: Event) => {
  //     // Check if the interaction is on the game area (not on the radio message itself)
  //     const target = e.target as HTMLElement;
  //     const isRadioElement = target.closest('[data-radio-message]');
      
  //     if (!isRadioElement && isVisible) {
  //       // Fade out and complete
  //       setIsVisible(false);
  //       if (onComplete) {
  //         setTimeout(onComplete, 500);
  //       }
  //     }
  //   };

  //   // Listen for clicks and key presses
  //   document.addEventListener('click', handleInteraction);
  //   document.addEventListener('keydown', handleInteraction);

  //   return () => {
  //     document.removeEventListener('click', handleInteraction);
  //     document.removeEventListener('keydown', handleInteraction);
  //   };
  // }, [autoDismissOnInteraction, isVisible, onComplete]);

  // Manual advance handler - only works after typing completes
  const handleAdvance = () => {
    // Block clicks while typing
    if (isTyping) {
      return;
    }
    
    setIsVisible(false);
    if (onComplete) {
      setTimeout(onComplete, 500); // Wait for exit animation
    }
  };

  // Cinematic mode - full screen with large centered avatar
  if (cinematic) {
    return (
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            onClick={requireButtonClick ? undefined : handleAdvance}
            className={`fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm ${requireButtonClick ? '' : (!isTyping ? 'cursor-pointer' : 'cursor-default')}`}
            data-radio-message="true"
          >
            {/* NAHRAN Tower Background Image */}
            <div className="absolute inset-0">
              <img 
                src={nahranTowerBg} 
                alt="NAHRAN Tower" 
                className="w-full h-full object-cover"
              />
              {/* Dark overlay for readability */}
              <div className="absolute inset-0 bg-black/60" />
              {/* Subtle cyan tint overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-cyan-900/20 via-transparent to-black/40" />
            </div>

            {/* Tech Grid Background */}
            <div className="absolute inset-0 tech-grid opacity-5" />
            
            {/* Scan Lines */}
            <motion.div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(6, 182, 212, 0.8) 3px)'
              }}
              animate={{
                backgroundPosition: ['0px 0px', '0px 100px']
              }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            />

            {/* Corner Brackets */}
            <div className="absolute top-0 left-0 w-32 h-32 border-l-4 border-t-4 border-cyan-500/50" />
            <div className="absolute top-0 right-0 w-32 h-32 border-r-4 border-t-4 border-cyan-500/50" />
            <div className="absolute bottom-0 left-0 w-32 h-32 border-l-4 border-b-4 border-cyan-500/50" />
            <div className="absolute bottom-0 right-0 w-32 h-32 border-r-4 border-b-4 border-cyan-500/50" />

            {/* Content Container */}
            <div className="relative z-10 max-w-4xl w-full px-8 text-center">
              {/* Commander Avatar - Large and Centered */}
              {showAvatar && (
                <motion.div
                  initial={{ scale: 0, rotate: -180, opacity: 0 }}
                  animate={{ scale: 1, rotate: 0, opacity: 1 }}
                  transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
                  className="mb-8 flex justify-center"
                >
                  <div className={`relative w-96 h-96 rounded-lg border-4 ${priorityColors[priority].split(' ')[0]} overflow-hidden shadow-2xl ${priorityGlowColors[priority]}`}>
                    {/* Avatar Image */}
                    <img 
                      src={commanderAvatar} 
                      alt="Commander Grey"
                      className="w-full h-full object-cover"
                      style={{ imageRendering: 'high-quality', mixBlendMode: 'lighten' }}
                    />
                    
                    {/* Holographic Scan Effect */}
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-b from-transparent via-${priority === 'critical' ? 'red' : priority === 'high' ? 'yellow' : priority === 'medium' ? 'blue' : 'cyan'}-400/30 to-transparent`}
                      animate={{ y: [-200, 200] }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                    />
                    
                    {/* Corner Brackets on Avatar */}
                    <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-white" />
                    <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-white" />
                    <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-white" />
                    <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-white" />

                    {/* Glowing outline pulse */}
                    <motion.div
                      className="absolute inset-0 rounded-lg"
                      style={{
                        boxShadow: `0 0 40px ${priority === 'critical' ? '#dc2626' : priority === 'high' ? '#eab308' : priority === 'medium' ? '#3b82f6' : '#06b6d4'}`
                      }}
                      animate={{
                        opacity: [0.5, 1, 0.5]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </div>
                </motion.div>
              )}

              {/* Message Container - Now Clickable (only after typing) */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                onClick={handleAdvance}
                className={`relative border-2 ${priorityColors[priority]} backdrop-blur-xl rounded-lg shadow-2xl overflow-hidden ${priorityGlowColors[priority]} ${!isTyping ? 'cursor-pointer hover:scale-[1.02]' : 'cursor-default'} transition-transform duration-200`}
              >
                {/* Corner Brackets */}
                <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-white/60" />
                <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-white/60" />
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-white/60" />
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-white/60" />

                {/* Header */}
                <div className={`${priorityColors[priority]} border-b-2 border-white/30 px-6 py-6 relative overflow-hidden`}>
                  {/* Animated scanlines effect */}
                  <motion.div
                    className="absolute inset-0 opacity-20"
                    style={{
                      backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)'
                    }}
                    animate={{ y: ['0%', '100%'] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                  />
                  
                  {/* Glowing scan bar */}
                  <motion.div
                    className="absolute inset-0 h-32 bg-gradient-to-b from-transparent via-white/20 to-transparent blur-sm"
                    animate={{ y: ['-100%', '200%'] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                  />
                  
                  {/* Signal interference flicker */}
                  <motion.div
                    className="absolute inset-0 bg-white"
                    animate={{ opacity: [0, 0.05, 0, 0, 0] }}
                    transition={{ duration: 0.1, repeat: Infinity, repeatDelay: 3 }}
                  />

                  {/* Content wrapper with relative positioning */}
                  <div className="relative flex items-center justify-center gap-4">
                    {/* Radio icon with enhanced effects */}
                    <motion.div
                      className="relative"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ 
                        scale: 1,
                        rotate: 0,
                      }}
                      transition={{ type: 'spring', duration: 1, bounce: 0.5 }}
                    >
                      {/* Outer glow ring */}
                      <motion.div
                        className={`absolute inset-0 rounded-full blur-xl ${priorityTextColors[priority]}`}
                        style={{ filter: 'blur(20px)' }}
                        animate={{ 
                          scale: [1, 1.5, 1],
                          opacity: [0.3, 0.6, 0.3]
                        }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                      />
                      
                      {/* Signal waves - reduced from 3 to 2 */}
                      {[0, 1].map((i) => (
                        <motion.div
                          key={i}
                          className={`absolute inset-0 rounded-full border-2 ${priorityTextColors[priority]} opacity-40`}
                          style={{ willChange: 'transform, opacity' }}
                          animate={{ 
                            scale: [1, 2.5, 2.5],
                            opacity: [0.6, 0, 0]
                          }}
                          transition={{ 
                            duration: 2.5, 
                            repeat: Infinity, 
                            delay: i * 1.2,
                            ease: 'easeOut'
                          }}
                        />
                      ))}
                      
                      {/* Radio icon */}
                      <motion.div
                        animate={{ 
                          opacity: [1, 0.5, 1],
                          scale: [1, 1.15, 1]
                        }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                      >
                        <Radio className={`w-10 h-10 ${priorityTextColors[priority]} relative z-10 drop-shadow-lg`} />
                      </motion.div>
                    </motion.div>

                    {/* Center text with dramatic entrance */}
                    <motion.div 
                      className="text-center"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3, duration: 0.6 }}
                    >
                      {/* Main transmission title */}
                      <motion.div 
                        className={`${priorityTextColors[priority]} tracking-[0.3em] font-bold text-xl mb-1 drop-shadow-lg relative`}
                        animate={{ opacity: [1, 0.8, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        {/* Text glow effect */}
                        <span className="relative">
                          <span className="absolute inset-0 blur-sm opacity-75">⚡ INCOMING TRANSMISSION</span>
                          <span className="relative">⚡ INCOMING TRANSMISSION</span>
                        </span>
                      </motion.div>
                      
                      {/* Divider line */}
                      <motion.div 
                        className={`h-px ${priorityColors[priority]} mx-auto mb-2`}
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                      />
                      
                      {/* Speaker name with typewriter effect simulation */}
                      <motion.div 
                        className="text-white text-sm tracking-[0.15em] font-mono"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7, duration: 0.5 }}
                      >
                        <span className="drop-shadow-md">{speaker}</span>
                      </motion.div>
                    </motion.div>

                    {/* Priority badge with enhanced styling */}
                    <motion.div 
                      className="relative"
                      initial={{ scale: 0, rotate: 180 }}
                      animate={{ 
                        scale: 1,
                        rotate: 0,
                      }}
                      transition={{ type: 'spring', duration: 1, bounce: 0.5, delay: 0.2 }}
                    >
                      {/* Badge glow */}
                      <motion.div
                        className={`absolute inset-0 ${priorityColors[priority]} rounded blur-md`}
                        animate={{ opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                      
                      {/* Badge content */}
                      <motion.div 
                        className={`relative text-sm ${priorityTextColors[priority]} font-mono px-4 py-2 border-2 border-current rounded backdrop-blur-sm`}
                        style={{
                          boxShadow: `0 0 20px ${priority === 'critical' ? 'rgba(239, 68, 68, 0.5)' : priority === 'high' ? 'rgba(249, 115, 22, 0.5)' : 'rgba(59, 130, 246, 0.5)'}`
                        }}
                        animate={{ 
                          opacity: [0.7, 1, 0.7],
                          scale: [1, 1.05, 1]
                        }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <div className="flex items-center gap-2">
                          <motion.div
                            className="w-2 h-2 rounded-full bg-current"
                            animate={{ opacity: [0.4, 1, 0.4] }}
                            transition={{ duration: 1, repeat: Infinity }}
                          />
                          <span className="tracking-wider">{priority.toUpperCase()}</span>
                        </div>
                      </motion.div>
                    </motion.div>
                  </div>

                  {/* Bottom edge glow */}
                  <motion.div
                    className={`absolute bottom-0 left-0 right-0 h-1 ${priorityColors[priority]} opacity-50`}
                    animate={{ opacity: [0.3, 0.7, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>

                {/* Message Content */}
                <div className="px-8 py-8 bg-black/30">
                  <p className="text-white text-2xl tracking-wide leading-relaxed">
                    {displayedText}
                    {isTyping && (
                      <motion.span
                        animate={{ opacity: [1, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                        className={`${priorityTextColors[priority]} ml-1`}
                      >
                        ▌
                      </motion.span>
                    )}
                  </p>
                </div>

                {/* Audio Waveform Indicator + Click to Advance Prompt */}
                <div className="px-8 py-4 bg-black/50 flex items-center justify-center gap-2 border-t border-white/10">
                  <span className="text-sm text-white/50 mr-3">AUDIO</span>
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      className={`w-2 bg-gradient-to-t ${priority === 'critical' ? 'from-red-500 to-red-300' : priority === 'high' ? 'from-yellow-500 to-yellow-300' : priority === 'medium' ? 'from-blue-500 to-blue-300' : 'from-cyan-500 to-cyan-300'} rounded-full`}
                      style={{ willChange: 'height' }}
                      animate={{
                        height: isTyping ? [6, Math.random() * 25 + 10, 6] : 6,
                      }}
                      transition={{
                        duration: 0.3,
                        repeat: isTyping ? Infinity : 0,
                        delay: i * 0.08,
                      }}
                    />
                  ))}
                  <motion.span 
                    className="text-sm text-white/50 ml-3"
                    animate={{ opacity: isTyping ? [0.5, 1, 0.5] : 0.5 }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                  >
                    {isTyping ? 'TRANSMITTING...' : 'COMPLETE'}
                  </motion.span>
                </div>
                
                {/* Click to Continue Prompt - Only show after typing completes */}
                {!isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="px-8 py-3 bg-black/70 border-t border-white/10 flex items-center justify-center"
                  >
                    <motion.span
                      className={`text-sm ${priorityTextColors[priority]} tracking-wider flex items-center gap-2`}
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ChevronRight className="w-4 h-4" />
                      CLICK TO CONTINUE
                      <ChevronRight className="w-4 h-4" />
                    </motion.span>
                  </motion.div>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // Normal mode - corner positioned
  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Full-screen invisible click overlay - only if requireButtonClick is false AND typing is complete */}
          {!requireButtonClick && !isTyping && (
            <div 
              onClick={handleAdvance}
              className="fixed inset-0 z-[99] cursor-pointer"
            />
          )}
          
          <motion.div
            initial={{ opacity: 0, x: -100, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -50, scale: 0.9 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="fixed top-24 left-6 z-[100] w-full max-w-3xl pointer-events-none"
            data-radio-message="true"
          >
          <div className="flex items-start gap-4">
            {/* Commander Avatar */}
            {showAvatar && (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
                className="flex-shrink-0"
              >
                <div className={`relative w-32 h-32 rounded-lg border-2 ${priorityColors[priority].split(' ')[0]} overflow-hidden shadow-2xl ${priorityGlowColors[priority]}`}>
                  {/* Avatar Image */}
                  <img 
                    src={commanderAvatar} 
                    alt="Commander Grey"
                    className="w-full h-full object-cover"
                    style={{ imageRendering: 'high-quality', mixBlendMode: 'lighten' }}
                  />
                  
                  {/* Holographic Scan Effect */}
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-b from-transparent via-${priority === 'critical' ? 'red' : priority === 'high' ? 'yellow' : priority === 'medium' ? 'blue' : 'cyan'}-400/30 to-transparent`}
                    animate={{ y: [-100, 100] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  />
                  
                  {/* Corner Brackets on Avatar */}
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-white" />
                  <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-white" />
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-white" />
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-white" />
                </div>
              </motion.div>
            )}

            {/* Message Container */}
            <div className="flex-1">
              {/* Static/Scan Line Effect */}
              <div className="absolute inset-0 overflow-hidden rounded-lg pointer-events-none opacity-20">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-b from-transparent via-white to-transparent h-[2px]"
                  animate={{ y: [0, 100] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                />
              </div>

              <div 
                onClick={requireButtonClick ? handleAdvance : undefined}
                className={`relative border-2 ${priorityColors[priority]} backdrop-blur-xl rounded-lg shadow-2xl overflow-hidden ${priorityGlowColors[priority]} ${requireButtonClick ? `pointer-events-auto ${!isTyping ? 'cursor-pointer hover:scale-[1.02]' : 'cursor-default'} transition-transform` : ''}`}
              >
                {/* Corner Brackets */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-white/60" />
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-white/60" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-white/60" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-white/60" />

                {/* Header */}
                <div className={`${priorityColors[priority]} border-b-2 border-white/30 px-5 py-3 flex items-center gap-3`}>
                  <motion.div
                    animate={{ 
                      opacity: [1, 0.3, 1],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <Radio className={`w-6 h-6 ${priorityTextColors[priority]}`} />
                  </motion.div>
                  <div className="flex-1">
                    <div className={`${priorityTextColors[priority]} tracking-wider font-bold text-sm`}>
                      ⚡ INCOMING TRANSMISSION
                    </div>
                    <div className="text-white/80 text-xs tracking-wide mt-0.5">
                      {speaker}
                    </div>
                  </div>
                  <motion.div 
                    className={`text-xs ${priorityTextColors[priority]} font-mono px-2 py-1 border border-current rounded`}
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    {priority.toUpperCase()}
                  </motion.div>
                </div>

                {/* Message Content */}
                <div className="px-6 py-5 bg-black/30">
                  <p className="text-white text-lg tracking-wide leading-relaxed">
                    {displayedText}
                    {isTyping && (
                      <motion.span
                        animate={{ opacity: [1, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                        className={`${priorityTextColors[priority]} ml-1`}
                      >
                        ▌
                      </motion.span>
                    )}
                  </p>
                </div>

                {/* Audio Waveform Indicator */}
                <div className="px-6 py-3 bg-black/50 flex items-center gap-1 border-t border-white/10">
                  <span className="text-xs text-white/50 mr-3">AUDIO</span>
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      className={`w-1.5 bg-gradient-to-t ${priority === 'critical' ? 'from-red-500 to-red-300' : priority === 'high' ? 'from-yellow-500 to-yellow-300' : priority === 'medium' ? 'from-blue-500 to-blue-300' : 'from-cyan-500 to-cyan-300'} rounded-full`}
                      style={{ willChange: 'height' }}
                      animate={{
                        height: isTyping ? [4, Math.random() * 20 + 8, 4] : 4,
                      }}
                      transition={{
                        duration: 0.3,
                        repeat: isTyping ? Infinity : 0,
                        delay: i * 0.08,
                      }}
                    />
                  ))}
                  <motion.span 
                    className="text-xs text-white/50 ml-3"
                    animate={{ opacity: isTyping ? [0.5, 1, 0.5] : 0.5 }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                  >
                    {isTyping ? 'TRANSMITTING...' : 'COMPLETE'}
                  </motion.span>
                </div>
                
                {/* Click to Continue Prompt - Only show after typing completes */}
                {!isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="px-6 py-2 bg-black/70 border-t border-white/10 flex items-center justify-center"
                  >
                    <motion.span
                      className={`text-xs ${priorityTextColors[priority]} tracking-wider flex items-center gap-2`}
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ChevronRight className="w-3 h-3" />
                      CLICK TO CONTINUE
                      <ChevronRight className="w-3 h-3" />
                    </motion.span>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Memoize to prevent unnecessary re-renders
export const RadioMessage = memo(RadioMessageComponent);

// Queue System for Multiple Messages
interface QueuedMessage {
  id: string;
  speaker: string;
  message: string;
  duration?: number;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  showAvatar?: boolean;
  cinematic?: boolean;
  autoDismissOnInteraction?: boolean;
  requireButtonClick?: boolean;
}

interface RadioMessageQueueProps {
  messages: QueuedMessage[];
  onComplete?: () => void;
}

export function RadioMessageQueue({ messages, onComplete }: RadioMessageQueueProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const onCompleteRef = useRef(onComplete);

  // Keep ref in sync with latest onComplete
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // Reset state when messages array reference changes
  useEffect(() => {
    // Only reset if we have actual messages
    if (messages.length > 0) {
      setCurrentIndex(0);
      setIsComplete(false);
    }
  }, [messages]);

  // Handle out-of-bounds currentMessage in useEffect to avoid calling onComplete during render
  useEffect(() => {
    if (messages.length === 0 || isComplete) {
      return;
    }

    // If currentIndex is out of bounds, complete the queue
    if (currentIndex >= messages.length) {
      console.error('RadioMessageQueue: Current index out of bounds', { currentIndex, messagesLength: messages.length });
      setIsComplete(true);
      if (onCompleteRef.current) {
        setTimeout(() => {
          onCompleteRef.current?.();
        }, 100);
      }
    }
  }, [currentIndex, messages.length, isComplete]);

  const handleMessageComplete = () => {
    // Use functional update to avoid stale closure issues
    setCurrentIndex(prevIndex => {
      // Safety check: ensure we're within bounds
      if (prevIndex >= messages.length) {
        console.error('RadioMessageQueue: Index out of bounds in handleMessageComplete', { prevIndex, messagesLength: messages.length });
        setIsComplete(true);
        if (onCompleteRef.current) {
          setTimeout(() => onCompleteRef.current?.(), 100);
        }
        return prevIndex;
      }
      
      if (prevIndex < messages.length - 1) {
        // Not the last message - advance to next after delay
        const nextIndex = prevIndex + 1;
        setTimeout(() => {
          setCurrentIndex(nextIndex);
        }, 500);
        return prevIndex;
      } else {
        // Last message completed
        setIsComplete(true);
        if (onCompleteRef.current) {
          // Call onComplete immediately when last message finishes
          setTimeout(() => {
            onCompleteRef.current?.();
          }, 100);
        }
        return prevIndex;
      }
    });
  };

  if (isComplete || messages.length === 0) {
    return null;
  }

  const currentMessage = messages[currentIndex];

  // Safety check - ensure message exists, but don't call onComplete here (will be handled in useEffect)
  if (!currentMessage) {
    return null;
  }

  return (
    <RadioMessage
      key={currentMessage.id}
      speaker={currentMessage.speaker}
      message={currentMessage.message}
      duration={currentMessage.duration || 5000}
      priority={currentMessage.priority}
      showAvatar={currentMessage.showAvatar}
      cinematic={currentMessage.cinematic}
      autoDismissOnInteraction={currentMessage.autoDismissOnInteraction}
      requireButtonClick={currentMessage.requireButtonClick}
      onComplete={handleMessageComplete}
    />
  );
}
