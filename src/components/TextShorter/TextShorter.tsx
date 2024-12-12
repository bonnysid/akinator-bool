import { useMemo, useState, FC, PropsWithChildren } from 'react';
import { EventType } from 'reactjs-popup/dist/types';

import { Tooltip } from '../Tooltip';
import styles from './TextShorter.module.scss';
import { bindStyles } from '@/utils';

type Props = PropsWithChildren<{
  className?: string;
  tooltip?: boolean;
  tooltipId?: string;
  clickEvent?: boolean;
  selectTooltip?: boolean;
}>;

const cx = bindStyles(styles);

const TT_EVENTS: EventType[] = ['focus', 'hover'];

const TextShorter: FC<Props> = ({
  tooltip,
  className,
  children,
  clickEvent,
  tooltipId,
  selectTooltip,
}) => {
  const tooltipContent = <>{children}</>;

  const [showTooltip, setShowTooltip] = useState<boolean>(false);

  const tooltipEvents = useMemo(() => {
    const newEvents = TT_EVENTS;
    if (clickEvent) {
      newEvents.push('click');
    }

    return newEvents;
  }, [TT_EVENTS, clickEvent]);

  const onMouseEnter = (event: React.MouseEvent<HTMLDivElement>) => {
    setShowTooltip(event.currentTarget.scrollWidth > event.currentTarget.clientWidth);
  };

  const tooltipPlace = selectTooltip ? 'top' : 'bottom';

  if (tooltip && showTooltip) {
    return (
      <div
        className={cx(className, 'wrapper')}
        data-testid="wrapper-test"
      >
        <Tooltip
          id={tooltipId}
          place={tooltipPlace}
          events={tooltipEvents}
          text={tooltipContent}
        >
          <div
            className={cx('content')}
            onMouseEnter={tooltip ? onMouseEnter : undefined}
          >
            {children}
          </div>
        </Tooltip>
      </div>
    );
  }

  return (
    <div
      className={cx(className, 'content', 'wrapper')}
      data-testid="wrapper-test"
      onMouseEnter={tooltip ? onMouseEnter : undefined}
    >
      {children}
    </div>
  );
};

export { TextShorter };
