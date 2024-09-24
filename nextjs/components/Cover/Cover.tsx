import { DEFAULT_COVER } from '@/constants/common';
import { HomeContext } from '@/contexts/HomeContext';
import useImageLoader from '@/hooks/useImageLoader';
import { useContext } from 'react';

interface Props {
  url?: string;
  hidden?: boolean;
  onClick?: () => void;
}

const Cover = (props: Props) => {
  const { url, hidden, onClick } = props;

  const loaded = useImageLoader(url);
  const handleClick = () => {
    onClick && onClick();
  };

  const backgroundImage = loaded ? url : DEFAULT_COVER;

  return (
    <div
      onClick={handleClick}
      hidden={hidden}
      className='rounded-lg w-full h-full max-h-[320px] max-w-[320px] object-cover'
      style={{
        transition: 'background-image 0.5s ease-in-out',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundImage: `url(${backgroundImage})`,
      }}
    ></div>
  );
};
export default Cover;
