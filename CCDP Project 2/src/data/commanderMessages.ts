// Commander messages for tutorial and story guidance
export interface CommandMessage {
  id: string;
  speaker: string;
  message: string;
  duration?: number;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  trigger: 'floor-entry' | 'objective-hint' | 'objective-complete' | 'story' | 'warning';
  showAvatar?: boolean;
  cinematic?: boolean; // Large centered avatar mode
}

export const commanderMessages = {
  // INITIAL ACCESS - Before code entry
  initialAccess: [
    {
      id: 'init-1',
      speaker: 'COMMANDER GREY - OVERWATCH',
      message: 'Operative, this is Commander Grey. You\'re about to access classified NAHRAN-7 mission data. Stand by for authorization.',
      duration: 7000,
      priority: 'medium' as const,
      trigger: 'story' as const,
      showAvatar: true,
      cinematic: true
    }
  ],

  // CODE ACCEPTED - After entering CROSS
  codeAccepted: [
    {
      id: 'code-1',
      speaker: 'COMMANDER GREY - OVERWATCH',
      message: 'Access granted. Welcome to Operation NAHRAN DESCENT, Agent Cross. The fate of humanity depends on this mission.',
      duration: 7000,
      priority: 'high' as const,
      trigger: 'story' as const,
      showAvatar: true,
      cinematic: true
    },
    {
      id: 'code-2',
      speaker: 'COMMANDER GREY - OVERWATCH',
      message: 'Review the personnel dossiers. Know your target. Know the risks. When you\'re ready, we begin the insertion.',
      duration: 7000,
      priority: 'medium' as const,
      trigger: 'story' as const,
      showAvatar: true,
      cinematic: true
    }
  ],

  // MISSION START
  missionStart: [
    {
      id: 'start-1',
      speaker: 'COMMANDER GREY - OVERWATCH',
      message: 'Cross, you\'re live. NAHRAN-7 security systems are offline for the next 3 hours. This is your window.',
      duration: 7000,
      priority: 'critical' as const,
      trigger: 'story' as const,
      showAvatar: true,
      cinematic: true
    },
    {
      id: 'start-2',
      speaker: 'COMMANDER GREY - OVERWATCH',
      message: 'Remember - descend from Floor 7 to Floor 1. Extract the data. Find what happened to Elena. Then get out. We\'re counting on you.',
      duration: 8000,
      priority: 'high' as const,
      trigger: 'story' as const,
      showAvatar: true,
      cinematic: true
    }
  ],

  // FLOOR 7 - DATA ROOM
  floor7Entry: [
    {
      id: 'f7-entry',
      speaker: 'COMMANDER GREY - OVERWATCH',
      message: 'Floor 7 - Data Room. Their AI server is here. Breach their security protocols to access the data.',
      duration: 7000,
      priority: 'medium' as const,
      trigger: 'floor-entry' as const,
      showAvatar: true
    },
    {
      id: 'f7-hint',
      speaker: 'TECH SUPPORT - CIPHER',
      message: 'Match the security patterns to bypass their encryption. Take your time, Cross.',
      duration: 6000,
      priority: 'low' as const,
      trigger: 'objective-hint' as const,
      showAvatar: false
    }
  ],
  floor7Complete: [],

  // FLOOR 6 - MEDBAY
  floor6Entry: [
    {
      id: 'f6-entry',
      speaker: 'COMMANDER GREY - OVERWATCH',
      message: 'Floor 6 - Med-Bay. NAHRAN runs unauthorised human trials here. Right now, boost your health and continue your descent.',
      duration: 7000,
      priority: 'medium' as const,
      trigger: 'floor-entry' as const,
      showAvatar: true
    },
    {
      id: 'f6-hint',
      speaker: 'MEDICAL SPECIALIST - VITA',
      message: 'Locate the first aid kits. You\'ll need them for the floors below.',
      duration: 6000,
      priority: 'low' as const,
      trigger: 'objective-hint' as const,
      showAvatar: false
    }
  ],
  floor6Complete: [
    {
      id: 'f6-complete',
      speaker: 'MEDICAL SPECIALIST - VITA',
      message: 'Medical supplies secured. Your vitals are looking good! Keep moving.',
      duration: 6000,
      priority: 'low' as const,
      trigger: 'objective-complete' as const,
      showAvatar: false
    }
  ],

  // FLOOR 5 - KITCHEN
  floor5Entry: [
    {
      id: 'f5-entry',
      speaker: 'COMMANDER GREY - OVERWATCH',
      message: 'Floor 5 - Kitchen. Intel shows they have an automated gas system. You\'ll need to shut valves down right now.',
      duration: 7000,
      priority: 'medium' as const,
      trigger: 'floor-entry' as const,
      showAvatar: true
    },
    {
      id: 'f5-hint',
      speaker: 'TECH SUPPORT - CIPHER',
      message: 'Find the gas valve controls. The shutdown sequence should be straightforward - just don\'t trigger the alarm.',
      duration: 7000,
      priority: 'low' as const,
      trigger: 'objective-hint' as const,
      showAvatar: false
    }
  ],
  floor5Complete: [
    {
      id: 'f5-complete',
      speaker: 'COMMANDER GREY - OVERWATCH',
      message: 'Gas lines neutralised. You\'re doing well, Cross. Four more floors to go.',
      duration: 6000,
      priority: 'medium' as const,
      trigger: 'objective-complete' as const,
      showAvatar: true
    }
  ],

  // FLOOR 4 - ACCOUNTING
  floor4Entry: [
    {
      id: 'f4-entry',
      speaker: 'COMMANDER GREY - OVERWATCH',
      message: 'Floor 4 - Accounting Floor. Cross, complete the calculation and move fast!',
      duration: 7000,
      priority: 'high' as const,
      trigger: 'floor-entry' as const,
      showAvatar: true
    },
    {
      id: 'f4-hint',
      speaker: 'TECH SUPPORT - CIPHER',
      message: 'Solve the calculation before the timer runs out. Focus, Cross.',
      duration: 6000,
      priority: 'high' as const,
      trigger: 'objective-hint' as const,
      showAvatar: false
    }
  ],
  floor4Complete: [
    {
      id: 'f4-complete-1',
      speaker: 'COMMANDER GREY - OVERWATCH',
      message: 'Security lockdown evaded! 3 more floors to go!.',
      duration: 6000,
      priority: 'high' as const,
      trigger: 'objective-complete' as const,
      showAvatar: true
    },
    {
      id: 'f4-complete-2',
      speaker: 'TECH SUPPORT - CIPHER',
      message: 'NAHRAN\'s AI is going to hunt you anytime. Move quickly and save your sister.',
      duration: 5000,
      priority: 'high' as const,
      trigger: 'warning' as const,
      showAvatar: false
    }
  ],

  // FLOOR 3 - PRINTING ROOM
  floor3Entry: [
    {
      id: 'f3-entry',
      speaker: 'COMMANDER GREY - OVERWATCH',
      message: 'Floor 3 - Printing Floor. Cross... we can find the location of your sister from here. Solve the task and find her location',
      duration: 7000,
      priority: 'high' as const,
      trigger: 'floor-entry' as const,
      showAvatar: true
    },
    {
      id: 'f3-hint',
      speaker: 'TECH SUPPORT - CIPHER',
      message: 'Stabilise the power grid before the floor explodes. Find the correct wire sequence. Time is critical.',
      duration: 7000,
      priority: 'high' as const,
      trigger: 'objective-hint' as const,
      showAvatar: false
    }
  ],
  floor3Complete: [],

  // FLOOR 2 - SLEEPING PODS (Secret Floor - Elena revelation)
  floor2Entry: [
    {
      id: 'f2-entry',
      speaker: 'COMMANDER GREY - OVERWATCH',
      message: 'Floor 2... Cross, this floor is hotspot. Crack the pattern and save your sister and the civilians',
      duration: 7000,
      priority: 'critical' as const,
      trigger: 'floor-entry' as const,
      showAvatar: true
    }
  ],
  floor2Complete: [
    {
      id: 'f2-complete-1',
      speaker: 'COMMANDER GREY - OVERWATCH',
      message: 'Elena recovered. Good work, Cross. One floor left. Proceed with extreme caution.',
      duration: 6000,
      priority: 'critical' as const,
      trigger: 'objective-complete' as const,
      showAvatar: true
    }
  ],

  // FLOOR 1 - BALLROOM (FINAL)
  floor1Entry: [
    {
      id: 'f1-entry',
      speaker: 'COMMANDER GREY - OVERWATCH',
      message: 'Floor 1 - The Ballroom. The TITAN AI is active. Defeat it to access the ground floor. This is it, Cross.',
      duration: 7000,
      priority: 'critical' as const,
      trigger: 'floor-entry' as const,
      showAvatar: true
    }
  ],
  floor1Complete: [
    {
      id: 'f1-complete',
      speaker: 'COMMANDER GREY - OVERWATCH',
      message: 'TITAN is offline. Excellent work, Cross. Proceed to ground floor to exit. Extraction team is standing by.',
      duration: 7000,
      priority: 'critical' as const,
      trigger: 'objective-complete' as const,
      showAvatar: true
    }
  ],

  // GROUND FLOOR - ESCAPE
  basementEntry: [
    {
      id: 'basement-entry',
      speaker: 'COMMANDER GREY - OVERWATCH',
      message: 'Final override sequence. Cross, hold onto the button and let the bar hit 100% to open the doors.',
      duration: 8000,
      priority: 'critical' as const,
      trigger: 'floor-entry' as const,
      showAvatar: true
    }
  ],
  basementComplete: [
    {
      id: 'basement-complete',
      speaker: 'COMMANDER GREY - OVERWATCH',
      message: 'Override complete. Doors are opened. Cross, get out of there NOW. Extraction in 60 seconds!',
      duration: 7000,
      priority: 'critical' as const,
      trigger: 'objective-complete' as const,
      showAvatar: true
    }
  ],

  // CONTEXTUAL WARNINGS
  warnings: {
    lowHealth: {
      id: 'warning-health',
      speaker: 'MEDICAL SPECIALIST - VITA',
      message: 'Cross, your vitals are critical! Find cover and use your medical supplies immediately!',
      duration: 6000,
      priority: 'critical' as const,
      trigger: 'warning' as const,
      showAvatar: false
    },
    highCorruption: {
      id: 'warning-corruption',
      speaker: 'TECH SUPPORT - CIPHER',
      message: 'Warning! NAHRAN\'s corruption protocols are affecting your neural link. Stay focused, Cross!',
      duration: 6000,
      priority: 'high' as const,
      trigger: 'warning' as const,
      showAvatar: false
    }
  }
};

// Helper function to get messages for a specific floor
export function getFloorMessages(floor: number, type: 'entry' | 'complete') {
  const floorMap: { [key: number]: string } = {
    7: 'floor7',
    6: 'floor6',
    5: 'floor5',
    4: 'floor4',
    3: 'floor3',
    2: 'floor2',
    1: 'floor1',
    0: 'basement'
  };

  const key = `${floorMap[floor]}${type === 'entry' ? 'Entry' : 'Complete'}`;
  return commanderMessages[key as keyof typeof commanderMessages] || [];
}
