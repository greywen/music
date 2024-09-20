import { getMusicLyric } from '@/apis/musicApi';
import { HomeContext } from '@/contexts/HomeContext';
import { IGetLyricResult } from '@/interfaces/lyric';
import { useContext, useEffect, useRef, useState } from 'react';

interface Props {
  onClick?: () => void;
}

let seekInterval: NodeJS.Timeout;
export default function Lyric(props: Props) {
  const {
    state: { currentMusic, howler },
  } = useContext(HomeContext);
  const { onClick } = props;

  const [lyric, setLyric] = useState<IGetLyricResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [seek, setSeek] = useState(0);
  const lyricsRefs = useRef<HTMLParagraphElement[]>([]);
  const currentIndex = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  function parseTime(time: string) {
    const [min, sec] = time.split(':');
    return parseFloat(min) * 60 + parseFloat(sec);
  }

  useEffect(() => {
    if (howler) {
      if (containerRef.current) {
        containerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }
      if (currentMusic) {
        getMusicLyric(currentMusic.id).then((data) => {
          setLyric(data);
        });
      }
      seekInterval && clearInterval(seekInterval);
      seekInterval = setInterval(() => {
        setSeek(howler?.seek() || 0);
      }, 100);
    }

    return () => {
      seekInterval && clearInterval(seekInterval);
    };
  }, [howler]);

  useEffect(() => {
    for (let i = 0; i < lyric.length; i++) {
      if (
        seek >= parseTime(lyric[i].time) &&
        (i === lyric.length - 1 || seek < parseTime(lyric[i + 1].time))
      ) {
        currentIndex.current = i;
        break;
      }
    }
    if (lyricsRefs.current[currentIndex.current]) {
      lyricsRefs.current[currentIndex.current].scrollIntoView({
        behavior: loading ? 'instant' : 'smooth',
        block: 'center',
      });
      setLoading(false);
    }
  }, [seek]);

  return (
    <div
      onClick={() => {
        onClick && onClick();
      }}
      ref={containerRef}
      className='overflow-y-scroll overflow-x-hidden max-h-[300px] w-full text-base transparent-scroll text-wrap touch-none text-gray text-center'
    >
      {loading && <p className='py-1 text-sm'>加载中...</p>}
      {lyric.map((x, index) => (
        <p
          className='py-1'
          key={'lyric' + index}
          ref={(el) => (lyricsRefs.current[index] = el!) as any}
          style={{
            color: index === currentIndex.current ? '#166534' : '',
            fontWeight: index === currentIndex.current ? 'bold' : '',
          }}
        >
          {x.content}
        </p>
      ))}
    </div>
  );
}
