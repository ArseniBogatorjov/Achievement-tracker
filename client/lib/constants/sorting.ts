import { GameSortOptions, SortSelect } from '@/types/sort/sort.types';

export const GAME_SORTING: SortSelect<GameSortOptions>[] = [
  { label: 'default', value: 'default' },
  { label: 'Playtime: highest first', value: 'playtime-desc' },
  { label: 'Playtime: lowest first', value: 'playtime-asc' },
  { label: 'Name: A–Z', value: 'name-asc' },
  { label: 'Name: Z–A', value: 'name-desc' },
];
