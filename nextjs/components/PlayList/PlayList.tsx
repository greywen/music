'use client';
import React from 'react';
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
    <div ref={containerRef} className='px-3 h-[calc(100vh-120px)] overflow-y-auto'>
      {props.children}
    </div>
  );
};

export default PlayList;