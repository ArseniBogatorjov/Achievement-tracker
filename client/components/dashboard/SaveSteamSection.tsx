import { cn } from '@/lib/utils';
import { styles } from '@/lib/constants/styles';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { steamIdSchema } from '@/lib/validations/steam.schema';
import { type SubmitEvent, useState } from 'react';
import { apiClient } from '@/lib/api/apiClient';

interface SteamSaveProps {
  onSaveSuccess: () => void;
}

export default function SaveSteamSection({ onSaveSuccess }: SteamSaveProps) {
  const [steamId, setSteamId] = useState<string>('');
  const [validationError, setValidationError] = useState<string>('');
  const [apiError, setApiError] = useState<string>('');

  const handleSaveSteam = async (e: SubmitEvent) => {
    e.preventDefault();

    setApiError('');
    setValidationError('');

    const result = steamIdSchema.safeParse({ steamId });

    if (!result.success) {
      setValidationError(result.error.issues[0]?.message || 'Invalid Steam ID');
      return;
    }

    try {
      await apiClient('/steam/save', {
        method: 'PATCH',
        body: JSON.stringify({ steamId }),
      });

      setSteamId('');
      onSaveSuccess();
    } catch (error) {
      if (error instanceof Error) {
        setApiError(error.message);
      } else {
        setApiError('An unexpected error occurred during saving steam ID');
      }
    }
  };

  return (
    <section className={cn('rounded-xl border p-5', styles.GLASS_CARD)}>
      <form
        onSubmit={handleSaveSteam}
        className="flex flex-col gap-3 sm:flex-row sm:items-start"
      >
        <div className="flex-1 space-y-1">
          <Input
            type="text"
            placeholder="Enter SteamID64 (17 digits)"
            value={steamId}
            onChange={(e) => {
              setSteamId(e.target.value);
            }}
            className={cn(styles.INPUT, 'focus-visible:ring-emerald-500')}
          />
          {validationError && (
            <p className="pl-1 text-xs text-red-400">{validationError}</p>
          )}
          {apiError && <p className="pl-1 text-xs text-red-400">{apiError}</p>}
        </div>
        <Button
          type="submit"
          className="bg-emerald-500 font-medium text-zinc-950 transition-colors hover:bg-emerald-400"
        >
          Save SteamID
        </Button>
      </form>
    </section>
  );
}
