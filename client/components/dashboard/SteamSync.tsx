'use client';

import { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SteamSyncModal from '@/components/dashboard/SteamSyncModal';

interface SteamSyncProps {
  onSyncSuccess: () => void;
}

export default function SteamSync({ onSyncSuccess }: SteamSyncProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="bg-emerald-500 font-medium text-zinc-950 transition-colors hover:bg-emerald-400"
      >
        <RefreshCw className="mr-2 h-4 w-4" />
        Sync Library
      </Button>

      <SteamSyncModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        onSyncSuccess={onSyncSuccess}
      />
    </>
  );
}
