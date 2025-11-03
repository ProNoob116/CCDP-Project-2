import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calculator, SkipForward, Brain } from 'lucide-react';
import accountingRoomImage from 'figma:asset/5ec177d90f158c4455958a606aa647ac96f14ac5.png';
import { EvidenceScanner } from '../EvidenceScanner';

interface Floor4AccountingProps {
  onComplete: () => void;
  onFail: () => void;
  onCollectLog?: (logId: string) => void;
  collectedLogs?: string[];
}

interface AccountingProblem {
  num1: number;
  num2: number;
  operator: '+' | '-' | '×' | '÷';
  answer: number;
  display: string;
}

export function Floor4Accounting({ onComplete, onFail, onCollectLog, collectedLogs = [] }: Floor4AccountingProps) {
  const [problem, setProblem] = useState<AccountingProblem | null>(null);
  const [calculatorDisplay, setCalculatorDisplay] = useState('0');
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameStarted, setGameStarted] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [aiVoiceLine, setAiVoiceLine] = useState<string | null>(null);
  const [messageShown, setMessageShown] = useState(false);

  // AI Voice Lines
  const voiceLines = {
    start: "FINANCIAL RECORDS ENCRYPTED - SOLVE CALCULATION",
    correct: "CALCULATION CORRECT - ACCESS GRANTED",
    incorrect: "INCORRECT - SYSTEM LOCKED",
    timeWarning: "WARNING: TIME RUNNING OUT",
    complete: "ACCOUNTING RECORDS ACCESSED"
  };

  useEffect(() => {
    // Show initial voice line only once on mount - prevent duplicates
    if (!messageShown) {
      setMessageShown(true);
      const timer = setTimeout(() => {
        setAiVoiceLine(voiceLines.start);
        setTimeout(() => setAiVoiceLine(null), 3000);
      }, 500); // Small delay to prevent conflicts with other systems
      return () => clearTimeout(timer);
    }
  }, []); // Empty dependency array ensures this only runs once on mount

  // Generate a simple problem
  const generateProblem = (): AccountingProblem => {
    const operationType = Math.floor(Math.random() * 4);
    
    if (operationType === 0) {
      // 1 digit × 1 digit
      const num1 = Math.floor(Math.random() * 9) + 1;
      const num2 = Math.floor(Math.random() * 9) + 1;
      return {
        num1,
        num2,
        operator: '×',
        answer: num1 * num2,
        display: `${num1} × ${num2}`,
      };
    } else if (operationType === 1) {
      // Division (ensure full divisibility)
      const num2 = Math.floor(Math.random() * 9) + 1;
      const quotient = Math.floor(Math.random() * 9) + 1;
      const num1 = num2 * quotient;
      return {
        num1,
        num2,
        operator: '÷',
        answer: quotient,
        display: `${num1} ÷ ${num2}`,
      };
    } else if (operationType === 2) {
      // Addition
      const num1 = Math.floor(Math.random() * 90) + 10;
      const num2 = Math.floor(Math.random() * 90) + 10;
      return {
        num1,
        num2,
        operator: '+',
        answer: num1 + num2,
        display: `${num1} + ${num2}`,
      };
    } else {
      // Subtraction
      const num2 = Math.floor(Math.random() * 50) + 10;
      const num1 = num2 + Math.floor(Math.random() * 50) + 10;
      return {
        num1,
        num2,
        operator: '-',
        answer: num1 - num2,
        display: `${num1} - ${num2}`,
      };
    }
  };

  // Initialize problem
  useEffect(() => {
    setProblem(generateProblem());
  }, []);

  // Timer
  useEffect(() => {
    if (!gameStarted || timeLeft <= 0 || showSuccess) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        const newTime = prev - 1;
        if (newTime === 5) {
          setAiVoiceLine(voiceLines.timeWarning);
          setTimeout(() => setAiVoiceLine(null), 2000);
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStarted, timeLeft, showSuccess]);

  // Handle time out
  useEffect(() => {
    if (gameStarted && timeLeft <= 0 && !showSuccess) {
      onFail();
    }
  }, [timeLeft, gameStarted, showSuccess, onFail]);

  const handleNumberClick = (num: string) => {
    if (!gameStarted) {
      setGameStarted(true);
    }

    setCalculatorDisplay(prev => {
      if (prev === '0' || prev === 'ERROR') return num;
      if (prev.length >= 10) return prev;
      return prev + num;
    });
  };

  const handleClear = () => {
    setCalculatorDisplay('0');
  };

  const handleEquals = () => {
    if (!problem) return;
    
    setIsCalculating(true);
    const userAnswer = parseInt(calculatorDisplay);
    
    setTimeout(() => {
      if (userAnswer === problem.answer) {
        setShowSuccess(true);
        setGameStarted(false);
        setAiVoiceLine(voiceLines.complete);
        setTimeout(() => {
          onComplete();
        }, 3000);
      } else {
        setShowError(true);
        setCalculatorDisplay('ERROR');
        setAiVoiceLine(voiceLines.incorrect);
        setTimeout(() => {
          setShowError(false);
          setCalculatorDisplay('0');
          setAiVoiceLine(null);
          onFail();
        }, 2000);
      }
      setIsCalculating(false);
    }, 500);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={accountingRoomImage}
          alt="Accounting Room"
          className="w-full h-full object-cover"
          style={{ filter: 'brightness(0.5) blur(1px)' }}
        />
        {/* Dark overlay with yellow tint */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-yellow-950/40 to-black/70" />
      </div>

      {/* Animated particles overlay - Optimized */}
      <div className="absolute inset-0 z-10">
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-yellow-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 1, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
        ))}

        {/* Digital grid */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'linear-gradient(rgba(234, 179, 8, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(234, 179, 8, 0.1) 1px, transparent 1px)',
          backgroundSize: '30px 30px'
        }} />
      </div>

      {/* AI Voice Line Display */}
      <AnimatePresence>
        {aiVoiceLine && (
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className="fixed top-32 left-1/2 -translate-x-1/2 z-50"
          >
            <div className="bg-yellow-950/95 border-2 border-yellow-500 rounded-xl px-8 py-4 backdrop-blur-md shadow-2xl shadow-yellow-500/30">
              <motion.div
                animate={{ opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-yellow-400 text-lg font-bold tracking-wider flex items-center gap-2"
              >
                <Brain className="w-5 h-5" />
                SECURITY AI: {aiVoiceLine}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 flex flex-col items-center min-h-screen p-8 pt-32 pb-16">
        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12 bg-black/60 backdrop-blur-sm border border-yellow-500/30 rounded-lg p-6 max-w-3xl w-full space-y-3"
        >
          <div className="text-yellow-300 text-xl tracking-wider">
            Solve the financial calculation to access records
          </div>
          <div className="text-orange-400 text-sm flex items-center justify-center gap-2">
            <Calculator className="w-4 h-4" />
            Use the calculator to enter your answer
          </div>
        </motion.div>

        {/* Financial Calculator Interface */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="relative w-full max-w-2xl"
        >
          {/* Main Container */}
          <div className="relative bg-gradient-to-b from-yellow-950/30 to-black/60 border-2 border-yellow-500/40 rounded-2xl p-12 backdrop-blur-sm shadow-2xl shadow-yellow-500/20 overflow-hidden">
            
            {/* Corner brackets */}
            <div className="absolute top-4 left-4 w-16 h-16 border-t-2 border-l-2 border-yellow-400"></div>
            <div className="absolute top-4 right-4 w-16 h-16 border-t-2 border-r-2 border-yellow-400"></div>
            <div className="absolute bottom-4 left-4 w-16 h-16 border-b-2 border-l-2 border-yellow-400"></div>
            <div className="absolute bottom-4 right-4 w-16 h-16 border-b-2 border-r-2 border-yellow-400"></div>

            {/* Calculator Header */}
            <div className="text-center mb-8">
              <Calculator className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
              <div className="text-yellow-400 text-sm tracking-wider">ENCRYPTED FINANCIAL TERMINAL</div>
            </div>

            {/* Timer Display */}
            {gameStarted && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-6"
              >
                <div className={`inline-block px-8 py-3 rounded-xl border-2 ${
                  timeLeft <= 5 
                    ? 'bg-red-600/80 border-red-400 animate-pulse' 
                    : 'bg-yellow-900/80 border-yellow-500/50'
                }`}>
                  <div className="text-sm tracking-wider mb-1 text-yellow-300">
                    TIME REMAINING
                  </div>
                  <motion.div 
                    className={`text-3xl font-bold ${timeLeft <= 5 ? 'text-white' : 'text-yellow-400'}`}
                    animate={timeLeft <= 5 ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  >
                    {timeLeft}s
                  </motion.div>
                </div>
              </motion.div>
            )}

            {/* Problem Display */}
            {problem && (
              <div className="mb-6 bg-black/50 border-2 border-yellow-500/30 rounded-xl p-6">
                <div className="text-center">
                  <div className="text-sm text-yellow-300 mb-2 tracking-wider">SOLVE THIS CALCULATION</div>
                  <div className="text-4xl font-bold text-yellow-400">
                    {problem.display}
                  </div>
                  <div className="text-xs text-gray-400 mt-2">Enter answer below</div>
                </div>
              </div>
            )}

            {/* Calculator Display */}
            <div className="mb-6">
              <div className={`bg-black border-2 rounded-lg p-6 text-right ${
                showError 
                  ? 'border-red-500 animate-pulse' 
                  : 'border-yellow-500/50'
              }`}>
                <motion.div 
                  className={`text-5xl font-bold ${
                    showError ? 'text-red-400' : 'text-yellow-400'
                  }`}
                  animate={isCalculating ? { opacity: [1, 0.5, 1] } : {}}
                  transition={{ duration: 0.3, repeat: isCalculating ? Infinity : 0 }}
                >
                  {calculatorDisplay}
                </motion.div>
              </div>
            </div>

            {/* Calculator Buttons */}
            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <motion.button
                  key={num}
                  onClick={() => handleNumberClick(num.toString())}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-yellow-600/20 hover:bg-yellow-600/40 border-2 border-yellow-500/50 rounded-lg py-4 text-2xl font-bold text-yellow-400 transition-all duration-200 flex items-center justify-center"
                >
                  {num}
                </motion.button>
              ))}
              
              <motion.button
                onClick={handleClear}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-red-600/20 hover:bg-red-600/40 border-2 border-red-500/50 rounded-lg py-4 text-xl font-bold text-red-400 transition-all duration-200 flex items-center justify-center"
              >
                C
              </motion.button>
              
              <motion.button
                onClick={() => handleNumberClick('0')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-yellow-600/20 hover:bg-yellow-600/40 border-2 border-yellow-500/50 rounded-lg py-4 text-2xl font-bold text-yellow-400 transition-all duration-200 flex items-center justify-center"
              >
                0
              </motion.button>
              
              <motion.button
                onClick={handleEquals}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={isCalculating || calculatorDisplay === '0' || calculatorDisplay === 'ERROR'}
                className="bg-green-600/20 hover:bg-green-600/40 border-2 border-green-500/50 rounded-lg py-4 text-sm font-bold text-green-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                ENTER
              </motion.button>
            </div>

            {/* Status indicator */}
            <div className="mt-6 text-center">
              <div className={`inline-block px-6 py-3 rounded-lg border-2 ${
                showSuccess
                  ? 'bg-green-900/80 border-green-500/50 text-green-400'
                  : showError
                  ? 'bg-red-900/80 border-red-600/50 text-red-400'
                  : gameStarted
                  ? 'bg-yellow-900/80 border-yellow-600/50 text-yellow-400'
                  : 'bg-gray-900/80 border-gray-600/50 text-gray-400'
              }`}>
                <div className="text-sm tracking-wider">
                  STATUS: {
                    showSuccess 
                      ? 'ACCESS GRANTED' 
                      : showError 
                      ? 'INCORRECT ANSWER'
                      : gameStarted 
                      ? 'AWAITING INPUT'
                      : 'ENTER NUMBERS TO BEGIN'
                  }
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Evidence Scanner - Desk Nameplate - Strategically placed near Elena's desk (left side) */}
      <EvidenceScanner
        objectName="DESK NAMEPLATE"
        caption="E. Cross - Junior Analyst. They never cleaned out her desk."
        icon="📛"
        position="left"
        logId="f4_desk_nameplate"
        onScanned={() => onCollectLog?.('f4_desk_nameplate')}
        isCollected={collectedLogs?.includes('f4_desk_nameplate')}
      />

      {/* Skip Button */}
      <motion.button
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1 }}
        onClick={() => onComplete()}
        className="fixed bottom-8 right-8 z-40 px-6 py-3 bg-yellow-600/80 hover:bg-yellow-500 border-2 border-yellow-400 rounded-lg backdrop-blur-sm transition-all duration-300 flex items-center gap-2 group"
      >
        <span className="text-white font-bold">SKIP</span>
        <SkipForward className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
      </motion.button>

      {/* Success Overlay */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50"
          >
            <motion.div
              className="absolute inset-0 bg-green-500"
              animate={{ opacity: [0, 0.4, 0] }}
              transition={{ duration: 0.5, times: [0, 0.3, 1] }}
            />
            
            <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-md">
              <div className="text-center space-y-6">
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
                >
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                      textShadow: [
                        '0 0 20px rgba(34, 197, 94, 0.5)',
                        '0 0 50px rgba(34, 197, 94, 1)',
                        '0 0 20px rgba(34, 197, 94, 0.5)'
                      ]
                    }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="text-8xl font-bold text-green-400 mb-6"
                  >
                    CALCULATION CORRECT!
                  </motion.div>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="text-green-300 text-3xl"
                  >
                    Financial records accessed
                  </motion.p>
                </motion.div>

                {/* Success particles */}
                {Array.from({ length: 25 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-green-400 rounded-full"
                    style={{ left: '50%', top: '50%' }}
                    animate={{
                      x: (Math.random() - 0.5) * 800,
                      y: (Math.random() - 0.5) * 800,
                      opacity: [1, 0],
                      scale: [1, 0]
                    }}
                    transition={{
                      duration: 1.5,
                      delay: 0.3 + Math.random() * 0.3,
                      ease: 'easeOut'
                    }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Evidence Scanner - Financial Records - Strategically placed near right accounting terminal */}
      <EvidenceScanner
        objectName="CLASSIFIED LEDGER"
        caption="Project ECLIPSE - Budget: ████████ - Status: TERMINATED"
        icon="📊"
        position="right"
        logId="f4_financial_records"
        onScanned={() => onCollectLog?.('f4_financial_records')}
        isCollected={collectedLogs?.includes('f4_financial_records')}
      />
    </div>
  );
}
