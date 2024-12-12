import { IconTypes } from '@/components';

export type MenuItemType = {
  link: string;
  iconType?: IconTypes;
  caption: string;
  subItems?: MenuItemType[];
  disabled?: boolean;
  id?: string;
};
