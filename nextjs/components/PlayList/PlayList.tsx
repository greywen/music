'use client';
import React from 'react';
import './index.css';

type Props = {
  children: React.ReactNode;
};

const PlayList = (props: Props) => {
  return <div className='list-warp'>{props.children}</div>;
};
export default PlayList;
