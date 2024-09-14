'use client';
import Image from 'next/image';
import { IGetMusicSearchResult } from '@/interfaces/search';
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

interface IProps {
  playing: boolean;
  music: IGetMusicSearchResult;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPlay: () => void;
  onPause: () => void;
  onPrev: () => void;
  onNext: () => void;
}

const PlayDrawer = (props: IProps) => {
  const svgSize = { width: 50, height: 50 };
  const playSvgSize = { width: 68, height: 68 };
  const {
    playing,
    music,
    open,
    onOpenChange,
    onPlay,
    onPause,
    onPrev,
    onNext,
  } = props;

  function handlePlay() {
    playing ? onPause() : onPlay();
  }

  function handlePrev() {
    onPrev();
  }

  function handleNext() {
    onNext();
  }

  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange}>
      <Drawer.Portal>
        {music && (
          <Drawer.Content className='overflow-hidden fixed z-[999999999] bottom-0 left-0 right-0 top-0 bg-white'>
            <div className='mx-auto mt-4 h-2 w-24 rounded-full bg-[#f6f8ff]'></div>
            <div className='h-7 w-full'></div>
            <div
              className={`px-8 py-6 flex justify-center items-center h-[350px] ${
                playing ? 'play-drawer-cover-playing' : ''
              }`}
              onClick={handlePlay}
            >
              <Lyric id={music.lyricId} />
              {/* <Image
                alt=''
                src={music.coverUrl}
                width={230}
                height={230}
                className='rounded-lg w-[82%] h-[82%] max-h-[320px] max-w-[320px]'
              /> */}
            </div>
            <div className='px-8 w-full flex items-center'>
              <div className='w-3/4'>
                <div className='font-semibold text-xl truncate w-44'>
                  {music.name}
                </div>
                <div className='block w-44 truncate text-sm text-[#777]'>
                  {`${music.artist} - ${music.name}`}
                </div>
              </div>
              <div className='w-1/4 flex items-center justify-end gap-3 leading-8'>
                <span className='flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full'>
                  <StarIcon />
                </span>
                <span className='flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full'>
                  <MoreIcon />
                </span>
              </div>
            </div>
            <div></div>
            <div className='h-32 w-full flex items-center justify-center'>
              <div className='h-16 flex items-center w-3/5 justify-between'>
                <span onClick={handlePrev}>
                  <PrevIcon svg={{ ...svgSize }} />
                </span>
                <span onClick={handlePlay}>
                  {playing ? (
                    <PauseIcon svg={{ ...playSvgSize }} />
                  ) : (
                    <PlayIcon svg={{ ...playSvgSize }} />
                  )}
                </span>
                <span onClick={handleNext}>
                  <NextIcon svg={{ ...svgSize }} />
                </span>
              </div>
            </div>
          </Drawer.Content>
        )}
        <Drawer.Overlay />
      </Drawer.Portal>
    </Drawer.Root>
  );
};

export default PlayDrawer;
