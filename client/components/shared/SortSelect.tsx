import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Dispatch, SetStateAction } from 'react';
import type { SortOption } from '@/types/sort/sort.types';
import { styles } from '@/lib/constants/styles';

interface SortSelectProps<T extends string> {
  options: SortOption<T>[];
  sortBy: T;
  setSortBy: Dispatch<SetStateAction<T>>;
}

export default function SortSelect<T extends string>({
  options,
  sortBy,
  setSortBy,
}: SortSelectProps<T>) {
  return (
    <Select value={sortBy} onValueChange={(value: T) => setSortBy(value)}>
      <SelectTrigger
        className={`h-8 w-full text-sm sm:w-45 bg-black/40 backdrop-blur-md border-white/5 hover:border-emerald-500/50 ${styles.GLASS_CARD}`}
      >
        <SelectValue placeholder={sortBy} />
      </SelectTrigger>

      <SelectContent
        position="popper"
        align="start"
        sideOffset={4}
        className="z-50 min-w-45 overflow-hidden rounded-lg border border-white/10 bg-black/90 p-1 text-zinc-100 shadow-xl backdrop-blur-xl"
      >
        {options.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value}
            className="cursor-pointer rounded-md px-2.5 py-1.5 text-sm outline-none transition-colors focus:bg-emerald-500/20 focus:text-emerald-300"
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
