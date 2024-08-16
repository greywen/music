'use client';
import './index.css';
import Image from 'next/image';
import PlayIcon from '../Icons/PlayIcon';
import PauseIcon from '../Icons/PauseIcon';
import NextIcon from '../Icons/NextIcon';
import { IMusicSearchResult } from '@/interfaces/search';
type Props = {
  music?: IMusicSearchResult | null;
  playing?: boolean;
  onPlay?: () => void;
  onPause?: () => void;
  onNext?: () => void;
  onClickLeft?: () => void;
};

const PlayBar = (props: Props) => {
  const { music, playing, onPlay, onPause, onNext, onClickLeft } = props;

  function handlePlay() {
    music && onPlay && onPlay();
  }

  function handlePause() {
    music && onPause && onPause();
  }

  function handleNext() {
    music && onNext && onNext();
  }

  function handleClickLeft() {
    music && onClickLeft && onClickLeft();
  }

  const iconPathProps = { ...(music ? {} : { path: { fill: 'gray' } }) };

  return (
    <div className='play-bar-warp'>
      <div className='play-bar'>
        <div className='play-bar-left' onClick={handleClickLeft}>
          <Image
            alt=''
            src={
              music ? '/files/cover?id=' + music.coverId : '/images/music.jpg'
            }
            width={40}
            height={40}
          />
          {music && (
            <div>
              <div className='play-bar-title'>{music.name}</div>
              <div className='play-bar-description'>{`${music.artist} - ${music.name}`}</div>
            </div>
          )}
        </div>
        <div className='play-bar-right'>
          {playing ? (
            <span onClick={handlePause}>
              <PauseIcon {...iconPathProps} />
            </span>
          ) : (
            <span onClick={handlePlay}>
              <PlayIcon {...iconPathProps} />
            </span>
          )}
          <span onClick={handleNext}>
            <NextIcon {...iconPathProps} />
          </span>
        </div>
      </div>
    </div>
  );
};
export default PlayBar;
