'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { apiClient } from '@/lib/api/apiClient';
import type { GameDetails } from '@/types/dashboard/game.types';
import GameOverall from '@/components/game/GameOverall';
import DataErrorPage from '@/components/shared/DataErrorPage';
import AchievementList from '@/components/game/AchievementList';
import { useMemo, useState } from 'react';
import type { AchievementFilterOptions } from '@/types/filters/filters.types';
import Searchbar from '@/components/shared/Searchbar';
import { getDisplayedAchievements } from '@/lib/game/filter-achievements.utils';
import FilterButtons from '@/components/shared/FilterButtons';
import GameSkeleton from '@/components/game/GameSkeleton';
import { ACHIEVEMENT_FILTERS } from '@/lib/constants/filters';

export default function GamePage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<AchievementFilterOptions>('all');

  const params = useParams();
  const gameId = params.id as string;

  const {
    data: game,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['game', gameId],
    queryFn: () => apiClient<GameDetails>(`/dashboard/game/${gameId}`),
    staleTime: 5 * 60 * 1000,
  });

  const unlockedAchievements =
    game?.game.achievements?.filter(
      (achievement) =>
        achievement.userAchievements && achievement.userAchievements.length > 0,
    ).length ?? 0;

  const filteredAchievements = useMemo(
    () =>
      getDisplayedAchievements(game?.game.achievements ?? [], filter, search),
    [filter, search, game?.game.achievements],
  );

  if (isError) {
    return <DataErrorPage />;
  }

  if (isLoading) {
    return <GameSkeleton />;
  }

  return (
    <main className="min-h-screen p-6 md:p-10 text-zinc-100">
      <div className="mx-auto max-w-7xl space-y-10">
        <GameOverall
          name={game?.game.name ?? 'Game name is missing'}
          poster={game?.game.coverUrl ?? ''}
          playtimeMinutes={game?.playtimeMinutes ?? 0}
          completionPercent={game?.completionPercent ?? 0}
          status={game?.status ?? 'playing'}
          totalAchievements={game?.game.achievements?.length ?? 0}
          unlockedAchievements={unlockedAchievements}
        />
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <FilterButtons
            filter={filter}
            setFilter={setFilter}
            filters={ACHIEVEMENT_FILTERS}
          />
          <Searchbar
            search={search}
            setSearch={setSearch}
            placeholder="Search for achievement..."
          />
        </div>
        <AchievementList achievements={filteredAchievements} />
      </div>
    </main>
  );
}
