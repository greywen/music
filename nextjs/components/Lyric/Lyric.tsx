import { PlayStatus } from '@/constants/common';
import { HomeContext } from '@/contexts/HomeContext';
import { useContext, useEffect, useRef, useState } from 'react';

interface Props {
  hidden: boolean;
  onClick?: () => void;
}

let seekInterval: NodeJS.Timeout;
export default function Lyric(props: Props) {
  const {
    state: { currentMusic, howler, playStatus, lyric },
  } = useContext(HomeContext);
  const { hidden, onClick } = props;

  const [seek, setSeek] = useState(0);
  const lyricsRefs = useRef<HTMLParagraphElement[]>([]);
  const currentIndex = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [firstLyricsLoading, setFirstLyricsLoading] = useState(false);

  function parseTime(time: string) {
    const [min, sec] = time.split(':');
    return parseFloat(min) * 60 + (parseFloat(sec) - 0.2);
  }

  useEffect(() => {
    if (howler && playStatus === PlayStatus.playing) {
      setFirstLyricsLoading(false);
      if (containerRef.current) {
        containerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }

      seekInterval && clearInterval(seekInterval);
      seekInterval = setInterval(() => {
        setSeek(howler?.seek() || 0);
      }, 100);
    }

    return () => {
      seekInterval && clearInterval(seekInterval);
    };
  }, [playStatus]);

  useEffect(() => {
    if (playStatus !== PlayStatus.playing) {
      return;
    }
    for (let i = 0; i < lyric.length; i++) {
      if (
        seek >= parseTime(lyric[i].time) &&
        (i === lyric.length - 1 || seek < parseTime(lyric[i + 1].time))
      ) {
        currentIndex.current = i;
        setFirstLyricsLoading(true);
        break;
      }
    }
    if (lyricsRefs.current[currentIndex.current]) {
      lyricsRefs.current[currentIndex.current].scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [seek]);

  return (
    <div
      hidden={hidden}
      onClick={() => {
        onClick && onClick();
      }}
      key={'lyric' + currentMusic?.lyricId}
      ref={containerRef}
      className='overflow-y-scroll max-h-[300px] w-full text-base transparent-scroll text-wrap touch-none text-gray text-center translate'
    >
      {lyric.map((x, index) => (
        <p
          key={'lyric' + index}
          ref={(el) => (lyricsRefs.current[index] = el!) as any}
          className={`py-1 ${
            index === currentIndex.current ? 'text-bold text-[#166534]' : ''
          }`}
        >
          {x.content}
        </p>
      ))}
    </div>
  );
}
