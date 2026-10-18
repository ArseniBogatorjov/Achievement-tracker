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
import { getDisplayedGames } from '@/lib/dashboard/filter-games.utils';
import Searchbar from '@/components/shared/Searchbar';
import FilterButtons from '@/components/shared/FilterButtons';
import DashboardSkeleton from '@/components/dashboard/DashboardSkeleton';
import { GAME_FILTERS } from '@/lib/constants/filters';
import SaveSteamSection from '@/components/dashboard/SaveSteamSection';
import { useAuth } from '@/providers/AuthProvider';
import SteamAccountSection from '@/components/dashboard/SteamAccountSection';

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
    isLoading: isPlayingLoading,
    isError: isPlayingError,
  } = useQuery<LibraryGame[]>({
    queryKey: ['dashboard', 'playing'],
    queryFn: () => apiClient('/dashboard/library'),
  });

  const [filter, setFilter] = useState<GameFilterOptions>('all');
  const [search, setSearch] = useState<string>('');

  const { user, refetchUser } = useAuth();

  const filteredGames = useMemo(
    () => getDisplayedGames(games ?? [], filter, search),
    [filter, games, search],
  );

  const handleSaveSuccess = async () => {
    await refetchUser();
  };

  if (isStatsLoading || isPlayingLoading) {
    return <DashboardSkeleton />;
  }

  if (isStatsError || isPlayingError) {
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
