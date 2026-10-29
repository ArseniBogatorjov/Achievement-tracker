import { Dispatch, SetStateAction } from 'react';
import type { FilterButton } from '@/types/filters/filters.types';
import { Button } from '@/components/ui/button';
import { styles } from '@/lib/constants/styles';
import { cn } from '@/lib/utils';

interface FilterButtonsProps<T extends string> {
  filter: T;
  setFilter: Dispatch<SetStateAction<T>>;
  filters: FilterButton<T>[];
}

export default function FilterButtons<T extends string>({
  filter,
  setFilter,
  filters,
}: FilterButtonsProps<T>) {
  return (
    <div
      className={cn(
        'inline-flex w-fit items-center rounded-lg border p-1',
        styles.GLASS_CARD,
      )}
    >
      {filters.map(({ value, label, className }) => (
        <Button
          key={value}
          variant={filter === value ? 'default' : 'ghost'}
          onClick={() => setFilter(value)}
          className={cn('h-7 px-3 text-sm', className)}
        >
          {label}
        </Button>
      ))}
    </div>
  );
}
