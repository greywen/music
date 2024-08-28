import React from 'react';

type Props = {
  title: string;
  description: string;
  onClickLeft?: () => void;
};

const PlayListItem = (props: Props) => {
  const { title, description, onClickLeft } = props;
  return (
    <div className='flex flex-row p-2 rounded-lg my-1.5'>
      <div className='flex flex-col' onClick={onClickLeft && onClickLeft}>
        <div className='flex font-normal text-base whitespace-nowrap overflow-hidden text-ellipsis'>
          {title}
        </div>
        <span className='block font-light text-[12px] whitespace-nowrap overflow-hidden text-ellipsis text-gray-500'>
          {description}
        </span>
      </div>
      <div className='list-right'></div>
    </div>
  );
};

export default PlayListItem;
