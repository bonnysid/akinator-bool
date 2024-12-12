import { FC, ReactNode, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import Popup from 'reactjs-popup';
import { EventType, PopupPosition } from 'reactjs-popup/dist/types';

import { bindStyles } from '@/utils';

import styles from './Tooltip.module.scss';

const cx = bindStyles(styles);

type TooltipContentItem = JSX.Element | string | number;

type Classes = {
  trigger?: string;
  tooltip?: string;
  tooltipTextItem?: string;
};

type Positions = 'top' | 'bottom' | 'right' | 'left';

type Props = {
  id?: string;
  text: TooltipContentItem | TooltipContentItem[];
  children: ReactNode;
  position?: PopupPosition[];
  disabled?: boolean;
  place?: Positions;
  events?: EventType[];
  classes?: Partial<Classes>;
  tooltipItemsLimit?: number;
  moreItemsRender?: (count: number) => TooltipContentItem;
};

const POSITIONS: Record<Positions, PopupPosition[]> = {
  top: ['top center', 'bottom center'],
  bottom: ['bottom center', 'top center'],
  left: ['left center', 'right center'],
  right: ['right center', 'left center'],
};

const EVENTS: EventType[] = ['hover'];

const CONTENT_CLASS = '[role="tooltip"].popup-content svg';

const Tooltip: FC<Props> = ({
  id = 'tooltip',
  children,
  place = 'bottom',
  classes,
  events,
  text,
  disabled,
  position,
  tooltipItemsLimit = Infinity,
  moreItemsRender = (count) => `+${count}...`,
}) => {
  const [open, setOpen] = useState<boolean>(false);

  const onOpen = () => {
    setOpen(true);
  };
  const onClose = () => setOpen(false);

  useEffect(() => {
    if (disabled) {
      onClose();
      return;
    }

    window.addEventListener('wheel', onClose);

    return () => {
      window.removeEventListener('wheel', onClose);
    };
  }, [disabled]);

  const updateArrowPosition = () => {
    const arrowSvg = document.querySelector(CONTENT_CLASS);

    if (!arrowSvg) {
      return;
    }

    (arrowSvg as SVGElement).style.transform = 'translateY(25%)';
  };

  useLayoutEffect(() => {
    if (!open) {
      return;
    }

    updateArrowPosition();
  }, [open]);

  const arrowStyle = useMemo(
    () => ({
      color: '#303940',
    }),
    [],
  );

  const tooltipContent = useMemo(() => {
    if (!Array.isArray(text)) {
      return text;
    }

    const hiddenItemsCount = text.length - tooltipItemsLimit;
    const newText =
      hiddenItemsCount > 0
        ? text.slice(0, tooltipItemsLimit).concat(moreItemsRender(hiddenItemsCount))
        : text;

    return newText.map((item, i) => (
      <p
        key={i}
        className={cx('tooltip__text', classes?.tooltipTextItem)}
      >
        {item}
      </p>
    ));
  }, [text, tooltipItemsLimit, moreItemsRender]);

  return (
    <Popup
      arrow
      mouseEnterDelay={150}
      disabled={disabled}
      open={open}
      onOpen={onOpen}
      onClose={onClose}
      trigger={<div className={cx(classes?.trigger)}>{children}</div>}
      position={position || POSITIONS[place]}
      on={events || EVENTS}
      arrowStyle={arrowStyle}
      className="tooltip"
    >
      <div
        id={id}
        className={cx('tooltip', classes?.tooltip)}
        data-testid="tooltip"
      >
        {tooltipContent}
      </div>
    </Popup>
  );
};

export { Tooltip };
export type {
  Props as TooltipProps,
  Classes as TooltipClasses,
  TooltipContentItem,
  Positions as TooltipPositions,
};
