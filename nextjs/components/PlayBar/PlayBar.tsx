'use client';
import Image from 'next/image';
import PlayIcon from '../Icons/PlayIcon';
import PauseIcon from '../Icons/PauseIcon';
import NextIcon from '../Icons/NextIcon';
import { IGetMusicSearchResult } from '@/interfaces/search';

type Props = {
  music?: IGetMusicSearchResult | null;
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
    <div className='fixed z-10 bottom-3 right-0 left-0 max-w-3xl mx-auto px-3'>
      <div className='flex items-center p-3 bg-white h-14 rounded-2xl shadow-md shadow-[rgba(70,96,187,0.2)]'>
        <div
          className='flex items-center gap-2 w-3/4 cursor-pointer'
          onClick={handleClickLeft}
        >
          <Image
            alt=''
            src={music ? music.coverUrl : '/images/music.jpg'}
            width={40}
            height={40}
            className='rounded-md'
          />
          {music && (
            <div>
              <div className='font-normal text-base truncate w-44'>
                {music.name}
              </div>
              <div className='font-light text-sm truncate w-44 text-gray-500'>
                {`${music.artist} - ${music.name}`}
              </div>
            </div>
          )}
        </div>
        <div className='flex items-center gap-2.5 justify-center w-1/4'>
          {playing ? (
            <span
              onClick={handlePause}
              className='flex justify-center items-center w-10 h-10'
            >
              <PauseIcon {...iconPathProps} />
            </span>
          ) : (
            <span
              onClick={handlePlay}
              className='flex justify-center items-center w-10 h-10'
            >
              <PlayIcon {...iconPathProps} />
            </span>
          )}
          <span
            onClick={handleNext}
            className='flex justify-center items-center w-10 h-10'
          >
            <NextIcon {...iconPathProps} />
          </span>
        </div>
      </div>
    </div>
  );
};

export default PlayBar;
