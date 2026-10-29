export interface SortSelect<T extends string> {
  label: string;
  value: T;
}

export type GameSortOptions =
  'default' | 'playtime-desc' | 'playtime-asc' | 'name-asc' | 'name-desc';
