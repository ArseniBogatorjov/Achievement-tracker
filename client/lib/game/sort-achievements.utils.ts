import type { Achievement } from '@/types/dashboard/achievement.types';
import { AchievementSortOptions } from '@/types/sort/sort.types';

export function sortAchievements(
  achievements: Achievement[],
  sortBy: AchievementSortOptions,
) {
  switch (sortBy) {
    case 'default':
      return achievements;
    case 'name-asc':
      return achievements.toSorted((a, b) => a.name.localeCompare(b.name));
    case 'name-desc':
      return achievements.toSorted((a, b) => b.name.localeCompare(a.name));
    case 'rarity-asc':
      return achievements.toSorted((a, b) => b.globalRarity - a.globalRarity);
    case 'rarity-desc':
      return achievements.toSorted((a, b) => a.globalRarity - b.globalRarity);
    default:
      return achievements;
  }
}
