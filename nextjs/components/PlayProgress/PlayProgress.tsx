'use client';
import React, { useContext, useEffect, useState } from 'react';
import * as Slider from '@radix-ui/react-slider';
import { HomeContext } from '@/contexts/HomeContext';
import { PlayStatus } from '@/constants/common';

let progressInterval: NodeJS.Timeout;

const PlayProgress = () => {
  const [value, setValue] = useState(0);
  const [duration, setDuration] = useState(0);
  const {
    state: { howler, playStatus },
  } = useContext(HomeContext);

  function parseTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = (seconds % 60).toFixed(0);

    const minutesString = String(minutes).padStart(2, '0');
    const secondsString = String(remainingSeconds).padStart(2, '0');
    return `${minutesString}:${secondsString}`;
  }

  useEffect(() => {
    if (playStatus === PlayStatus.paused) {
      progressInterval && clearInterval(progressInterval);
    }
    if (playStatus === PlayStatus.waiting) {
      setValue(0);
      setDuration(0);
    }
    if (playStatus === PlayStatus.playing && howler) {
      setValue(Math.ceil(howler.seek()));
      setDuration(howler.duration());
      progressInterval && clearInterval(progressInterval);
      progressInterval = setInterval(() => {
        setValue(Math.ceil(howler.seek()));
      }, 1000);
    }
    return () => {
      progressInterval && clearInterval(progressInterval);
    };
  }, [playStatus]);

  return (
    <div>
      <Slider.Root
        disabled
        className='relative flex items-center select-none touch-none rounded-full w-full h-5'
        value={[value]}
        max={duration}
        step={1}
        onValueChange={(e) => {
          setValue(e[0]);
        }}
      >
        <Slider.Track className=' bg-[#e3e4e4] relative grow rounded-full h-[8px]'>
          <Slider.Range className='absolute bg-[#166534] rounded-full h-full' />
        </Slider.Track>
      </Slider.Root>
      <div className='flex text-[12px] text-[#777] w-full justify-between'>
        <span>{parseTime(value)}</span>
        <span className='text-sm'>
          {duration ? parseTime(duration) : '--:--'}
        </span>
      </div>
    </div>
  );
};

export default PlayProgress;
