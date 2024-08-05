'use client';
import { useState } from 'react';
import './index.css';
import Image from 'next/image';
import PlayIcon from '../Icons/PlayIcon';
import PauseIcon from '../Icons/PauseIcon';
import NextIcon from '../Icons/NextIcon';

type Props = {};

const PlayBar = (props: Props) => {
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
            <div className='play-bar-title'>青花瓷</div>
            <div className='play-bar-description'>周杰伦 - 青花瓷</div>
          </div>
        </div>
        <div className='play-bar-right'>
          <span>
            <PlayIcon />
          </span>
          <span>
            <NextIcon />
          </span>
        </div>
      </div>
    </div>
  );
};
export default PlayBar;
