import { IconTypes } from '@/components';

export type TabType<T> = {
  text: string;
  value: T;
  icon?: IconTypes;
  count?: number;
}
