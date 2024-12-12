import { FC, PropsWithChildren } from 'react';
import styles from './WaveBackground.module.scss';
import { bindStyles } from '@/utils';
import TypingText from '@/components/TypingText/TypingText.tsx';

export enum WaveBackgroundVariant {
  BAD = 'bad',
  GOOD = 'good',
  NEUTRAL = 'neutral',
  DEFAULT = 'default',
}

interface WaveBackgroundProps {
  text?: string;
  variant?: WaveBackgroundVariant;
}

const cx = bindStyles(styles)

const WaveBackground: FC<PropsWithChildren<WaveBackgroundProps>> = ({ text = "Моя волна", variant = WaveBackgroundVariant.DEFAULT, children }) => {
  return (
    <div className={cx('waveContainer', variant)}>
      <div className={cx('content')}>
        <TypingText text={text} />
        {children}
      </div>
    </div>
  );
};

export default WaveBackground;
