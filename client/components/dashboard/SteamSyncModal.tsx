'use client';

import { Dispatch, SetStateAction, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AlertTriangle, RefreshCw, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/api/apiClient';

interface SteamSyncModalProps {
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  onSyncSuccess: () => void;
}

export default function SteamSyncModal({
  isModalOpen,
  setIsModalOpen,
  onSyncSuccess,
}: SteamSyncModalProps) {
  const [apiError, setApiError] = useState('');

  const handleConfirmSync = async () => {
    setApiError('');

    try {
      await apiClient('/steam/sync', {
        method: 'POST',
      });

      setIsModalOpen(false);
      onSyncSuccess();
    } catch (error) {
      if (error instanceof Error) {
        setApiError(error.message);
      } else {
        setApiError('An unexpected error occurred during synchronization');
      }
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent className="border-zinc-800 bg-zinc-950 text-zinc-100 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Sync Requirements
          </DialogTitle>
          <DialogDescription className="pt-2 text-zinc-400">
            Please verify your Steam account configuration before starting the
            import process.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-3 text-sm text-zinc-300">
          <div className="flex items-start gap-3 rounded-lg border border-zinc-800 bg-zinc-900/50 p-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
            <div>
              <p className="font-semibold text-zinc-200">Public Profile</p>
              <p className="mt-0.5 text-xs text-zinc-400">
                Set your Steam Privacy Settings for both{' '}
                <strong className="text-zinc-200">Profile</strong> and{' '}
                <strong className="text-zinc-200">Game details</strong> to{' '}
                <strong className="text-zinc-200">Public</strong>.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-lg border border-zinc-800 bg-zinc-900/50 p-3">
            <RefreshCw className="mt-0.5 h-5 w-5 shrink-0 text-cyan-400" />
            <div>
              <p className="font-semibold text-zinc-200">Processing Time</p>
              <p className="mt-0.5 text-xs text-zinc-400">
                Large game libraries may take from{' '}
                <strong className="text-zinc-200">
                  30 seconds up to a few minutes
                </strong>{' '}
                to complete initial synchronization.
              </p>
            </div>
          </div>

          {apiError && (
            <p
              role="alert"
              className="rounded-md border border-red-800/50 bg-red-950/40 p-2.5 text-xs text-red-400"
            >
              Sync error: {apiError}
            </p>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsModalOpen(false)}
            className="border-zinc-800 text-zinc-300 hover:bg-zinc-900 hover:text-zinc-100"
          >
            Cancel
          </Button>

          <Button
            type="button"
            onClick={handleConfirmSync}
            className="bg-emerald-500 text-zinc-950 hover:bg-emerald-400"
          >
            Confirm & Sync
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
