import { Button } from '@/components/ui/button';
import { SquarePen } from 'lucide-react';
import { useState } from 'react';
import SteamEditModal from '@/components/dashboard/SteamEditModal';

interface SteamEditProps {
  onEditSuccess: () => void;
}

export default function SteamEdit({ onEditSuccess }: SteamEditProps) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  return (
    <>
      <Button
        type="button"
        variant="outline"
        onClick={() => setIsModalOpen(true)}
        className="border-zinc-700 bg-zinc-900 font-medium text-zinc-200 transition-colors hover:border-zinc-600 hover:bg-zinc-800 hover:text-white"
      >
        <SquarePen className="mr-2 h-4 w-4" />
        Edit Steam ID
      </Button>

      <SteamEditModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        onEditSuccess={onEditSuccess}
      />
    </>
  );
}
