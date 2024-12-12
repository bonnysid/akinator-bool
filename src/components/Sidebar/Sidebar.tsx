import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { NavigateOptions } from 'react-router-dom';
import styles from './Sidebar.module.scss';
import { SidebarItem } from './SidebarItem';
import { ColorPulsator, Icon, MenuItemType } from '@/components';
import { bindStyles } from '@/utils';
import { StorageService } from '@/services';

export type MenuGroupType = {
  title?: string;
  id?: string;
  links: MenuItemType[];
  additionalLinks?: MenuItemType[];
};

export const SIDEBAR_MINIFIED_KEY = 'sidebar-minified';
export const BODY_SIDE_BAR_OPEN_CLASS = "cld-side-bar-open";

const cx = bindStyles(styles);
const bodyRef = document.body;
const storage = StorageService.getInstance();
const isMinifiedDefault = () => {
  const sidebarValue: boolean | null = storage.getItem(SIDEBAR_MINIFIED_KEY);
  if (sidebarValue === null) {
    return false;
  }
  return sidebarValue;
};

type Props = {
  groupItems: MenuGroupType[];
  onNavigate: (to: string, options: NavigateOptions) => void;
  pathname: string;
  isLoading?: boolean;
  commonLinks?: MenuItemType[];
  withoutCommonLinks?: boolean;
};

export const Sidebar: FC<Props> = ({
  onNavigate,
  pathname,
  groupItems,
  withoutCommonLinks,
  isLoading,
  commonLinks,
}) => {
  const [isMinified, setIsMinified] = useState<boolean | null>(isMinifiedDefault);

  const toggleMinified = useCallback(() => {
    storage.setItem(SIDEBAR_MINIFIED_KEY, !isMinified);
    setIsMinified(!isMinified);
  }, [isMinified, setIsMinified]);

  const filterGroupMenuAccess = useCallback(
    (menu: MenuGroupType[]) => {
      return menu
        .reduce((result, item) => {
          const links = item.links && filterMenuAccess(item.links);
          const additionalLinks = item.additionalLinks && filterMenuAccess(item.additionalLinks);

          if (links && links.length === 0) {
            return result;
          }
          const newItem: MenuGroupType = {
            ...item,
            links,
            additionalLinks,
          };
          return [...result, newItem];
        }, [] as MenuGroupType[]);
    },
    [],
  );

  const filterMenuAccess = useCallback(
    (menu: MenuItemType[]) => {
      return menu
        .reduce((result, item) => {
          const subItems = item.subItems && filterMenuAccess(item.subItems);
          if (subItems && subItems.length === 0) {
            return result;
          }
          const newItem: MenuItemType = {
            ...item,
            subItems,
          };
          return [...result, newItem];
        }, [] as MenuItemType[])
    },
    [],
  );

  const groupMenu = useMemo(() => {
    return filterGroupMenuAccess(groupItems);
  }, [filterGroupMenuAccess, groupItems]);

  const commonMenu = useMemo(() => {
    if (withoutCommonLinks) {
      return [];
    }
    return filterMenuAccess(commonLinks || []);
  }, [filterMenuAccess, withoutCommonLinks, commonLinks]);

  const renderedGroupLinks = useMemo(() => {
    if (isLoading) {
      return (
        <div className={cx('loader')}>
          <ColorPulsator />
        </div>
      );
    }

    const renderedGroupMenu = groupMenu.map((item, index) => {
      const renderLinks = (links: MenuItemType[]) => {
        return links.map(
          ({ link, disabled, subItems, iconType, caption, id }) => {
            const isActive = pathname === link || pathname.split('/')[1] === link.replace('/', '');
            return (
              <SidebarItem
                id={id}
                key={link}
                path={link}
                caption={caption}
                disabled={disabled}
                subItems={subItems}
                isMinified={isMinified}
                onNavigate={onNavigate}
                isActive={isActive}
                pathname={pathname}
              >
                {iconType && <Icon type={iconType} />}
              </SidebarItem>
            );
          },
        );
      };

      return (
        <div
          key={`section_${index}`}
          className={cx('groupSection')}
        >
          {!isMinified && item.title && <div className={cx('groupTitle')}>{item.title}</div>}
          <div className={cx('groupItems')}>{renderLinks(item.links)}</div>
          {Boolean(item.additionalLinks?.length) && (
            <div className={cx('groupItems', 'additionalItems')}>
              {renderLinks(item.additionalLinks as MenuItemType[])}
            </div>
          )}
        </div>
      );
    });

    if (withoutCommonLinks) {
      return renderedGroupMenu;
    }

    return (
      <>
        {renderedGroupMenu}
        <div
          key="section_common"
          className={cx('section')}
        >
          {commonMenu.map(({ link, disabled, subItems, iconType, caption, id }) => {
            const isActive = pathname.includes(link);
            return (
              <SidebarItem
                id={id}
                key={link}
                path={link}
                caption={caption}
                disabled={disabled}
                subItems={subItems}
                isMinified={isMinified}
                onNavigate={onNavigate}
                isActive={isActive}
                pathname={pathname}
              >
                {iconType && <Icon type={iconType} />}
              </SidebarItem>
            );
          })}
        </div>
      </>
    );
  }, [groupMenu, commonMenu, withoutCommonLinks, isMinified, onNavigate, pathname]);

  useEffect(() => {
    if (isMinified) {
      bodyRef.classList.remove(BODY_SIDE_BAR_OPEN_CLASS);
    } else {
      bodyRef.classList.add(BODY_SIDE_BAR_OPEN_CLASS);
    }
  }, [isMinified]);

  return (
    <aside className={cx('body', { isMinified })}>
      <nav className={cx('menu')}>
        {!isMinified && <div className={cx('text')}>Подготовил Борцов Никита М2-ИФСТ-21</div>}
        {renderedGroupLinks}
      </nav>
      <div className={cx('minify')}>
        <SidebarItem
          id="hide-menu-button"
          caption={isMinified ? '' : 'Скрыть меню'}
          onClick={toggleMinified}
          onNavigate={onNavigate}
        >
          <Icon
            type="chevron-down"
            className={cx('chevron')}
          />
        </SidebarItem>
      </div>
    </aside>
  );
};
