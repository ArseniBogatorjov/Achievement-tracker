export interface SortOption<T extends string> {
  label: string;
  value: T;
}

export type GameSortOptions =
  'default' | 'playtime-desc' | 'playtime-asc' | 'name-asc' | 'name-desc';

export type AchievementSortOptions =
  'default' | 'name-asc' | 'name-desc' | 'rarity-asc' | 'rarity-desc';
