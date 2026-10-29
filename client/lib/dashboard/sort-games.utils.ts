import { LibraryGame } from '@/types/dashboard/game.types';
import { GameSortOptions } from '@/types/sort/sort.types';

export function sortGames(
  games: LibraryGame[],
  sortBy: GameSortOptions,
): LibraryGame[] {
  switch (sortBy) {
    case 'default':
      return games;
    case 'name-asc':
      return games.toSorted((a, b) => a.game.name.localeCompare(b.game.name));
    case 'name-desc':
      return games.toSorted((a, b) => b.game.name.localeCompare(a.game.name));
    case 'playtime-asc':
      return games.toSorted((a, b) => a.playtimeMinutes - b.playtimeMinutes);
    case 'playtime-desc':
      return games.toSorted((a, b) => b.playtimeMinutes - a.playtimeMinutes);
    default:
      return games;
  }
}
