export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  glowColor: string;
}

export const achievements: Achievement[] = [
  {
    id: 'speed_demon',
    title: 'SPEED DEMON',
    description: 'Complete any floor in under 10 seconds',
    icon: '⚡',
    color: '#eab308',
    glowColor: 'rgba(234, 179, 8, 0.6)'
  },
  {
    id: 'perfectionist',
    title: 'PERFECTIONIST',
    description: 'Complete descent with no health lost',
    icon: '💎',
    color: '#06b6d4',
    glowColor: 'rgba(6, 182, 212, 0.6)'
  },
  {
    id: 'archivist',
    title: 'ARCHIVIST',
    description: 'Collect all 9 data logs',
    icon: '📚',
    color: '#8b5cf6',
    glowColor: 'rgba(139, 92, 246, 0.6)'
  },
  {
    id: 'tactical_veteran',
    title: 'TACTICAL VETERAN',
    description: 'Complete the NAHRAN-7 infiltration',
    icon: '🎖️',
    color: '#22c55e',
    glowColor: 'rgba(34, 197, 94, 0.6)'
  }
];

export function getAchievementById(id: string): Achievement | undefined {
  return achievements.find(a => a.id === id);
}
