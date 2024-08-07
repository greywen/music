import './index.css';

type Props = {
  title: string;
  description: string;
  onClickLeft?: () => void;
};

const PlayListItem = (props: Props) => {
  const { title, description, onClickLeft } = props;
  return (
    <div className='list-item'>
      <div className='list-left' onClick={onClickLeft && onClickLeft}>
        <div className='item-title'>{title}</div>
        <span className='item-desc'>{description}</span>
      </div>
      <div className='list-right'></div>
    </div>
  );
};
export default PlayListItem;
