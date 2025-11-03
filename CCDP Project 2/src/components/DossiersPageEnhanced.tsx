import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Lock, Unlock, Download, Fingerprint, Shield, AlertTriangle, Scan, SkipForward } from "lucide-react";
import simonCrossImage from 'figma:asset/295fbb3f12ba37c02bd1afd3d617ddbf8a3c5c01.png';
import elaraVossImage from 'figma:asset/119bce618f44b5f1fb022af190c7cf129cc73914.png';
import classifiedDocsBackground from 'figma:asset/8a2561aeff6381be7e70cea8fc0b3b7e5b3f36ea.png';

interface Dossier {
  name: string;
  codename: string;
  clearanceLevel: number | string;
  role: string;
  status: string;
  background: string;
  personalDetails: {
    age: number | string;
    origin: string;
    specialties: string[];
  };
  motivation: string;
  threatLevel: string;
  image?: string;
}

interface DossiersPageProps {
  onAuthorized: () => void;
}

export function DossiersPage({ onAuthorized }: DossiersPageProps) {
  const [showPopup, setShowPopup] = useState(true);
  const [unlockedDossiers, setUnlockedDossiers] = useState<number[]>([]);
  const [downloadingDossiers, setDownloadingDossiers] = useState<Set<number>>(new Set());
  const [scanningDossiers, setScanningDossiers] = useState<Set<number>>(new Set());
  const [showAuthorizedButton, setShowAuthorizedButton] = useState(false);
  const [selectedDossier, setSelectedDossier] = useState<number | null>(null);
  const unlockingRef = useRef<Set<number>>(new Set()); // Track which dossiers are currently unlocking

  // Hide popup after 8 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPopup(false);
    }, 8000);
    return () => clearTimeout(timer);
  }, []);

  // Show authorized button when all dossiers are unlocked
  useEffect(() => {
    if (unlockedDossiers.length === 3) {
      setTimeout(() => {
        setShowAuthorizedButton(true);
      }, 1000);
    }
  }, [unlockedDossiers.length]);

  const dossiers: Dossier[] = [
    {
      name: "Simon Cross (YOU)",
      codename: "Agent Cross",
      clearanceLevel: 5,
      role: "Lead Infiltrator",
      status: "ACTIVE",
      background: "Military intelligence officer with successful stealth operations.",
      personalDetails: {
        age: 34,
        origin: "Heisenberg",
        specialties: ["Close Quarters Combat", "Electronic Surveillance", "Ethical Hacking"]
      },
      motivation: "For a better world",
      threatLevel: "MAXIMUM",
      image: simonCrossImage
    },
    {
      name: "Elena Cross",
      codename: "EC",
      clearanceLevel: 4,
      role: "Technical Specialist",
      status: "INACTIVE",
      background: "Senior engineer at NAHRAN-7. Simon's sister - currently missing.",
      personalDetails: {
        age: 29,
        origin: "Heisenberg",
        specialties: ["Systems Engineering", "Network Security", "Biometric Bypass"]
      },
      motivation: "Progress is a basic need for humanity",
      threatLevel: "NIL",
      image: elaraVossImage
    },
    {
      name: "??? ??? ???",
      codename: "UNKNOWN",
      clearanceLevel: "CLASSIFIED",
      role: "??? ???",
      status: "UNKNOWN",
      background: "Advanced tactical knowledge. Unknown capabilities.",
      personalDetails: {
        age: "UNKNOWN",
        origin: "UNKNOWN",
        specialties: ["???\", \"DATA CORRUPTED", "ACCESS DENIED"]
      },
      motivation: "Motivation!?? More like DESTRUCTION!!!",
      threatLevel: "CRITICAL"
    }
  ];

  const handleUnlockDossier = async (index: number) => {
    // Check if already unlocked or currently unlocking
    if (unlockedDossiers.includes(index) || unlockingRef.current.has(index)) return;
    
    // Mark as unlocking
    unlockingRef.current.add(index);
    
    // Start scanning animation
    setScanningDossiers(prev => new Set([...prev, index]));
    
    // Biometric scan duration
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Remove from scanning, add to downloading
    setScanningDossiers(prev => {
      const next = new Set(prev);
      next.delete(index);
      return next;
    });
    setDownloadingDossiers(prev => new Set([...prev, index]));
    
    // Download duration
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Remove from downloading
    setDownloadingDossiers(prev => {
      const next = new Set(prev);
      next.delete(index);
      return next;
    });
    
    // Use functional update to ensure we get the latest state
    setUnlockedDossiers(prev => {
      // Double check it's not already in the array
      if (prev.includes(index)) return prev;
      return [...prev, index];
    });
    
    setSelectedDossier(index);
    
    // Remove from unlocking set
    unlockingRef.current.delete(index);
  };

  return (
    <div className="min-h-screen pt-20 pb-16 bg-black relative overflow-hidden" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
      {/* Tutorial Popup */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.8 }}
            className="fixed top-24 left-0 right-0 z-50 flex justify-center px-4"
          >
            <div className="bg-cyan-900/95 border-2 border-cyan-500 px-8 py-5 rounded-lg max-w-2xl shadow-2xl shadow-cyan-500/30">
              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <Fingerprint className="w-8 h-8 text-cyan-400 animate-pulse" />
                  <div className="text-cyan-400 text-xs tracking-widest mt-2">
                    SECURE
                  </div>
                </div>
                <div className="flex-1">
                  <div className="text-cyan-300 text-sm tracking-wide mb-2 font-bold">
                    🔒 CLASSIFIED DATABASE
                  </div>
                  <div className="text-white text-sm leading-relaxed">
                    <span className="text-cyan-300 font-bold">COMMANDER GREY:</span> Click each dossier to authenticate. All three files required for mission authorisation.
                  </div>
                  <div className="mt-2 text-yellow-400 text-xs">
                    ⚠️ WARNING: Third file contains data corruption
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Animated Background */}
      <motion.div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
        style={{ backgroundImage: `url(${classifiedDocsBackground})` }}
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 20, repeat: Infinity }}
      />
      
      {/* Scanline Effect */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent h-32"
          animate={{ y: ['-100%', '200%'] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      {/* Grid Overlay */}
      <div className="absolute inset-0 tech-grid opacity-5" />

      <div className="relative z-10 container mx-auto px-4">
        {/* Title */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <motion.div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="w-8 h-8 text-cyan-400" />
            <h1 className="text-4xl md:text-5xl font-bold text-cyan-400 tracking-wider" style={{ textShadow: '0 0 20px rgba(6, 182, 212, 0.6)' }}>
              PERSONNEL DOSSIERS
            </h1>
            <Shield className="w-8 h-8 text-cyan-400" />
          </motion.div>
          <motion.div 
            className="h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent mx-auto"
            initial={{ width: 0 }}
            animate={{ width: "60%" }}
            transition={{ duration: 1.5, delay: 0.3 }}
          />
          <div className="text-cyan-300 text-sm mt-3 tracking-widest">
            CLEARANCE LEVEL: TOP SECRET // {unlockedDossiers.length}/3 FILES ACCESSED
          </div>
        </motion.div>

        {/* Dossier Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto mb-12">
          {dossiers.map((dossier, index) => {
            const isLocked = !unlockedDossiers.includes(index);
            const isDownloading = downloadingDossiers.has(index);
            const isScanning = scanningDossiers.has(index);
            const isUnknown = dossier.name.includes('???');
            const isSelected = selectedDossier === index;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="relative"
              >
                {/* Locked Overlay */}
                <AnimatePresence>
                  {isLocked && (
                    <motion.div
                      initial={{ opacity: 1 }}
                      exit={{ opacity: 0, scale: 1.1 }}
                      className="absolute inset-0 z-20 bg-black/90 backdrop-blur-md rounded-lg border-2 border-cyan-500/30 flex flex-col items-center justify-center cursor-pointer group hover:bg-black/80 transition-all"
                      onClick={() => handleUnlockDossier(index)}
                    >
                      {isScanning ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                          >
                            <Fingerprint className="w-20 h-20 text-cyan-400 mb-4" />
                          </motion.div>
                          <div className="text-cyan-400 text-lg font-bold mb-2">BIOMETRIC SCAN</div>
                          <motion.div 
                            className="w-48 h-2 bg-gray-800 rounded-full overflow-hidden"
                          >
                            <motion.div
                              className="h-full bg-gradient-to-r from-cyan-500 to-cyan-300"
                              initial={{ width: '0%' }}
                              animate={{ width: '100%' }}
                              transition={{ duration: 0.8 }}
                            />
                          </motion.div>
                          <div className="text-cyan-300 text-xs mt-2">Authenticating...</div>
                        </>
                      ) : isDownloading ? (
                        <>
                          <Download className="w-20 h-20 text-green-400 mb-4 animate-bounce" />
                          <div className="text-green-400 text-lg font-bold mb-2">DOWNLOADING FILE</div>
                          <motion.div 
                            className="w-48 h-2 bg-gray-800 rounded-full overflow-hidden"
                          >
                            <motion.div
                              className="h-full bg-gradient-to-r from-green-500 to-green-300"
                              initial={{ width: '0%' }}
                              animate={{ width: '100%' }}
                              transition={{ duration: 1.0 }}
                            />
                          </motion.div>
                          <div className="text-green-300 text-xs mt-2 animate-pulse">Decrypting...</div>
                        </>
                      ) : (
                        <>
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                          >
                            <Lock className="w-20 h-20 text-cyan-400 mb-4 group-hover:text-cyan-300" />
                          </motion.div>
                          <div className="text-cyan-400 text-xl font-bold mb-2 group-hover:text-cyan-300">
                            CLASSIFIED
                          </div>
                          <div className="text-gray-400 text-sm mb-3">
                            Clearance Level: {dossier.clearanceLevel}
                          </div>
                          <motion.div
                            className="px-6 py-2 bg-cyan-600/20 border border-cyan-500/50 rounded text-cyan-300 text-sm font-bold group-hover:bg-cyan-600/40 transition-all"
                            whileHover={{ scale: 1.05 }}
                          >
                            CLICK TO UNLOCK
                          </motion.div>
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Dossier Card */}
                <motion.div
                  animate={isSelected ? { scale: [1, 1.02, 1] } : {}}
                  transition={{ duration: 0.5 }}
                  className={`h-full relative`}
                >
                  <Card className={`h-full bg-gray-900/95 backdrop-blur-md border-2 transition-all duration-500 ${
                    isUnknown 
                      ? 'border-red-600/50 hover:border-red-500 hover:shadow-xl hover:shadow-red-500/20' 
                      : 'border-cyan-600/50 hover:border-cyan-400 hover:shadow-xl hover:shadow-cyan-400/20'
                  } ${isLocked ? 'blur-sm' : ''}`}>
                    
                    {/* Status Badge */}
                    <div className="absolute top-3 right-3 z-10">
                      <Badge className={`${
                        dossier.status === 'ACTIVE' ? 'bg-green-600 border-green-400 animate-pulse' 
                        : dossier.status === 'UNKNOWN' ? 'bg-red-600 border-red-400 animate-pulse'
                        : 'bg-yellow-600 border-yellow-400'
                      } border-2 font-bold`}>
                        {dossier.status}
                      </Badge>
                    </div>

                    {/* Threat Level Badge */}
                    {dossier.threatLevel && (
                      <div className="absolute top-3 left-3 z-10">
                        <Badge className={`${
                          dossier.threatLevel === 'CRITICAL' ? 'bg-red-600 border-red-400 animate-pulse' 
                          : dossier.threatLevel === 'MAXIMUM' ? 'bg-orange-600 border-orange-400'
                          : 'bg-green-600 border-green-400'
                        } border-2 font-bold flex items-center gap-1`}>
                          {dossier.threatLevel === 'CRITICAL' && <AlertTriangle className="w-3 h-3" />}
                          {dossier.threatLevel}
                        </Badge>
                      </div>
                    )}

                    {/* Portrait */}
                    <div className="relative aspect-[4/5] overflow-hidden border-b-2 border-gray-700 bg-gray-800">
                      {dossier.image ? (
                        <>
                          <img 
                            src={dossier.image} 
                            alt={dossier.name}
                            className="w-full h-full object-cover"
                          />
                          {isUnknown && (
                            <motion.div
                              className="absolute inset-0 bg-red-500/20"
                              animate={{
                                opacity: [0.2, 0.4, 0.2],
                              }}
                              transition={{
                                duration: 1.5,
                                repeat: Infinity,
                              }}
                            />
                          )}
                        </>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                          >
                            <Scan className="w-20 h-20 text-red-500 opacity-50" />
                          </motion.div>
                        </div>
                      )}
                      
                      {/* Glitch effect for unknown */}
                      {isUnknown && !isLocked && (
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-b from-red-900/0 via-red-500/30 to-red-900/0"
                          animate={{
                            x: ['-100%', '100%'],
                            opacity: [0, 0.5, 0]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            repeatDelay: 3
                          }}
                        />
                      )}
                    </div>

                    {/* Content */}
                    <CardContent className="p-4 space-y-3">
                      {/* Name & Codename */}
                      <div className="border-b border-gray-700 pb-3">
                        <motion.h3 
                          className={`text-xl font-bold mb-1 ${isUnknown ? 'text-red-400' : 'text-cyan-400'}`}
                          animate={isUnknown ? { opacity: [1, 0.7, 1] } : {}}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          {dossier.name}
                        </motion.h3>
                        <div className="text-sm text-gray-400">
                          Codename: <span className="text-white font-bold">{dossier.codename}</span>
                        </div>
                        <div className="text-sm text-gray-400">
                          Role: <span className={`${isUnknown ? 'text-red-400' : 'text-white'}`}>{dossier.role}</span>
                        </div>
                      </div>

                      {/* Background */}
                      <div>
                        <div className="text-xs text-cyan-400 font-bold mb-1 tracking-wider">BACKGROUND</div>
                        <div className={`text-xs leading-relaxed ${isUnknown ? 'text-red-300' : 'text-gray-300'}`}>
                          {dossier.background}
                        </div>
                      </div>

                      {/* Personal Details */}
                      <div>
                        <div className="text-xs text-cyan-400 font-bold mb-1 tracking-wider">PERSONAL DETAILS</div>
                        <div className="text-xs space-y-1">
                          <div className="text-gray-400">
                            Age: <span className="text-white">{dossier.personalDetails.age}</span>
                          </div>
                          <div className="text-gray-400">
                            Origin: <span className={`${isUnknown ? 'text-red-400' : 'text-white'}`}>{dossier.personalDetails.origin}</span>
                          </div>
                          <div className="text-gray-400">
                            Specialties:
                            <div className="flex flex-wrap gap-1 mt-1">
                              {dossier.personalDetails.specialties.map((spec, i) => (
                                <Badge key={i} variant="outline" className={`text-xs ${isUnknown ? 'border-red-500/50 text-red-300' : 'border-cyan-500/50 text-cyan-300'}`}>
                                  {spec}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Motivation */}
                      <div>
                        <div className="text-xs text-cyan-400 font-bold mb-1 tracking-wider">MOTIVATION</div>
                        <div className={`text-xs italic ${isUnknown ? 'text-red-300' : 'text-gray-300'}`}>
                          "{dossier.motivation}"
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* Authorized Button */}
        <AnimatePresence>
          {showAuthorizedButton && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.8 }}
              className="fixed bottom-8 left-0 right-0 flex justify-center z-50 px-4"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={onAuthorized}
                  className="px-12 py-6 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white text-xl font-bold border-2 border-green-400 shadow-2xl shadow-green-500/50 rounded-lg"
                >
                  <Unlock className="w-6 h-6 mr-3" />
                  ALL FILES ACCESSED - PROCEED TO MISSION
                  <Unlock className="w-6 h-6 ml-3" />
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Skip Button */}
      <motion.button
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1 }}
        onClick={onAuthorized}
        className="fixed bottom-8 right-8 z-50 px-6 py-3 bg-red-600/80 hover:bg-red-500 border-2 border-red-400 rounded-lg backdrop-blur-sm transition-all duration-300 flex items-center gap-2 group"
      >
        <span className="text-white font-bold">SKIP</span>
        <SkipForward className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
      </motion.button>
    </div>
  );
}
