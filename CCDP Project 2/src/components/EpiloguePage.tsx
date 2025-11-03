import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { SkipForward } from 'lucide-react';
import { Button } from './ui/button';
import { AchievementBadge } from './AchievementBadge';
import { achievements } from '../data/achievements';

interface EpiloguePageProps {
  onComplete: () => void;
  unlockedAchievements?: string[];
}

export function EpiloguePage({ onComplete, unlockedAchievements = [] }: EpiloguePageProps) {
  const [currentLine, setCurrentLine] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [showMissionComplete, setShowMissionComplete] = useState(false);
  const [showExitButton, setShowExitButton] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [skipTypewriter, setSkipTypewriter] = useState(false);

  const missionCompleteText = "Your mission… is ACCOMPLISHED";
  
  const lines = [
    "You have successfully completed a critical mission Simon!",
    "Not only that, but you've also found your missing sister, Elena and saved several other innocent souls.",
    "Agent Simon Cross, your courage will be honored across Heisenberg.",
    "Not just as a hero... but as a legend!",
    "Are you ready for the next mission?"
  ];

  useEffect(() => {
    if (currentLine < lines.length) {
      const timer = setTimeout(() => {
        if (currentChar < lines[currentLine].length) {
          setCurrentChar(currentChar + 1);
        } else {
          setCurrentLine(currentLine + 1);
          setCurrentChar(0);
        }
      }, 50);

      return () => clearTimeout(timer);
    } else {
      // CHANGED: Show Mission Complete immediately after epilogue finishes
      setShowMissionComplete(true);
    }
  }, [currentLine, currentChar, lines]);

  useEffect(() => {
    if (showMissionComplete) {
      const timer = setTimeout(() => {
        setShowAchievements(true);
      }, missionCompleteText.length * 50 + 500); // Show achievements first
      return () => clearTimeout(timer);
    }
  }, [showMissionComplete, missionCompleteText.length]);

  useEffect(() => {
    if (showAchievements) {
      const timer = setTimeout(() => {
        setShowExitButton(true);
      }, 2000); // Show exit button after achievements
      return () => clearTimeout(timer);
    }
  }, [showAchievements]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8 relative overflow-hidden">
      <div className="absolute inset-0 tech-grid opacity-10"></div>
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black opacity-60"></div>

      <div className="mb-16 relative z-10">
        <h1 
          className="text-5xl font-bold text-red-500 mb-8 text-center red-glow-title glitch"
          style={{ 
            fontFamily: 'JetBrains Mono, monospace',
            textShadow: '0 0 20px rgba(220, 38, 38, 0.8), 0 0 40px rgba(220, 38, 38, 0.4)'
          }}
        >
          EPILOGUE
        </h1>
      </div>

      <div className="max-w-5xl text-center space-y-8 relative z-10">
        {lines.map((line, lineIndex) => (
          <div
            key={lineIndex}
            className={`text-xl leading-relaxed transition-all duration-1000 ${
              lineIndex < currentLine ? 'text-white opacity-100' : 
              lineIndex === currentLine ? 'text-white opacity-100' : 'opacity-0' // CHANGED: Removed grey text
            }`}
            style={{ 
              fontFamily: 'JetBrains Mono, monospace',
              minHeight: '3rem',
              textShadow: lineIndex <= currentLine ? '0 0 10px rgba(255, 255, 255, 0.3)' : 'none',
              letterSpacing: '0.05em'
            }}
          >
            {lineIndex < currentLine ? (
              <span className="animate-fade-in">{line}</span>
            ) : lineIndex === currentLine ? (
              <span>
                {line.slice(0, currentChar)}
                <span className="animate-pulse text-cyan-400 font-bold">▌</span>
              </span>
            ) : null /* CHANGED: No placeholder grey text */}
          </div>
        ))}
      </div>

      {showMissionComplete && (
        <div className="mt-20 text-center relative z-10">
          <div 
            className="text-3xl font-bold text-green-400 mb-12 relative"
            style={{ 
              fontFamily: 'JetBrains Mono, monospace',
              textShadow: '0 0 20px rgba(34, 197, 94, 0.8), 0 0 40px rgba(34, 197, 94, 0.4)'
            }}
          >
            <div className="absolute inset-0 bg-green-400/10 blur-xl rounded-lg"></div>
            <div className="relative">
              <TypewriterText text={missionCompleteText} skipAnimation={skipTypewriter} />
            </div>
          </div>

          {showAchievements && (
            <div className="mb-12">
              <div className="text-2xl font-bold text-cyan-400 mb-8" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                ACHIEVEMENTS EARNED
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                {achievements.map((achievement, index) => (
                  <AchievementBadge
                    key={achievement.id}
                    achievement={achievement}
                    unlocked={unlockedAchievements.includes(achievement.id)}
                    size="medium"
                    showLabel={true}
                    delay={index * 0.2}
                  />
                ))}
              </div>
              <div className="mt-8 text-lg text-gray-400" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                {unlockedAchievements.length} / {achievements.length} UNLOCKED
              </div>
            </div>
          )}
          
          {showExitButton && (
            <div className="space-y-6 flex flex-col items-center"> {/* CHANGED: Center aligned */}
              <div className="flex justify-center space-x-8 text-sm mb-8">
                <div className="text-green-400">
                  <span className="inline-block w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></span>
                  OBJECTIVE COMPLETED
                </div>
                <div className="text-blue-400">
                  <span className="inline-block w-2 h-2 bg-blue-400 rounded-full animate-pulse mr-2"></span>
                  DATA SECURED
                </div>
                <div className="text-red-400">
                  <span className="inline-block w-2 h-2 bg-red-400 rounded-full animate-pulse mr-2"></span>
                  CASUALTY CONFIRMED
                </div>
              </div>
              
              <Button
                onClick={onComplete}
                className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white px-12 py-4 text-xl font-bold transition-all duration-500 transform hover:scale-110 border border-green-400/50 shadow-lg hover:shadow-green-500/25"
                style={{ 
                  fontFamily: 'JetBrains Mono, monospace',
                  textShadow: '0 0 10px rgba(255, 255, 255, 0.5)'
                }}
              >
                Press to Restart
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Skip Button */}
      {!showExitButton && (
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1 }}
          onClick={() => {
            // Complete all typewriter lines
            setCurrentLine(lines.length);
            setCurrentChar(0);
            // Show mission complete
            setShowMissionComplete(true);
            // Skip typewriter effect on mission complete text
            setSkipTypewriter(true);
            // Show achievements immediately
            setShowAchievements(true);
            // Show exit button immediately
            setShowExitButton(true);
          }}
          className="fixed bottom-8 right-8 z-50 px-6 py-3 bg-red-600/80 hover:bg-red-500 border-2 border-red-400 rounded-lg backdrop-blur-sm transition-all duration-300 flex items-center gap-2 group"
        >
          <span className="text-white font-bold">SKIP</span>
          <SkipForward className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
        </motion.button>
      )}
    </div>
  );
}

function TypewriterText({ text, skipAnimation = false }: { text: string; skipAnimation?: boolean }) {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // If skip is enabled, show all text immediately
    if (skipAnimation) {
      setDisplayText(text);
      setCurrentIndex(text.length);
      return;
    }

    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(text.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, 50);

      return () => clearTimeout(timer);
    }
  }, [currentIndex, text, skipAnimation]);

  return (
    <span>
      {displayText}
      {currentIndex < text.length && !skipAnimation && <span className="animate-pulse">|</span>}
    </span>
  );
}
