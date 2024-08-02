'use client';
import { useEffect, useState } from 'react';
import './index.css';
const PlayListAction = () => {
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
    <div className={`action-warp ${showFullActionBar ? 'action-warp-full' : ''}`}>
      <div className='action-bar'>
        <div className='action-bar-left'>
          <span className='action-bar-play-icon'></span>
          播放全部
        </div>
        <div className='action-bar-right'>收藏全部</div>
      </div>
    </div>
  );
};
export default PlayListAction;
