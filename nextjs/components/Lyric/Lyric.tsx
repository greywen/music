import { getMusicLyric } from '@/apis/musicApi';
import { HomeContext } from '@/contexts/HomeContext';
import { IGetLyricResult } from '@/interfaces/lyric';
import { useContext, useEffect, useRef, useState } from 'react';

interface Props {
  onClick?: () => void;
}

export default function Lyric(props: Props) {
  const {
    state: { seek, currentMusic },
  } = useContext(HomeContext);
  const { onClick } = props;

  const [lyric, setLyric] = useState<IGetLyricResult[]>([]);
  const lyricsRefs = useRef<HTMLParagraphElement[]>([]);
  const currentIndex = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);

  function parseTime(time: string) {
    const [min, sec] = time.split(':');
    return parseFloat(min) * 60 + parseFloat(sec);
  }

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
    if (currentMusic) {
      getMusicLyric(currentMusic.id).then((data) => {
        setLyric(data);
      });
    }
  }, [currentMusic]);

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
      className='overflow-y-scroll overflow-x-hidden max-h-[300px] w-full text-sm transparent-scroll touch-none text-gray text-center'
    >
      {lyric.map((x, index) => (
        <p
          className='py-1'
          key={'lyric' + index}
          ref={(el) => (lyricsRefs.current[index] = el!) as any}
          style={{
            color: index === currentIndex.current ? '#166534' : '',
          }}
        >
          {x.content}
        </p>
      ))}
    </div>
  );
}
