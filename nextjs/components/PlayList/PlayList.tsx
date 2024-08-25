'use client';
import React from 'react';
import './index.css';
import useScrollToBottom from '@/hooks/useScrollToBottom';

type Props = {
  children: React.ReactNode;
  onScrollToBottom?: () => void;
};

const PlayList = (props: Props) => {
  const { onScrollToBottom } = props;
  const containerRef = useScrollToBottom({
    handler: handleScrollToBottom,
    delay: 2000,
  });

  function handleScrollToBottom() {
    onScrollToBottom && onScrollToBottom();
  }

  return (
    <div ref={containerRef} className='list-warp'>
      {props.children}
    </div>
  );
};
export default PlayList;
