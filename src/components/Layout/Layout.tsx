import { FC } from 'react';
import { bindStyles } from '@/utils';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Sidebar } from '@/components';
import { LINKS } from '@/router';
import styles from './Layout.module.scss';

const cx = bindStyles(styles);

export const Layout: FC = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <div className={cx('container')}>
      <Sidebar
        groupItems={LINKS}
        pathname={pathname}
        withoutCommonLinks
        onNavigate={navigate}
      />
      <div className={cx('content')}>
        <Outlet />
      </div>
    </div>
  )
}
