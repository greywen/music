'use client';
import './index.css';
import Image from 'next/image';
import { IMusicSearchResult } from '@/interfaces/search';
import { Drawer } from 'vaul';
import StarIcon from '../Icons/StarIcon';
import MoreIcon from '../Icons/MoreIcon';
import PrevIcon from '../Icons/PrevIcon';
import PauseIcon from '../Icons/PauseIcon';
import NextIcon from '../Icons/NextIcon';
import PlayIcon from '../Icons/PlayIcon';

interface IProps {
  playing: boolean;
  music: IMusicSearchResult;
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
  const { playing, music, open, onOpenChange, onPlay, onPause } = props;

  function handlePlay() {
    playing ? onPause() : onPlay();
  }

  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange}>
      <Drawer.Portal>
        {music && (
          <Drawer.Content className='play-drawer-content'>
            <div className='play-drawer-close-bar'></div>
            <div className='play-drawer-bar'></div>
            <div
              className={
                playing
                  ? 'play-drawer-cover play-drawer-cover-playing'
                  : 'play-drawer-cover'
              }
              onClick={handlePlay}
            >
              <Image
                alt=''
                src={'http://127.0.0.1:3000/files/cover?id=' + music.coverId}
                width={230}
                height={230}
              />
            </div>
            <div className='play-drawer-play-bar'>
              <div className='play-drawer-play-bar-left'>
                <div className='play-drawer-play-bar-title'>{music.name}</div>
                <div className='play-drawer-play-bar-description'>{`${music.artist} - ${music.name}`}</div>
              </div>
              <div className='play-drawer-play-bar-right'>
                <span>
                  <StarIcon />
                </span>
                <span>
                  <MoreIcon />
                </span>
              </div>
            </div>
            <div></div>
            <div className='play-drawer-play-action-bar'>
              <div className='play-drawer-play-action-bar-content'>
                <span>
                  <PrevIcon svg={{ ...svgSize }} />
                </span>
                <span onClick={handlePlay}>
                  {playing ? (
                    <PauseIcon svg={{ ...playSvgSize }} />
                  ) : (
                    <PlayIcon svg={{ ...playSvgSize }} />
                  )}
                </span>
                <span>
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
