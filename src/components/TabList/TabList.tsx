import { TabType } from '@/components/TabList/types.ts';
import styles from './TabList.module.scss';
import { bindStyles } from '@/utils';
import { Tab } from '@/components/TabList/Tab';

type Props<T> = {
  tabs: TabType<T>[];
  value: T;
  onChange: (value: T, tab: TabType<T>) => void;
}

const cx = bindStyles(styles);

export const TabList = <T,>({ tabs, onChange, value }: Props<T>) => {
  return (
    <div className={cx('container')}>
      {tabs.map(tab => (
        <Tab
          key={tab.text}
          text={tab.text}
          value={tab.value}
          onClick={() => onChange(tab.value, tab)}
          count={tab.count}
          icon={tab.icon}
          isActive={tab.value === value}
        />
      ))}
    </div>
  )
}
