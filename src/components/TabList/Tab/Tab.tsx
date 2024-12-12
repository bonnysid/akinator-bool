import { Counter, Icon } from '@/components';
import { bindStyles, isUndefinedOrNull } from '@/utils';
import styles from './Tab.module.scss';
import { TabType } from '@/components/TabList';

export type TabProps<T> = TabType<T> & {
  isActive?: boolean;
  onClick: () => void;
}

const cx = bindStyles(styles);

export const Tab = <T,>({ icon, count, text, onClick, isActive }: TabProps<T>) => {
  return (
    <button onClick={onClick} className={cx('container', { isActive })}>
      {icon && <Icon type={icon} className={cx('icon')} />}
      <div className={cx('text')}>{text}</div>
      {!isUndefinedOrNull(count) && (
        <Counter count={count} />
      )}
    </button>
  )
}
