import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Dispatch, SetStateAction } from 'react';
import type { SortSelect } from '@/types/sort/sort.types';

interface SortSelectProps<T extends string> {
  options: SortSelect<T>[];
  placeholder: string;
  sortBy: T;
  setSortBy: Dispatch<SetStateAction<T>>;
}

export default function SortSelect<T extends string>({
  options,
  placeholder,
  sortBy,
  setSortBy,
}: SortSelectProps<T>) {
  return (
    <Select value={sortBy} onValueChange={(value: T) => setSortBy(value)}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
