import { bindStyles } from '@/utils';
import { Icon, IconSizes, Tooltip } from '@/components';

import styles from './Caption.module.scss';

export type CaptionProps = {
  caption?: string;
  hint?: string | JSX.Element;
};

const cx = bindStyles(styles);

export const Caption = ({ caption, hint }: CaptionProps) => {
  if (!caption) {
    return null;
  }

  return (
    <div className={cx('caption')}>
      {caption}
      {hint && (
        <Tooltip
          text={hint}
          place="top"
        >
          <Icon
            type="question-mark-circle"
            size={IconSizes.M}
            className={cx('icon', 'hint')}
          />
        </Tooltip>
      )}
    </div>
  );
};
