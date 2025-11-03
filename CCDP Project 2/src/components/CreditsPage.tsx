import { motion } from 'motion/react';
import { ArrowLeft, Code, Palette, Music, Zap } from 'lucide-react';
import ballroomImage from 'figma:asset/ca901b29453018089577073da7adea355d2f5c06.png';

interface CreditsPageProps {
  onBack: () => void;
}

export function CreditsPage({ onBack }: CreditsPageProps) {
  const creditSections = [
    {
      title: 'GAME DESIGN & DEVELOPMENT',
      icon: Code,
      credits: [
        { role: '', name: 'Paul Joseph' },
        { role: '', name: 'Pranav Gandham' },
        { role: '', name: 'Alex Lovering' },
      ],
      project: {
        label: 'Project',
        value: 'Created for CCDP10003 – @UNIMELB'
      },
      notes: [
        'All code was drafted and tested collaboratively by us.',
        'Images and visual element were first drafted by hand, then modified using digital art and refined using editing software.'
      ]
    },
    {
      title: 'SPECIAL THANKS',
      icon: Zap,
      credits: [
        { role: 'Project Tutor', name: 'David Shea' },
      ],
      thanks: 'For his guidance, feedback and encouragement throughout the projec and for giving us the creative freedom to expand and evolve the game beyond Project 1.'
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={ballroomImage}
          alt="Background"
          className="w-full h-full object-cover"
          style={{ filter: 'brightness(0.15) blur(12px)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/90 to-black" />
      </div>

      {/* Vignette */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black opacity-80" />

      {/* Scan Lines */}
      <motion.div
        className="absolute inset-0 pointer-events-none opacity-5"
        style={{
          backgroundImage: 'linear-gradient(transparent 50%, rgba(255, 255, 255, 0.05) 50%)',
          backgroundSize: '100% 4px',
        }}
        animate={{ backgroundPositionY: ['0px', '4px'] }}
        transition={{ duration: 0.1, repeat: Infinity, ease: 'linear' }}
      />

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          onClick={onBack}
          className="fixed top-8 left-8 z-50 bg-gray-900/80 hover:bg-gray-800 border-2 border-gray-700 rounded-xl px-6 py-3 backdrop-blur-md transition-all duration-300 group flex items-center gap-3"
        >
          <ArrowLeft className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
          <span className="text-gray-400 group-hover:text-white tracking-wider transition-colors">
            BACK
          </span>
        </motion.button>

        {/* Content */}
        <div className="flex-1 flex items-center justify-center py-24 px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full max-w-4xl"
          >
            {/* Title */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-center mb-16"
            >
              <motion.h1
                animate={{
                  textShadow: [
                    '0 0 20px rgba(99, 102, 241, 0.5)',
                    '0 0 40px rgba(99, 102, 241, 0.8)',
                    '0 0 20px rgba(99, 102, 241, 0.5)',
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="text-6xl md:text-7xl font-bold tracking-wider bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent mb-4"
              >
                CREDITS
              </motion.h1>
              <div className="h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent max-w-md mx-auto" />
            </motion.div>

            {/* Credits Sections */}
            <div className="space-y-12">
              {creditSections.map((section, sectionIndex) => (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + sectionIndex * 0.1, duration: 0.6 }}
                  className="bg-gradient-to-br from-gray-900/60 to-black/60 border border-gray-800/50 rounded-2xl p-8 backdrop-blur-sm"
                >
                  {/* Section Header */}
                  <div className="flex items-center gap-3 mb-6">
                    <section.icon className="w-6 h-6 text-indigo-400" />
                    <h2 className="text-indigo-400 text-xl tracking-widest">
                      {section.title}
                    </h2>
                  </div>

                  {/* Credits List */}
                  <div className="space-y-4">
                    {section.credits.map((credit, creditIndex) => (
                      <motion.div
                        key={creditIndex}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          delay: 0.6 + sectionIndex * 0.1 + creditIndex * 0.05,
                          duration: 0.4,
                        }}
                        className={`${credit.role ? 'flex justify-between items-center' : 'text-right'} py-3 border-b border-gray-800/30 last:border-0`}
                      >
                        {credit.role && (
                          <span className="text-gray-400 text-sm tracking-wider">
                            {credit.role}
                          </span>
                        )}
                        <span className="text-white tracking-wide">
                          {credit.name}
                        </span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Project Info */}
                  {section.project && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 + sectionIndex * 0.1, duration: 0.6 }}
                      className="mt-6 pt-6 border-t border-gray-800/30"
                    >
                      <div className="text-gray-500 text-xs tracking-wider mb-2">
                        {section.project.label}
                      </div>
                      <div className="text-cyan-400 text-sm italic">
                        {section.project.value}
                      </div>
                    </motion.div>
                  )}

                  {/* Development Notes */}
                  {section.notes && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.9 + sectionIndex * 0.1, duration: 0.6 }}
                      className="mt-6 pt-6 border-t border-gray-800/30 space-y-3"
                    >
                      <div className="text-gray-500 text-xs tracking-wider mb-3">
                        Development Notes
                      </div>
                      {section.notes.map((note, noteIndex) => (
                        <div key={noteIndex} className="text-gray-400 text-sm leading-relaxed">
                          {note}
                        </div>
                      ))}
                    </motion.div>
                  )}

                  {/* Special Thanks Message */}
                  {section.thanks && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 + sectionIndex * 0.1, duration: 0.6 }}
                      className="mt-6 pt-6 border-t border-gray-800/30"
                    >
                      <div className="text-gray-400 text-sm leading-relaxed italic">
                        {section.thanks}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Footer Message */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 1 }}
              className="text-center mt-16 space-y-4"
            >
              <p className="text-cyan-400 text-lg tracking-wider">
                THANK YOU FOR PLAYING
              </p>
              <p className="text-gray-600 text-xs tracking-widest">
                NAHRAN DESCENT • 2057
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Corner Brackets */}
      <div className="absolute top-8 left-8 opacity-20">
        <div className="w-16 h-16 border-t-2 border-l-2 border-indigo-500" />
      </div>
      <div className="absolute top-8 right-8 opacity-20">
        <div className="w-16 h-16 border-t-2 border-r-2 border-indigo-500" />
      </div>
      <div className="absolute bottom-8 left-8 opacity-20">
        <div className="w-16 h-16 border-b-2 border-l-2 border-indigo-500" />
      </div>
      <div className="absolute bottom-8 right-8 opacity-20">
        <div className="w-16 h-16 border-b-2 border-r-2 border-indigo-500" />
      </div>
    </div>
  );
}
