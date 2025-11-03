import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Brain, Play, RotateCcw, CheckCircle, XCircle } from 'lucide-react';
import { ElenaRecoveryCutscene } from '../ElenaRecoveryCutscene';
import sleepingPodsImage from 'figma:asset/077aa166755ee6166b5a4bc44630057f48f84287.png';
import { EvidenceScanner } from '../EvidenceScanner';

interface Floor2SleepingPodsProps {
  onComplete: () => void;
  onFail: () => void;
  onCollectLog?: (logId: string) => void;
  collectedLogs?: string[];
}

type GameState = 'instructions' | 'showing' | 'input' | 'checking' | 'success' | 'cutscene';

export function Floor2SleepingPods({ onComplete, onFail, onCollectLog, collectedLogs = [] }: Floor2SleepingPodsProps) {
  const [gameState, setGameState] = useState<GameState>('instructions');
  const [sequence, setSequence] = useState<number[]>([]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [currentShowIndex, setCurrentShowIndex] = useState(-1);
  
  // FIXED: Node positions are now constant and never change
  const nodes = [
    { id: 0, label: 'A', x: 50, y: 20, color: 'from-blue-500 to-cyan-500' },
    { id: 1, label: 'B', x: 80, y: 50, color: 'from-green-500 to-emerald-500' },
    { id: 2, label: 'C', x: 50, y: 80, color: 'from-yellow-500 to-orange-500' },
    { id: 3, label: 'D', x: 20, y: 50, color: 'from-purple-500 to-pink-500' },
  ];

  // Generate ONE simple sequence (3 nodes) - ONLY ONCE
  const generateSequence = () => {
    const newSeq: number[] = [];
    for (let i = 0; i < 3; i++) {
      newSeq.push(Math.floor(Math.random() * 4));
    }
    return newSeq;
  };

  // Start the game - generates sequence only if empty
  const startGame = () => {
    if (sequence.length === 0) {
      const newSeq = generateSequence();
      setSequence(newSeq);
    }
    setUserSequence([]);
    setCurrentShowIndex(-1);
    setGameState('showing');
  };

  // Play sequence animation with clear blinks between each node
  useEffect(() => {
    if (gameState === 'showing' && sequence.length > 0) {
      let step = 0;
      const interval = setInterval(() => {
        // Alternate between showing a node (even steps) and hiding (odd steps)
        if (step % 2 === 0) {
          // Show the node at index step/2
          const nodeIndex = step / 2;
          if (nodeIndex < sequence.length) {
            setCurrentShowIndex(nodeIndex);
          } else {
            // Finished showing all nodes
            clearInterval(interval);
            setTimeout(() => {
              setCurrentShowIndex(-1);
              setGameState('input');
            }, 500);
          }
        } else {
          // Hide all nodes (brief off period)
          setCurrentShowIndex(-1);
        }
        step++;
      }, 600); // 600ms per step (blink on for 600ms, off for 600ms = 1.2s total per node)

      return () => clearInterval(interval);
    }
  }, [gameState, sequence.length]);

  // Handle node click
  const handleNodeClick = (nodeId: number) => {
    if (gameState !== 'input') return;

    const newUserSeq = [...userSequence, nodeId];
    setUserSequence(newUserSeq);
    const currentIndex = newUserSeq.length - 1;

    // Check if correct
    if (sequence[currentIndex] === nodeId) {
      // Correct!
      if (newUserSeq.length === sequence.length) {
        // Pattern complete!
        setGameState('success');
        setTimeout(() => {
          setGameState('cutscene');
        }, 2000);
      }
    } else {
      // Wrong! Replay SAME sequence
      setGameState('checking');
      setTimeout(() => {
        setUserSequence([]);
        // FIXED: Replay the SAME sequence, don't generate new one
        setTimeout(() => {
          setGameState('showing');
        }, 1000);
      }, 1000);
    }
  };

  // Replay the current sequence
  const replaySequence = () => {
    setUserSequence([]);
    setCurrentShowIndex(-1);
    setGameState('showing');
  };

  if (gameState === 'cutscene') {
    return <ElenaRecoveryCutscene onComplete={onComplete} />;
  }

  return (
    <div 
      className="relative w-full h-screen overflow-hidden"
      style={{
        backgroundImage: `url(${sleepingPodsImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8 pt-32">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-cyan-400 mb-2 tracking-wider">
            NEURAL PATTERN SCANNER
          </h1>
          <div className="text-gray-400 text-sm tracking-wide">
            Floor 2 - Sleeping Pods • Elena's Pod Access
          </div>
        </motion.div>

        {/* Instructions screen */}
        {gameState === 'instructions' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900/95 border-2 border-cyan-500 rounded-2xl p-8 max-w-2xl backdrop-blur-md"
          >
            <div className="flex items-center gap-4 mb-6">
              <Brain className="w-12 h-12 text-cyan-400" />
              <div>
                <h2 className="text-2xl font-bold text-white">Memory Pattern Recognition</h2>
                <p className="text-cyan-400 text-sm">Neural security protocol active</p>
              </div>
            </div>

            <div className="space-y-4 mb-8 text-gray-300">
              <div className="flex items-start gap-3">
                <div className="bg-cyan-500 text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                  1
                </div>
                <div>
                  <div className="font-bold text-white">Watch the Pattern</div>
                  <div className="text-sm">3 nodes will light up in sequence. Pay close attention!</div>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-cyan-500 text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                  2
                </div>
                <div>
                  <div className="font-bold text-white">Repeat the Pattern</div>
                  <div className="text-sm">Click the nodes in the exact same order.</div>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-cyan-500 text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                  3
                </div>
                <div>
                  <div className="font-bold text-white">Complete the Puzzle</div>
                  <div className="text-sm">Get it right to access Elena's pod.</div>
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startGame}
              className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-8 py-4 rounded-xl font-bold text-xl transition-all flex items-center justify-center gap-3"
            >
              <Play className="w-6 h-6" />
              BEGIN NEURAL SCAN
            </motion.button>
          </motion.div>
        )}

        {/* Game screen */}
        {(gameState === 'showing' || gameState === 'input' || gameState === 'checking' || gameState === 'success') && (
          <>
            {/* Status bar */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-900/90 border-2 border-cyan-500/50 rounded-xl px-6 py-4 mb-8 flex items-center justify-between gap-8 backdrop-blur-md"
            >
              <div>
                <div className="text-gray-400 text-xs mb-1">PATTERN</div>
                <div className="text-2xl font-bold text-cyan-400">3 nodes</div>
              </div>
              <div>
                <div className="text-gray-400 text-xs mb-1">STATUS</div>
                <div className={`text-lg font-bold ${
                  gameState === 'showing' ? 'text-yellow-400' : 
                  gameState === 'input' ? 'text-green-400' : 
                  gameState === 'checking' ? 'text-red-400' : 'text-cyan-400'
                }`}>
                  {gameState === 'showing' ? 'WATCH' :
                   gameState === 'input' ? 'YOUR TURN' :
                   gameState === 'checking' ? '❌ INCORRECT' : '✅ COMPLETE'}
                </div>
              </div>
            </motion.div>

            {/* Progress indicator */}
            {gameState === 'input' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-6"
              >
                <div className="flex items-center gap-2">
                  <div className="text-gray-400 text-sm">Your progress:</div>
                  {sequence.map((_, index) => (
                    <div
                      key={index}
                      className={`w-4 h-4 rounded-full border-2 transition-all ${
                        index < userSequence.length
                          ? userSequence[index] === sequence[index]
                            ? 'bg-green-500 border-green-400'
                            : 'bg-red-500 border-red-400'
                          : 'bg-gray-700 border-gray-600'
                      }`}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {/* Node grid - FIXED positions never change */}
            <div className="relative w-[500px] h-[500px] mb-8">
              {/* Connection lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <line
                  x1="50%" y1="20%" x2="80%" y2="50%"
                  stroke="#3b82f6"
                  strokeWidth="2"
                  strokeOpacity="0.2"
                  strokeDasharray="5,5"
                />
                <line
                  x1="80%" y1="50%" x2="50%" y2="80%"
                  stroke="#3b82f6"
                  strokeWidth="2"
                  strokeOpacity="0.2"
                  strokeDasharray="5,5"
                />
                <line
                  x1="50%" y1="80%" x2="20%" y2="50%"
                  stroke="#3b82f6"
                  strokeWidth="2"
                  strokeOpacity="0.2"
                  strokeDasharray="5,5"
                />
                <line
                  x1="20%" y1="50%" x2="50%" y2="20%"
                  stroke="#3b82f6"
                  strokeWidth="2"
                  strokeOpacity="0.2"
                  strokeDasharray="5,5"
                />
              </svg>

              {/* Nodes - positions are constant */}
              {nodes.map((node) => {
                const isActive = gameState === 'showing' && currentShowIndex >= 0 && 
                                 sequence[currentShowIndex] === node.id;
                const isLastClicked = userSequence.length > 0 && 
                                     userSequence[userSequence.length - 1] === node.id;
                
                return (
                  <motion.button
                    key={node.id}
                    onClick={() => handleNodeClick(node.id)}
                    disabled={gameState !== 'input'}
                    className="absolute cursor-pointer"
                    style={{
                      left: `${node.x}%`,
                      top: `${node.y}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                  >
                    {/* Glow effect when active */}
                    {isActive && (
                      <motion.div
                        className={`absolute inset-0 rounded-full bg-gradient-to-r ${node.color} blur-2xl`}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 2, opacity: 0.8 }}
                        exit={{ scale: 0, opacity: 0 }}
                      />
                    )}

                    {/* Node - FIXED position */}
                    <div
                      className={`relative w-24 h-24 rounded-full border-4 flex items-center justify-center transition-all ${
                        isActive
                          ? `bg-gradient-to-br ${node.color} border-white shadow-2xl`
                          : isLastClicked
                          ? 'bg-gray-700 border-cyan-400'
                          : gameState === 'input'
                          ? 'bg-gray-800 border-gray-600 hover:border-cyan-500 hover:shadow-lg hover:shadow-cyan-500/30'
                          : 'bg-gray-800 border-gray-700'
                      }`}
                    >
                      <div className={`text-3xl font-bold ${
                        isActive ? 'text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]' : 
                        isLastClicked ? 'text-cyan-400' : 
                        'text-gray-500'
                      }`}>
                        {node.label}
                      </div>
                    </div>

                    {/* Label */}
                    <div className={`mt-2 text-sm font-mono tracking-wider ${
                      isActive ? 'text-white font-bold' : 'text-gray-500'
                    }`}>
                      NODE {node.label}
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Instruction text */}
            <AnimatePresence mode="wait">
              {gameState === 'showing' && (
                <motion.div
                  key="showing"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-center"
                >
                  <div className="text-yellow-400 text-xl font-bold mb-2">
                    👁️ WATCH THE PATTERN
                  </div>
                  <div className="text-gray-400 text-sm">
                    Memorize the sequence of {sequence.length} nodes
                  </div>
                </motion.div>
              )}

              {gameState === 'input' && (
                <motion.div
                  key="input"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-center space-y-4"
                >
                  <div>
                    <div className="text-green-400 text-xl font-bold mb-2">
                      ✋ YOUR TURN - REPEAT THE PATTERN
                    </div>
                    <div className="text-gray-400 text-sm">
                      Click the nodes: {userSequence.length} / {sequence.length} completed
                    </div>
                  </div>
                  
                  {/* Replay button */}
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={replaySequence}
                    className="bg-yellow-600 hover:bg-yellow-500 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 mx-auto"
                  >
                    <RotateCcw className="w-5 h-5" />
                    REPLAY PATTERN
                  </motion.button>
                </motion.div>
              )}

              {gameState === 'checking' && (
                <motion.div
                  key="checking"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="text-center"
                >
                  <div className="text-red-400 text-xl font-bold flex items-center gap-3 justify-center">
                    <XCircle className="w-6 h-6" />
                    INCORRECT - REPLAYING SAME PATTERN
                  </div>
                </motion.div>
              )}

              {gameState === 'success' && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center"
                >
                  <div className="text-cyan-400 text-3xl font-bold mb-2 flex items-center gap-3 justify-center">
                    <CheckCircle className="w-10 h-10" />
                    PATTERN COMPLETE!
                  </div>
                  <div className="text-green-400 text-sm">
                    Neural pattern verified • Pod access granted
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>

      {/* Evidence Scanner */}
      <EvidenceScanner
        objectName="ELENA'S NEURAL INTERFACE"
        caption="Neural patterns confirmed. She was alive when placed inside. Memory fragments: ...searching for Simon..."
        icon="🧠"
        position="right"
        logId="f2_elena_neural_interface"
        onScanned={() => onCollectLog?.('f2_elena_neural_interface')}
        isCollected={collectedLogs?.includes('f2_elena_neural_interface')}
      />
    </div>
  );
}
