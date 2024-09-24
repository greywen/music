'use client';
import { Drawer } from 'vaul';
import {
  StarIcon,
  MoreIcon,
  PrevIcon,
  PauseIcon,
  NextIcon,
  PlayIcon,
} from '../Icons';
import Lyric from '../Lyric/Lyric';
import { useContext, useState } from 'react';
import { PlayStatus } from '@/constants/common';
import { HomeContext } from '@/contexts/HomeContext';
import useImageLoader from '@/hooks/useImageLoader';
import PlayProgress from '@/components/PlayProgress/PlayProgress';
import Cover from '../Cover/Cover';

interface IProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPlay: () => void;
  onPause: () => void;
  onPrev: () => void;
  onNext: () => void;
}

const PlayDrawer = (props: IProps) => {
  console.log('paly drawer render');
  const {
    state: { currentMusic, playStatus },
  } = useContext(HomeContext);
  const { open, onOpenChange, onPlay, onPause, onPrev, onNext } = props;

  const svgSize = { width: 50, height: 50 };
  const playSvgSize = { width: 68, height: 68 };
  const iconPathProps = { ...(currentMusic ? {} : { path: { fill: 'gray' } }) };

  const [showLyric, setShowLyric] = useState(false);

  function handlePlay() {
    currentMusic && (playStatus === PlayStatus.playing ? onPause() : onPlay());
  }

  function handlePrev() {
    currentMusic && onPrev();
  }

  function handleNext() {
    currentMusic && onNext();
  }

  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange}>
      <Drawer.Portal>
        <Drawer.Content className='overflow-hidden fixed z-[9999] bottom-0 left-0 right-0 top-0 bg-white focus-visible:outline-none'>
          <div className='mx-auto mt-4 h-2 w-24 rounded-full bg-[#f6f8ff]'></div>
          <div className='h-7 w-full'></div>
          <div
            className={'px-8 py-6 flex justify-center items-center h-[350px]'}
          >
            <Lyric hidden={!showLyric} onClick={() => setShowLyric(false)} />
            <Cover
              url={currentMusic?.coverUrl}
              hidden={showLyric}
              onClick={() => setShowLyric(true)}
            />
          </div>
          <div className='px-8 w-full flex items-center'>
            <div className='w-3/4'>
              <div className='font-semibold text-xl truncate w-44'>
                {currentMusic?.name}
              </div>
              <div className='block w-44 truncate text-sm text-[#777]'>
                {currentMusic?.artist}
                {currentMusic?.album && ' - ' + currentMusic?.album}
              </div>
            </div>
            <div className='w-1/4 flex items-center justify-end gap-3 leading-8'>
              {/* <span className='flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full'>
                <StarIcon />
              </span>
              <span className='flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full'>
                <MoreIcon />
              </span> */}
            </div>
          </div>
          <div className='px-8 pt-2 w-full'>
            <PlayProgress />
          </div>
          <div className='h-28 w-full flex items-center justify-center'>
            <div className='h-16 flex items-center w-3/4 justify-between'>
              <span onClick={handlePrev}>
                <PrevIcon svg={{ ...svgSize }} {...iconPathProps} />
              </span>
              <span onClick={handlePlay}>
                {playStatus === PlayStatus.playing ? (
                  <PauseIcon svg={{ ...playSvgSize }} {...iconPathProps} />
                ) : (
                  <PlayIcon svg={{ ...playSvgSize }} {...iconPathProps} />
                )}
              </span>
              <span onClick={handleNext}>
                <NextIcon svg={{ ...svgSize }} {...iconPathProps} />
              </span>
            </div>
          </div>
        </Drawer.Content>
        <Drawer.Overlay />
      </Drawer.Portal>
    </Drawer.Root>
  );
};

export default PlayDrawer;
