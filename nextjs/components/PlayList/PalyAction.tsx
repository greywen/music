'use client';
import { useEffect, useState } from 'react';

type Props = {
  onPlayAll: () => void;
};

const PlayListAction = (props: Props) => {
  const { onPlayAll } = props;
  const [showFullActionBar, setFullActionBar] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollTop = document.documentElement.scrollTop;

      if (currentScrollTop < 25) {
        setFullActionBar(false);
      } else {
        setFullActionBar(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className={`px-3 sticky top-0 z-10 ${showFullActionBar ? 'p-0' : ''}`}>
      <div
        className={`flex items-center justify-between h-12 bg-white rounded-lg w-full my-2 ${
          showFullActionBar ? '' : 'p-3'
        }`}
      >
        <div
          className='flex items-center gap-2.5 text-base font-normal'
          onClick={onPlayAll}
        >
          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-green-500 before:content-[''] before:block before:h-0 before:w-0 before:mr-[-13px] before:border-[7px_11px] before:border-solid before:border-transparent before:border-l-white"></span>
          播放全部
        </div>
        <div className='flex text-sm font-light'></div>
      </div>
    </div>
  );
};

export default PlayListAction;
