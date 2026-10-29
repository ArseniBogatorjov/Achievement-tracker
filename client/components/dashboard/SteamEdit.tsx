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
        variant="default"
        onClick={() => setIsModalOpen(true)}
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
