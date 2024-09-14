import { getMusicLyric } from '@/apis/musicApi';
import { IGetLyricResult } from '@/interfaces/lyric';
import { useEffect, useState } from 'react';

interface Props {
  id: number;
}

export default function Lyric(props: Props) {
  const { id } = props;
  const [lyric, setLyric] = useState<IGetLyricResult[]>([]);

  useEffect(() => {
    getMusicLyric(id).then((data) => {
      setLyric(data);
    });
  }, []);
  return (
    <div className='overflow-y-scroll h-[320px] text-sm'>
      {lyric.map((x, index) => (
        <p className='py-1' key={'lyric' + index}>{x.content}</p>
      ))}
    </div>
  );
}
