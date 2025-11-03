# Interactive Floors System Guide

## Overview
The Interactive Floors System transforms NAHRAN DESCENT into a playable web game where each floor features a unique mini-game that users must complete to descend further into the tower.

## System Architecture

### Main Components

#### 1. **InteractiveFloorsSystem** (`/components/InteractiveFloorsSystem.tsx`)
- **Main orchestrator** that manages the entire floors experience
- Tracks global state: health, AI corruption, current floor
- Handles transitions between floors
- Shows game HUD overlay
- Manages game over conditions

#### 2. **GameHUD** (`/components/GameHUD.tsx`)
- **Persistent overlay** visible on all floors
- Displays:
  - Health bar (reduces on failures)
  - AI Corruption meter (increases with each floor)
  - Current floor indicator (F7 → B1)

### Individual Floor Games

Each floor has its own game component with unique mechanics:

#### **Floor 7 - Data Room** (`Floor7DataRoom.tsx`)
- **Type:** Node Connection Puzzle
- **Objective:** Connect matching colored nodes to breach the firewall
- **Mechanics:** Click pairs of same-colored nodes to match them
- **Success:** All 4 pairs connected
- **Failure:** N/A (no time limit)

#### **Floor 6 - Medbay** (`Floor6Medbay.tsx`)
- **Type:** Timing/Reaction Game
- **Objective:** Stabilize volatile serum by clicking at the right moment
- **Mechanics:** Click when the moving gauge marker is in the green zone
- **Success:** 3 successful clicks
- **Failure:** Click outside green zone or miss

#### **Floor 5 - Kitchen** (`Floor5Kitchen.tsx`)
- **Type:** Memory Sequence (Simon Says)
- **Objective:** Shut off gas valves in the correct sequence
- **Mechanics:** Watch valve flash sequence, repeat it back
- **Success:** Complete 3 rounds of increasing difficulty
- **Failure:** Click wrong valve in sequence

#### **Floor 4 - Accounting** (`Floor4Accounting.tsx`)
- **Type:** Find the Hidden Object
- **Objective:** Identify the disguised bot among holograms
- **Mechanics:** Hover to scan, click the one that glitches red
- **Success:** Click the correct infiltrator before time runs out
- **Failure:** Click wrong target or run out of time (10s)

#### **Floor 3 - Printing Room** (`Floor3PrintingRoom.tsx`)
- **Type:** Rhythm Clicker
- **Objective:** Overload printers by clicking lights in rhythm
- **Mechanics:** Click the glowing light as it moves across conveyor
- **Success:** 5 successful rhythm clicks
- **Failure:** Click wrong light

#### **Floor 2 - Sleeping Pods** (`Floor2SleepingPods.tsx`)
- **Type:** Memory Code Recall
- **Objective:** Access Elena's pod by recalling memory codes
- **Mechanics:** Watch 3 codes appear, then input them in order
- **Success:** Enter all 3 codes correctly
- **Failure:** Enter wrong code

#### **Floor 1 - Ballroom** (`Floor1Ballroom.tsx`)
- **Type:** Quick Reaction Battle (QTE)
- **Objective:** Defeat the Titan in combat
- **Mechanics:** Titan shows ATTACK or DEFEND, click matching button in 1.5s
- **Success:** 3 successful reactions
- **Failure:** Click wrong button or run out of time

#### **Basement - Escape Hatch** (`BasementEscape.tsx`)
- **Type:** Hold to Unlock
- **Objective:** Override AI lock to escape
- **Mechanics:** Hold mouse button to fill circular progress bar
- **Success:** Fill bar to 100%
- **Failure:** N/A (progress slowly drains if released)

## Game Flow

```
Interactive Opening
    ↓
Personnel Dossiers
    ↓
Mission Briefing (Authorized)
    ↓
Cinematic Entry
    ↓
┌─────────────────────────────────┐
│ INTERACTIVE FLOORS SYSTEM       │
│                                 │
│ F7 - Data Room (Puzzle)        │
│     ↓ (success)                │
│ F6 - Medbay (Timing)           │
│     ↓ (success)                │
│ F5 - Kitchen (Memory)          │
│     ↓ (success)                │
│ F4 - Accounting (Hidden)       │
│     ↓ (success)                │
│ F3 - Printing (Rhythm)         │
│     ↓ (success)                │
│ F2 - Sleeping Pods (Code)      │
│     ↓ (success)                │
│ F1 - Ballroom (QTE)            │
│     ↓ (success)                │
│ B1 - Basement (Hold)           │
│                                 │
│ Health: ██████████ 100/100    │
│ Corruption: ████░░░░░░ 50%    │
└─────────────────────────────────┘
    ↓
Epilogue / Mission Complete
```

## State Management

### Health System
- **Starting Health:** 100
- **Damage per Failure:** 10 HP
- **Game Over:** Health reaches 0
- **No Health Regeneration**

### Corruption System
- **Starting Corruption:** 0%
- **Increase per Floor:** 12.5% (8 floors = 100%)
- **Visual Feedback:** Yellow-to-red gradient on meter
- **Narrative Element:** Shows AI taking over

### Transitions
- **Down Animation:** Smooth scroll/fade downward between floors
- **Duration:** 1.5 seconds
- **Transition Screen:** Shows "DESCENDING" with floor indicator

## Integration with Existing System

The Interactive Floors System **replaces** the old elevator/floors selection system when accessed via:
1. Complete Interactive Opening
2. View Personnel Dossiers
3. Get Authorized
4. Begin Descent → Cinematic Entry
5. **NEW: Enters Interactive Floors System**

The old `ElevatorLiftInterface` is still accessible via the `main-game` page state, allowing for both experiences to coexist.

## Color Coding by Floor

Each floor has a distinct color theme for visual progression:

| Floor | Name | Color Theme | Emotion |
|-------|------|-------------|---------|
| F7 | Data Room | Cyan/Blue | Cool, Technical |
| F6 | Medbay | Green | Medical, Tense |
| F5 | Kitchen | Orange | Urgent, Warm |
| F4 | Accounting | Purple | Mystery, Stealth |
| F3 | Printing | Indigo | Industrial, Rhythmic |
| F2 | Sleeping Pods | Pink | Memory, Glitch |
| F1 | Ballroom | Red | Danger, Combat |
| B1 | Basement | White | Escape, Hope |

## Future Enhancements

Potential additions for future development:
- **Difficulty Modes:** Easy/Normal/Hard
- **Speedrun Timer:** Track completion time
- **Score System:** Points for perfection
- **Leaderboards:** Compare with others
- **Achievement System:** Unlock special badges
- **Story Collectibles:** Hidden lore on each floor
- **Multiple Paths:** Choose floor order
- **Boss Variations:** Random Titan attack patterns

## Technical Notes

- All games use **Motion (Framer Motion)** for animations
- Games are **responsive** and work on different screen sizes
- **No external dependencies** beyond what's already in the project
- Each game is **self-contained** with its own state management
- Transitions use **AnimatePresence** for smooth exits/enters
