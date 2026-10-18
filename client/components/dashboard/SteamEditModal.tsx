import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Dispatch, SetStateAction, type SubmitEvent, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { steamIdSchema } from '@/lib/validations/steam.schema';
import { apiClient } from '@/lib/api/apiClient';

interface EditSteamModalProps {
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  onEditSuccess: () => void;
}

export default function SteamEditModal({
  isModalOpen,
  setIsModalOpen,
  onEditSuccess,
}: EditSteamModalProps) {
  const [validationError, setValidationError] = useState<string>('');
  const [apiError, setApiError] = useState<string>('');
  const [steamId, setSteamId] = useState<string>('');

  const handleEdit = async (e: SubmitEvent) => {
    e.preventDefault();
    setValidationError('');
    setApiError('');

    try {
      const result = steamIdSchema.safeParse({ steamId });

      if (!result.success) {
        setValidationError(result.error.issues[0].message);
        return;
      }

      await apiClient('/steam/save', {
        method: 'PATCH',
        body: JSON.stringify({ steamId }),
      });

      setSteamId('');
      setIsModalOpen(false);
      onEditSuccess();
    } catch (error) {
      if (error instanceof Error) {
        setApiError(error.message);
      } else {
        setApiError('Unexpected error occurred while updating Steam ID');
      }
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent className="border-zinc-800 bg-zinc-950 text-zinc-100 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            Change Steam ID
          </DialogTitle>

          <DialogDescription className="pt-2 text-zinc-400">
            Enter a new Steam ID for your account.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleEdit} className="space-y-4">
          <Input
            type="text"
            value={steamId}
            required
            onChange={(e) => setSteamId(e.target.value)}
            placeholder="Enter your new Steam ID..."
            className="border-zinc-800 bg-zinc-900 text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-emerald-500"
          />

          {validationError && (
            <p className="rounded-md border border-red-800/50 bg-red-950/40 p-2.5 text-xs text-red-400">
              SteamID error: {validationError}
            </p>
          )}

          {apiError && (
            <p className="rounded-md border border-red-800/50 bg-red-950/40 p-2.5 text-xs text-red-400">
              Error while saving: {apiError}
            </p>
          )}

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              className="border-zinc-800 text-zinc-300 transition-colors hover:bg-zinc-900 hover:text-zinc-100"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              className="bg-emerald-500 font-medium text-zinc-950 transition-colors hover:bg-emerald-400"
            >
              Confirm & Save
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
