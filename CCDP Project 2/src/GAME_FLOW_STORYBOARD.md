# NAHRAN DESCENT - 2D Cinematic Vertical Storyboard

## Core Concept
A vertically-descending 2D cinematic game where the player infiltrates NAHRAN-7 Tower from the rooftop (helipad) down to the basement, progressing through 8 distinct floors like an elevator journey.

## Visual Style
- **2D flat-shaded game art** with bold outlines
- **Night-time cinematic lighting** (city glows, fog, neon accents)
- **Consistent vertical composition** (top-down descent feeling)
- **Clean UI hierarchy** with tactical HUD elements
- **Colour palette**: Black (#0a0a0a), Cyan (#06b6d4), Red (#dc2626), with floor-specific accent colors

---

## VERTICAL PROGRESSION MAP (Top to Bottom)

```
🚁 HELIPAD (TOP)          - Entry Point
    ↓
🔐 SECURITY CHECKPOINT    - Authorization
    ↓
📂 DOSSIER ROOM          - Intelligence Briefing
    ↓
🚪 TOWER ENTRANCE        - Breach Sequence (Cinematic)
    ↓
🛗 ELEVATOR SHAFT        - Power Restoration
    ↓
═══════════════════════════════════════
    INTERIOR DESCENT BEGINS
═══════════════════════════════════════
    ↓
F7  DATA ROOM            - Firewall Breach (Minigame)
    ↓
F6  MEDBAY              - Nanobot Synchronisation (Minigame)
    ↓
F5  KITCHEN             - Gas Valve Shutdown (Minigame)
    ↓
F4  ACCOUNTING          - Security Lockdown (Minigame)
    ↓
F3  PRINTING ROOM       - Wire Defusal (Minigame)
    ↓
F2  SLEEPING PODS       - Memory Access (Minigame)
    ↓
F1  BALLROOM            - TITAN AI Encounter (Boss)
    ↓
F0  GROUND FLOOR        - Exit
    ↓
🚁 EXTRACTION           - Epilogue
```

---

## FRAME-BY-FRAME BREAKDOWN

### **FRAME 1: Opening Sequence (Interactive)**
- **Location**: NAHRAN Command Center
- **Action**: Authorize mission with code "CROSS"
- **Visual**: Dark tactical command room, multiple screens, red emergency lighting
- **Transition**: Decrypt sequence → Authorization granted

### **FRAME 2: Personnel Dossiers**
- **Location**: Secure intelligence room
- **Action**: Review classified personnel files (Elena, Agent Cross, NAHRAN personnel)
- **Visual**: Holographic dossier cards, classified document styling
- **Transition**: Folder close → Mission brief activated

### **FRAME 3: Mission Briefing (Authorized)**
- **Location**: Command Center (elevated view)
- **Action**: Receive final mission parameters from Commander Grey
- **Visual**: Tactical map of NAHRAN-7 Tower, floor schematics, mission objectives
- **Transition**: "BEGIN DESCENT" button → Helicopter deployment

---

### **CINEMATIC ENTRY SEQUENCE** (Frames 4-9)

### **FRAME 4: Helicopter Landing**
- **Location**: City skyline → NAHRAN-7 Helipad
- **Action**: Cinematic helicopter approach and landing
- **Visual**: Night city with glowing buildings, rotating helicopter blades, landing lights
- **Audio Cue**: Rotor sounds, wind
- **Transition**: Touchdown → Exit helicopter

### **FRAME 5: Power Panel Activation**
- **Location**: Helipad surface
- **Action**: Activate rooftop power panels (minigame)
- **Visual**: Industrial rooftop, glowing power panels, electrical arcs
- **Transition**: Power surge → Lockdown alarm

### **FRAME 6: System Lockdown Escape**
- **Location**: Helipad perimeter
- **Action**: Close security alert popups (minigame - 5 alerts, 5 seconds)
- **Visual**: Red alert overlays, flashing warnings, countdown timer
- **Transition**: Last alert closed → Memory sync

### **FRAME 7: Memory Sync**
- **Location**: Agent's neural interface
- **Action**: Scroll through memory fragments (Elena, NAHRAN-7, mission objective)
- **Visual**: Fragmented memories, glitching holograms, data corruption
- **Transition**: Final fragment → Commander Grey briefing

### **FRAME 8: Commander Grey Briefing**
- **Location**: Neural comms channel
- **Action**: Receive tactical briefing from Commander Grey (cinematic radio message)
- **Visual**: Commander's holographic avatar, NAHRAN tower background, audio waveforms
- **Transition**: Briefing complete → Approach building

### **FRAME 9: Building Approach**
- **Location**: Exterior corridor → Heavy security door
- **Action**: Walk toward entrance (automatic progression)
- **Visual**: Dark corridor, dim overhead lights, heavy reinforced door ahead
- **Transition**: 4 seconds → Door breach sequence

### **FRAME 10: Door Breach**
- **Location**: Security door close-up
- **Action**: Hack keypad, bypass security
- **Visual**: Scrolling hack code, progress bar, lock indicator RED → GREEN
- **Transition**: Access granted flash → Inside building

### **FRAME 11: Interior Lobby**
- **Location**: NAHRAN-7 main lobby
- **Action**: Approach elevator console
- **Visual**: Dark corporate lobby, perspective floor tiles, offline elevator panel
- **Transition**: 4 seconds → Elevator console

### **FRAME 12: Elevator Power Restoration**
- **Location**: Elevator control panel
- **Action**: Charge 4 power cells by clicking (minigame)
- **Visual**: Battery icons, charging animations, progress indicators
- **Transition**: All cells charged → BEGIN DESCENT button → Enter floors

---

### **INTERIOR FLOORS** (Frames 13-20)

Each floor follows this structure:
1. **Floor Intro** (4 seconds) - Floor number, name, subtitle
2. **Commander Grey Message** (only F7 - Data Room)
3. **Minigame** - Floor-specific challenge
4. **Completion** - Success message, +health/-corruption
5. **Elevator Transition** - Descent animation (3s elevator + 3s breach)

### **FRAME 13: F7 - DATA ROOM**
- **Objective**: Breach firewall security
- **Minigame**: Pattern matching (grid squares)
- **Visual**: Blue/cyan theme, server racks, holographic firewalls
- **Commander Message**: "Floor 7 - Data Room. Breach their security protocols."
- **Success**: Firewall down, access to F6 granted

### **FRAME 14: F6 - MEDBAY**
- **Objective**: Synchronise medical nanobots
- **Minigame**: Timing challenge (click in green zone)
- **Visual**: Green theme, medical pod, holographic particles
- **Reward**: +20 Health
- **Success**: Healing complete, vitals restored

### **FRAME 15: F5 - KITCHEN**
- **Objective**: Shutdown gas lines
- **Minigame**: Valve sequence
- **Visual**: Orange/red theme, industrial kitchen, gas pipes
- **Success**: Gas neutralised, floor secured

### **FRAME 16: F4 - ACCOUNTING**
- **Objective**: Bypass AI detection (timed)
- **Minigame**: Pattern recognition under time pressure
- **Visual**: Purple theme, security monitors, countdown
- **Success**: Security bypassed, detection avoided

### **FRAME 17: F3 - PRINTING ROOM**
- **Objective**: Stabilise power grid
- **Minigame**: Wire sequence
- **Visual**: Indigo theme, sparking wires, power panels
- **Success**: Power stabilised, floor safe

### **FRAME 18: F2 - SLEEPING PODS (Secret Floor)**
- **Objective**: Access memory banks
- **Minigame**: Pod sequence
- **Visual**: Pink/purple theme, sleeping pods, memory interfaces
- **Story Revelation**: Elena location discovered (Floor 1)
- **Success**: Memory accessed, truth revealed

### **FRAME 19: F1 - BALLROOM (FINAL FLOOR)**
- **Objective**: Defeat TITAN AI
- **Minigame**: Logic questions (3 rounds)
- **Visual**: Red theme, grand ballroom, TITAN hologram
- **Dramatic**: Final confrontation, highest stakes
- **Success**: TITAN offline, Elena freed

### **FRAME 20: B1 - BASEMENT**
- **Objective**: Enter shutdown codes
- **Minigame**: Code sequence
- **Visual**: White/cyan theme, industrial basement, control terminals
- **Success**: Building lockdown initiated, escape sequence

---

### **FRAME 21: Epilogue**
- **Location**: Extraction point (exterior)
- **Action**: Mission debriefing, story conclusion
- **Visual**: Dawn breaking, helicopter extraction, city in background
- **Options**: Restart mission, review stats

---

## VISUAL TRANSITIONS

### Elevator Descent Animation (Between Floors)
1. **Phase 1 - Elevator Doors Close** (0.5s)
   - Floor fades out
   - Elevator doors slide closed
   
2. **Phase 2 - Descent** (3s)
   - Vertical motion lines scrolling upward
   - Floor numbers passing by
   - "DESCENDING" status
   - Cyan lighting effects

3. **Phase 3 - Breach** (3s)
   - Doors slide open
   - Red breach effect
   - Security sparks
   - "BREACHING FLOOR" status

4. **Phase 4 - Entry** (0.5s)
   - Floor intro appears
   - Mission objective displayed
   - Minigame loads

---

## UI/UX CONSISTENCY

### Always Visible Elements
- **Game HUD** (top-left): Health bar, corruption meter, current floor
- **Digital Clock** (top-right): Mission time
- **Exit Button** (top-right): Emergency abort

### Colour-Coded Threat Levels
- **LOW** (Cyan): F7
- **MEDIUM** (Blue/Orange): F6, F5
- **HIGH** (Purple/Yellow): F4, F3
- **CRITICAL** (Pink): F2
- **EXTREME** (Red): F1
- **FINAL** (White): B1

### Typography
- **Font**: JetBrains Mono (monospace)
- **Headers**: Bold, wide tracking
- **Body**: Regular, readable line-height
- **Accents**: Glowing text effects for emphasis

---

## PACING GUIDELINES

### Timing Balance
- **Cinematic frames**: 3-4 seconds (automatic progression)
- **Minigames**: 30-90 seconds (player-controlled)
- **Transitions**: 6-7 seconds total (elevator + breach)
- **Messages**: 7-9 seconds (Commander Grey, completion)

### Message Flow
- **Opening**: Multiple messages (tutorial)
- **F7 Entry**: Commander messages (establish tone)
- **Other Floors**: NO entry messages (better pacing)
- **Completion**: Always show (reward)
- **Critical Moments**: F2 revelation, F1 boss intro

---

## TECHNICAL IMPLEMENTATION

### State Management
```typescript
GameFlow:
  interactive-opening → personnel-dossiers → authorised-briefing → 
  cinematic-entry (12 frames) → interactive-floors (F7→F6→...→B1) → 
  epilogue
```

### Progression Locks
- Must view dossiers before briefing
- Must complete all cinematic frames before floors
- Must complete each floor to descend
- No skipping floors (linear progression)
- "No way back" once dossiers viewed

---

## FIXES NEEDED

### Current Issues
1. ✅ **Medbay Glitch**: Completion messages overlap with floor transition
2. ✅ **Message Timing**: Too many messages at start (boring)
3. ✅ **Pacing**: Entry messages on every floor (repetitive)

### Solutions
1. **Completion Flow**: Wait for all messages before transitioning
2. **Entry Messages**: Only show on F7 (Commander Grey intro)
3. **Better Timing**: Calculate message queue duration properly
4. **Visual Feedback**: Clear indicators when messages are active

---

This storyboard provides a clear, cinematic vertical journey through the NAHRAN-7 tower with consistent 2D game aesthetics, proper pacing, and engaging gameplay moments.
