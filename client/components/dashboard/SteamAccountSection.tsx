import { cn } from '@/lib/utils';
import { styles } from '@/lib/constants/styles';
import SteamSync from '@/components/dashboard/SteamSync';
import { useQueryClient } from '@tanstack/react-query';
import SteamEdit from '@/components/dashboard/SteamEdit';
import { useAuth } from '@/providers/AuthProvider';

export default function SteamAccountSection() {
  const queryClient = useQueryClient();
  const { refetchUser, user } = useAuth();

  const handleSyncSuccess = async () => {
    await queryClient.invalidateQueries({ queryKey: ['dashboard'] });
  };

  const handleEditSuccess = async () => {
    await refetchUser();
  };

  return (
    <section
      className={cn(
        'flex flex-col gap-3 rounded-xl border p-5 sm:flex-row sm:items-center',
        styles.GLASS_CARD,
      )}
    >
      <div className="flex flex-wrap items-center gap-3">
        <SteamSync onSyncSuccess={handleSyncSuccess} />
        <SteamEdit onEditSuccess={handleEditSuccess} />
      </div>

      <p className="text-sm text-zinc-400 sm:ml-auto">
        Your current Steam ID:{' '}
        <span className="font-medium text-zinc-100">{user?.steamId}</span>
      </p>
    </section>
  );
}
