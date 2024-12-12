import { FC, PropsWithChildren, SyntheticEvent, useMemo } from 'react';
import { NavigateOptions } from 'react-router-dom';

import styles from './SidebarItem.module.scss';
import { bindStyles } from '@/utils';
import { usePopupControls } from '@/hooks';
import { Icon, IconSizes, Popup, TextShorter, Tooltip } from '@/components';
import { MenuItemType } from '@/components/Sidebar/types.ts';

type Props = PropsWithChildren<{
  path?: string;
  disabled?: boolean;
  caption?: string;
  onClick?: () => void;
  subItems?: MenuItemType[];
  isMinified?: boolean | null;
  isSubItem?: boolean;
  onNavigate: (to: string, options: NavigateOptions) => void;
  isActive?: boolean;
  pathname?: string;
  id?: string;
}>;

const cx = bindStyles(styles);

export const SidebarItem: FC<Props> = ({
  path,
  disabled,
  caption = '',
  onClick,
  subItems,
  children,
  isMinified,
  isSubItem,
  onNavigate,
  isActive,
  pathname,
  id,
}) => {
  const { openPopup, closePopup, isOpened: popupOpened } = usePopupControls();

  const isHoldsPopup = !!subItems && isMinified;

  const onLinkClick = (e: SyntheticEvent) => {
    onClick?.();

    if (path && !isHoldsPopup) {
      const subItemPath = subItems
        ? subItems.find((item) => item.link === '')?.link ?? subItems[0].link
        : '';
      const itemPath = path + subItemPath;
      onNavigate(itemPath, { replace: true });
    }
    if (!isHoldsPopup) {
      return;
    }
    e.preventDefault();
    openPopup();
  };

  const onSubitemClick = () => {
    isHoldsPopup && closePopup();
  };

  const bodyClasses = cx('body', {
    disabled,
    isSubItem,
    isHoldsPopup,
    popupOpened,
    isMinified,
  });

  const contentNode = (
    <div className={cx('wrapper')}>
      {children && <div className={cx('icon')}>{children}</div>}
      <TextShorter className={cx('text')}>{caption}</TextShorter>
    </div>
  );

  const itemNode = (
    <button
      id={id}
      onClick={onLinkClick}
      className={cx(bodyClasses, { isActive })}
    >
      {contentNode}
      <div className={cx('itemControls')}>
        {subItems && !isMinified && (
          <Icon
            type="chevron-down"
            size={IconSizes.M}
            className={cx('icon', 'chevron')}
          />
        )}
      </div>
    </button>
  );

  const subitemsNode = useMemo(
    () =>
      subItems?.map(({ disabled, link, caption }) => {
        const subItemPath = `${path}${link}`;
        const subItemsIsActive = pathname === subItemPath;
        return (
          <SidebarItem
            key={link}
            isActive={subItemsIsActive}
            path={subItemPath}
            caption={caption}
            disabled={disabled}
            isSubItem
            onNavigate={onNavigate}
            onClick={onSubitemClick}
          />
        );
      }),
    [subItems, pathname, path],
  );

  return path ? (
    <Tooltip
      text={caption}
      place="top"
      disabled={disabled || !isMinified}
    >
      {isHoldsPopup ? (
        <Popup
          keepTooltipInside
          closeOnDocumentClick
          position="bottom left"
          trigger={itemNode}
          open={popupOpened}
          onClose={closePopup}
          className={cx('popup', 'subItems')}
        >
          {subitemsNode}
        </Popup>
      ) : (
        <>
          {itemNode}
          {subItems && isActive && (
            <div className={cx('subItems', 'subWrapper')}>{subitemsNode}</div>
          )}
        </>
      )}
    </Tooltip>
  ) : (
    <button
      id={id}
      className={cx(bodyClasses, 'button')}
      onClick={onClick}
      type="button"
      disabled={disabled}
    >
      {contentNode}
    </button>
  );
};
