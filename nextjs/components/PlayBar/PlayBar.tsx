'use client';
import Image from 'next/image';
import PlayIcon from '../Icons/PlayIcon';
import PauseIcon from '../Icons/PauseIcon';
import NextIcon from '../Icons/NextIcon';
import { useContext } from 'react';
import { PlayStatus } from '@/constants/common';
import { HomeContext } from '@/contexts/HomeContext';

type Props = {
  onPlay?: () => void;
  onPause?: () => void;
  onNext?: () => void;
  onClickLeft?: () => void;
};

const PlayBar = (props: Props) => {
  const {
    state: { currentMusic, playStatus },
  } = useContext(HomeContext);
  const { onPlay, onPause, onNext, onClickLeft } = props;

  function handlePlay() {
    currentMusic && onPlay && onPlay();
  }

  function handlePause() {
    currentMusic && onPause && onPause();
  }

  function handleNext() {
    currentMusic && onNext && onNext();
  }

  function handleClickLeft() {
    onClickLeft && onClickLeft();
  }
  const iconPathProps = { ...(currentMusic ? {} : { path: { fill: 'gray' } }) };

  return (
    <div className='fixed z-10 bottom-3 right-0 left-0 max-w-3xl mx-auto px-3'>
      <div className='flex items-center p-3 bg-white h-14 rounded-2xl shadow-md shadow-[rgba(70,96,187,0.2)]'>
        <div
          className='flex items-center gap-2 w-3/4 cursor-pointer'
          onClick={handleClickLeft}
        >
          <Image
            alt=''
            src={currentMusic ? currentMusic.coverUrl : '/images/music.jpg'}
            width={40}
            height={40}
            className='rounded-md'
          />
          {currentMusic && (
            <div>
              <div className='font-normal text-base truncate w-44'>
                {currentMusic.name}
              </div>
              <div className='font-light text-sm truncate w-44 text-gray-500'>
                {`${currentMusic.artist} - ${currentMusic.name}`}
              </div>
            </div>
          )}
        </div>
        <div className='flex items-center gap-2.5 justify-center w-1/4'>
          {playStatus === PlayStatus.playing ? (
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
