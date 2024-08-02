import './index.css';

type Props = {
  title: string;
  description: string;
};

const PlayListItem = (props: Props) => {
  const { title, description } = props;
  return (
    <div className='list-item'>
      <div className='list-left'>
        <div className='item-title'>{title}</div>
        <span className='item-desc'>{description}</span>
      </div>
      <div className='list-right'></div>
    </div>
  );
};
export default PlayListItem;
