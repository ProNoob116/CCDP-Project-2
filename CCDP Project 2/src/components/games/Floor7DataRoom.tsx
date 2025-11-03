import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SkipForward, Shield, Zap } from 'lucide-react';
import dataRoomImage from 'figma:asset/3dca73e2a354cc69d82cdc800bbaed8dfe22653b.png';
import { EvidenceScanner } from '../EvidenceScanner';

interface Floor7DataRoomProps {
  onComplete: () => void;
  onFail: () => void;
  onCollectLog?: (logId: string) => void;
  collectedLogs?: string[];
}

interface Node {
  id: number;
  x: number;
  y: number;
  hacked: boolean;
  type: 'firewall' | 'data';
}

export function Floor7DataRoom({ onComplete, onFail, onCollectLog, collectedLogs = [] }: Floor7DataRoomProps) {
  const [nodes] = useState<Node[]>([
    { id: 1, x: 20, y: 30, hacked: false, type: 'firewall' },
    { id: 2, x: 45, y: 20, hacked: false, type: 'firewall' },
    { id: 3, x: 70, y: 35, hacked: false, type: 'firewall' },
    { id: 4, x: 35, y: 55, hacked: false, type: 'firewall' },
    { id: 5, x: 60, y: 65, hacked: false, type: 'firewall' },
    { id: 6, x: 50, y: 80, hacked: false, type: 'data' }, // Final data node
  ]);
  const [hackedNodes, setHackedNodes] = useState<number[]>([]);
  const [hackingNodes, setHackingNodes] = useState<Map<number, number>>(new Map());
  const [showSuccess, setShowSuccess] = useState(false);
  const [aiVoiceLine, setAiVoiceLine] = useState<string | null>(null);
  const intervalsRef = useRef<Map<number, NodeJS.Timeout>>(new Map());

  // AI Voice Lines
  const voiceLines = {
    start: "FIREWALL BREACH PROTOCOL INITIALISED",
    hacking: "BREACHING FIREWALL NODE - STAND BY",
    nodeHacked: "NODE COMPROMISED - FIREWALL DOWN",
    dataLocked: "DATA NODE LOCKED - BREACH ALL FIREWALLS FIRST",
    complete: "ALL NODES BREACHED - DATA ACCESS GRANTED"
  };

  useEffect(() => {
    setAiVoiceLine(voiceLines.start);
    setTimeout(() => setAiVoiceLine(null), 3000);
  }, []);

  // Cleanup intervals on unmount
  useEffect(() => {
    return () => {
      intervalsRef.current.forEach(interval => clearInterval(interval));
    };
  }, []);

  // Check for completion when all nodes are hacked
  useEffect(() => {
    if (hackedNodes.length === 6) {
      setShowSuccess(true);
      setAiVoiceLine(voiceLines.complete);
      setTimeout(() => onComplete(), 3000);
    }
  }, [hackedNodes.length, onComplete]);

  const handleNodeClick = (nodeId: number) => {
    // Check if already hacked or currently hacking
    if (hackedNodes.includes(nodeId) || hackingNodes.has(nodeId)) return;
    
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;

    // Can't hack data node until all firewalls are down
    if (node.type === 'data' && hackedNodes.length < 5) {
      setAiVoiceLine(voiceLines.dataLocked);
      setTimeout(() => setAiVoiceLine(null), 2500);
      return;
    }

    // Start hacking this node
    setAiVoiceLine(voiceLines.hacking);
    const newHackingNodes = new Map(hackingNodes);
    newHackingNodes.set(nodeId, 0);
    setHackingNodes(newHackingNodes);

    // Create interval for this specific node
    const interval = setInterval(() => {
      setHackingNodes(current => {
        const updated = new Map(current);
        const progress = updated.get(nodeId) || 0;
        
        if (progress >= 100) {
          // Node hacked!
          updated.delete(nodeId);
          setHackedNodes(prev => [...prev, nodeId]);
          setAiVoiceLine(voiceLines.nodeHacked);
          setTimeout(() => setAiVoiceLine(null), 2000);
          
          // Clear this interval
          const intervalId = intervalsRef.current.get(nodeId);
          if (intervalId) {
            clearInterval(intervalId);
            intervalsRef.current.delete(nodeId);
          }
          
          return updated;
        }
        
        updated.set(nodeId, progress + 5);
        return updated;
      });
    }, 100);

    intervalsRef.current.set(nodeId, interval);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={dataRoomImage}
          alt="Data Room"
          className="w-full h-full object-cover"
          style={{ filter: 'brightness(0.6) blur(1px)' }}
        />
        {/* Dark overlay with blue tint */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-cyan-950/40 to-black/70" />
      </div>

      {/* Animated particles overlay */}
      <div className="absolute inset-0 z-10">
        {/* Reduced particles for performance */}
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400/30 rounded-full"
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
          backgroundImage: 'linear-gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px)',
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
            <div className="bg-cyan-950/95 border-2 border-cyan-500 rounded-xl px-8 py-4 backdrop-blur-md shadow-2xl shadow-cyan-500/30">
              <motion.div
                animate={{ opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-cyan-400 text-lg font-bold tracking-wider flex items-center gap-2"
              >
                <Shield className="w-5 h-5" />
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
          className="text-center mb-12 bg-black/60 backdrop-blur-sm border border-cyan-500/30 rounded-lg p-6 max-w-3xl w-full space-y-3"
        >
          <div className="text-cyan-300 text-xl tracking-wider">
            Breach all firewall nodes to access classified data
          </div>
          <div className="text-blue-400 text-sm flex items-center justify-center gap-2">
            <Zap className="w-4 h-4" />
            Click each node to initiate breach sequence
          </div>
        </motion.div>

        {/* Firewall Network Interface */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="relative w-full max-w-4xl"
        >
          {/* Network Container */}
          <div className="relative bg-gradient-to-b from-cyan-950/30 to-black/60 border-2 border-cyan-500/40 rounded-2xl p-12 backdrop-blur-sm shadow-2xl shadow-cyan-500/20 overflow-hidden">
            
            {/* Corner brackets */}
            <div className="absolute top-4 left-4 w-16 h-16 border-t-2 border-l-2 border-cyan-400"></div>
            <div className="absolute top-4 right-4 w-16 h-16 border-t-2 border-r-2 border-cyan-400"></div>
            <div className="absolute bottom-4 left-4 w-16 h-16 border-b-2 border-l-2 border-cyan-400"></div>
            <div className="absolute bottom-4 right-4 w-16 h-16 border-b-2 border-r-2 border-cyan-400"></div>

            {/* Network Header */}
            <div className="text-center mb-8">
              <Shield className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
              <div className="text-cyan-400 text-sm tracking-wider">NAHRAN-7 FIREWALL NETWORK</div>
              <div className="text-xs text-gray-400 mt-1">
                NODES BREACHED: <span className="text-white font-bold">{hackedNodes.length}/6</span>
              </div>
            </div>

            {/* Network visualization */}
            <div className="relative h-[500px] bg-black/50 border-2 border-cyan-500/30 rounded-xl overflow-hidden mb-6">
              {/* Connection lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <line x1="20%" y1="30%" x2="45%" y2="20%" stroke="rgba(6, 182, 212, 0.3)" strokeWidth="2" />
                <line x1="45%" y1="20%" x2="70%" y2="35%" stroke="rgba(6, 182, 212, 0.3)" strokeWidth="2" />
                <line x1="20%" y1="30%" x2="35%" y2="55%" stroke="rgba(6, 182, 212, 0.3)" strokeWidth="2" />
                <line x1="70%" y1="35%" x2="60%" y2="65%" stroke="rgba(6, 182, 212, 0.3)" strokeWidth="2" />
                <line x1="35%" y1="55%" x2="50%" y2="80%" stroke="rgba(6, 182, 212, 0.3)" strokeWidth="2" />
                <line x1="60%" y1="65%" x2="50%" y2="80%" stroke="rgba(6, 182, 212, 0.3)" strokeWidth="2" />
              </svg>

              {/* Nodes */}
              {nodes.map((node) => {
                const isHacked = hackedNodes.includes(node.id);
                const isHacking = hackingNodes.has(node.id);
                const hackProgress = hackingNodes.get(node.id) || 0;
                const isLocked = node.type === 'data' && hackedNodes.length < 5;

                return (
                  <motion.div
                    key={node.id}
                    className="absolute"
                    style={{
                      left: `${node.x}%`,
                      top: `${node.y}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    <motion.button
                      onClick={() => handleNodeClick(node.id)}
                      disabled={isHacked || isHacking || isLocked}
                      className={`relative w-20 h-20 rounded-lg border-2 transition-all duration-300 ${
                        isHacked 
                          ? 'bg-green-500/20 border-green-400 cursor-default' 
                          : isHacking
                          ? 'bg-yellow-500/20 border-yellow-400 cursor-wait'
                          : isLocked
                          ? 'bg-red-500/20 border-red-400 cursor-not-allowed'
                          : 'bg-cyan-500/20 border-cyan-400 cursor-pointer hover:bg-cyan-500/40'
                      }`}
                      whileHover={!isHacked && !isHacking && !isLocked ? { scale: 1.1 } : {}}
                      animate={isHacking ? {
                        boxShadow: [
                          '0 0 20px rgba(234, 179, 8, 0.5)',
                          '0 0 40px rgba(234, 179, 8, 0.8)',
                          '0 0 20px rgba(234, 179, 8, 0.5)'
                        ]
                      } : isHacked ? {
                        boxShadow: '0 0 20px rgba(34, 197, 94, 0.5)'
                      } : {}}
                      transition={{ duration: 1, repeat: isHacking ? Infinity : 0 }}
                    >
                      {/* Node Icon */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        {node.type === 'firewall' ? (
                          <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
                              className={isHacked ? 'text-green-400' : isHacking ? 'text-yellow-400' : 'text-cyan-400'}
                            />
                          </svg>
                        ) : (
                          <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                              className={isHacked ? 'text-green-400' : isLocked ? 'text-red-400' : 'text-cyan-400'}
                            />
                          </svg>
                        )}
                      </div>

                      {/* Hack progress overlay */}
                      {isHacking && (
                        <motion.div
                          className="absolute inset-0 bg-yellow-400/30 rounded-lg"
                          style={{ clipPath: `inset(${100 - hackProgress}% 0 0 0)` }}
                        />
                      )}

                      {/* Node label */}
                      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs">
                        <span className={isHacked ? 'text-green-400' : isHacking ? 'text-yellow-400' : isLocked ? 'text-red-400' : 'text-cyan-400'}>
                          {node.type === 'firewall' ? `FW-${node.id}` : 'DATA'}
                        </span>
                      </div>

                      {/* Lock icon for data node */}
                      {isLocked && (
                        <motion.div
                          className="absolute -top-3 -right-3 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center"
                          animate={{ rotate: [0, 10, -10, 0] }}
                          transition={{ duration: 0.5, repeat: Infinity }}
                        >
                          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
                            />
                          </svg>
                        </motion.div>
                      )}
                    </motion.button>

                    {/* Hacked checkmark */}
                    {isHacked && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center z-10"
                      >
                        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Hack progress bars - below network */}
            <AnimatePresence>
              {hackingNodes.size > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-3"
                >
                  <div className="text-center text-sm text-yellow-400 mb-3 tracking-wider">
                    BREACHING {hackingNodes.size} NODE{hackingNodes.size > 1 ? 'S' : ''}...
                  </div>
                  {Array.from(hackingNodes.entries()).map(([nodeId, progress]) => {
                    const node = nodes.find(n => n.id === nodeId);
                    return (
                      <div key={nodeId}>
                        <div className="flex justify-between text-xs text-yellow-400 mb-1">
                          <span>{node?.type === 'firewall' ? `FIREWALL-${nodeId}` : 'DATA NODE'}</span>
                          <span className="font-bold">{Math.round(progress)}%</span>
                        </div>
                        <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden border border-yellow-500/50">
                          <motion.div
                            className="h-full bg-gradient-to-r from-yellow-600 to-yellow-400"
                            style={{ width: `${progress}%` }}
                          >
                            <motion.div
                              className="h-full bg-gradient-to-r from-transparent via-white/30 to-transparent"
                              animate={{ x: ['-100%', '100%'] }}
                              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            />
                          </motion.div>
                        </div>
                      </div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Status indicator */}
            <div className="mt-6 text-center">
              <div className={`inline-block px-6 py-3 rounded-lg border-2 ${
                hackedNodes.length >= 6
                  ? 'bg-green-900/80 border-green-500/50 text-green-400'
                  : 'bg-cyan-900/80 border-cyan-600/50 text-cyan-400'
              }`}>
                <div className="text-sm tracking-wider">
                  STATUS: {hackedNodes.length >= 6 ? 'ALL NODES BREACHED' : `${6 - hackedNodes.length} NODES REMAINING`}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Evidence Scanner - Elena's Security Badge - Positioned in bottom-left corner near servers */}
      <EvidenceScanner
        objectName="ELENA'S SECURITY BADGE"
        caption="Last scanned: 47 days ago. Access: REVOKED."
        icon="🪪"
        position="left"
        logId="f7_elena_badge"
        onScanned={() => onCollectLog?.('f7_elena_badge')}
        isCollected={collectedLogs?.includes('f7_elena_badge')}
      />

      {/* Skip Button */}
      <motion.button
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1 }}
        onClick={() => onComplete()}
        className="fixed bottom-8 right-8 z-40 px-6 py-3 bg-cyan-600/80 hover:bg-cyan-500 border-2 border-cyan-400 rounded-lg backdrop-blur-sm transition-all duration-300 flex items-center gap-2 group"
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
              className="absolute inset-0 bg-cyan-500"
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
                        '0 0 20px rgba(6, 182, 212, 0.5)',
                        '0 0 50px rgba(6, 182, 212, 1)',
                        '0 0 20px rgba(6, 182, 212, 0.5)'
                      ]
                    }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="text-8xl font-bold text-cyan-400 mb-6"
                  >
                    BREACH SUCCESSFUL
                  </motion.div>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="text-cyan-300 text-3xl"
                  >
                    Classified data extracted
                  </motion.p>
                </motion.div>

                {/* Reduced breach particles for performance */}
                {Array.from({ length: 25 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-cyan-400 rounded-full"
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
    </div>
  );
}
