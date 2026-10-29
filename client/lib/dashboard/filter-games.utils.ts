import type { LibraryGame } from '@/types/dashboard/game.types';
import type { GameFilterOptions } from '@/types/filters/filters.types';
import { sortGames } from '@/lib/dashboard/sort-games.utils';
import { GameSortOptions } from '@/types/sort/sort.types';

function filterGames(
  filter: GameFilterOptions,
  games: LibraryGame[],
): LibraryGame[] {
  switch (filter) {
    case 'all':
      return games;
    case 'playing':
      return games.filter((game) => game.status === 'playing');
    case 'completed':
      return games.filter((game) => game.status === 'completed');
    case 'backlog':
      return games.filter((game) => game.status === 'backlog');
    default:
      return games;
  }
}

export function getDisplayedGames(
  games: LibraryGame[],
  filter: GameFilterOptions,
  search: string,
  sortBy: GameSortOptions,
): LibraryGame[] {
  const filteredGames = filterGames(filter, games);

  const query = search.trim().toLowerCase();

  const searchedGames = query
    ? filteredGames.filter((game) =>
        game.game.name.toLowerCase().includes(query),
      )
    : filteredGames;

  return sortGames(searchedGames, sortBy);
}
