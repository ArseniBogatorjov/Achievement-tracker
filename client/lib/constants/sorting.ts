import {
  AchievementSortOptions,
  GameSortOptions,
  SortOption,
} from '@/types/sort/sort.types';

export const GAME_SORTING: SortOption<GameSortOptions>[] = [
  { label: 'default', value: 'default' },
  { label: 'Playtime: highest first', value: 'playtime-desc' },
  { label: 'Playtime: lowest first', value: 'playtime-asc' },
  { label: 'Name: A–Z', value: 'name-asc' },
  { label: 'Name: Z–A', value: 'name-desc' },
];

export const ACHIEVEMENT_SORTING: SortOption<AchievementSortOptions>[] = [
  { label: 'default', value: 'default' },
  { label: 'Name: A–Z', value: 'name-asc' },
  { label: 'Name: Z–A', value: 'name-desc' },
  { label: 'Rarity: highest first', value: 'rarity-desc' },
  { label: 'Rarity: lowest first', value: 'rarity-asc' },
];
