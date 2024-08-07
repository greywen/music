'use client';
import './index.css';
import Image from 'next/image';
import PlayIcon from '../Icons/PlayIcon';
import PauseIcon from '../Icons/PauseIcon';
import NextIcon from '../Icons/NextIcon';

type Props = {
  title: string;
  description: string;
  playing?: boolean;
  onPlay?: () => void;
  onPause?: () => void;
  onNext?: () => void;
};

const PlayBar = (props: Props) => {
  const { title, description, playing, onPlay, onPause, onNext } = props;
  return (
    <div className='play-bar-warp'>
      <div className='play-bar'>
        <div className='play-bar-left'>
          <div>
            <Image
              alt=''
              src='https://y.gtimg.cn/music/photo_new/T002R300x300M000003piLsO07y5KR_2.jpg'
              width={40}
              height={40}
            />
          </div>
          <div>
            <div className='play-bar-title'>{title}</div>
            <div className='play-bar-description'>{description}</div>
          </div>
        </div>
        <div className='play-bar-right'>
          {playing ? (
            <span onClick={onPause && onPause}>
              <PauseIcon />
            </span>
          ) : (
            <span onClick={onPlay && onPlay}>
              <PlayIcon />
            </span>
          )}
          <span onClick={onNext && onNext}>
            <NextIcon />
          </span>
        </div>
      </div>
    </div>
  );
};
export default PlayBar;
