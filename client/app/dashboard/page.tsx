'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/apiClient';
import StatisticsSection from '@/components/dashboard/StatisticsSection';
import GamesList from '@/components/dashboard/GamesList';
import { useMemo, useState } from 'react';
import type { DashboardStats } from '@/types/dashboard/dashboard.types';
import type { GameFilterOptions } from '@/types/filters/filters.types';
import type { LibraryGame } from '@/types/dashboard/game.types';
import DataErrorPage from '@/components/shared/DataErrorPage';
import Searchbar from '@/components/shared/Searchbar';
import FilterButtons from '@/components/shared/FilterButtons';
import DashboardSkeleton from '@/components/dashboard/DashboardSkeleton';
import { GAME_FILTERS } from '@/lib/constants/filters';
import SaveSteamSection from '@/components/dashboard/SaveSteamSection';
import { useAuth } from '@/providers/AuthProvider';
import SteamAccountSection from '@/components/dashboard/SteamAccountSection';
import SortSelect from '@/components/shared/SortSelect';
import { GAME_SORTING } from '@/lib/constants/sorting';
import { GameSortOptions } from '@/types/sort/sort.types';
import { getDisplayedGames } from '@/lib/dashboard/filter-games.utils';

export default function Dashboard() {
  const {
    data: stats,
    isLoading: isStatsLoading,
    isError: isStatsError,
  } = useQuery<DashboardStats>({
    queryKey: ['dashboard', 'stats'],
    queryFn: () => apiClient('/dashboard/stats'),
  });

  const {
    data: games,
    isLoading: isGamesLoading,
    isError: isGamesError,
  } = useQuery<LibraryGame[]>({
    queryKey: ['dashboard', 'playing'],
    queryFn: () => apiClient('/dashboard/library'),
  });

  const [filter, setFilter] = useState<GameFilterOptions>('all');
  const [sortBy, setSortBy] = useState<GameSortOptions>('default');
  const [search, setSearch] = useState<string>('');

  const { user, refetchUser } = useAuth();

  const filteredGames = useMemo(
    () => getDisplayedGames(games ?? [], filter, search, sortBy),
    [filter, games, search, sortBy],
  );

  const handleSaveSuccess = async () => {
    await refetchUser();
  };

  if (isStatsLoading || isGamesLoading) {
    return <DashboardSkeleton />;
  }

  if (isStatsError || isGamesError) {
    return <DataErrorPage />;
  }

  return (
    <main className="min-h-screen p-6 md:p-10 text-zinc-100">
      <div className="mx-auto max-w-7xl space-y-10">
        <StatisticsSection
          totalGames={stats?.totalGames ?? 0}
          completedGames={stats?.completedGames ?? 0}
          averageCompletionPercent={stats?.averageCompletionPercent ?? 0}
        />
        {user?.steamId ? (
          <SteamAccountSection />
        ) : (
          <SaveSteamSection onSaveSuccess={handleSaveSuccess} />
        )}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <FilterButtons
            filter={filter}
            setFilter={setFilter}
            filters={GAME_FILTERS}
          />
          <SortSelect
            placeholder={'default'}
            sortBy={sortBy}
            setSortBy={setSortBy}
            options={GAME_SORTING}
          />
          <Searchbar
            search={search}
            setSearch={setSearch}
            placeholder="Search for game..."
          />
        </div>
        <GamesList games={filteredGames} />
      </div>
    </main>
  );
}
