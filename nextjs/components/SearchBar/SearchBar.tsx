'use client';
import { useState } from 'react';
import './index.css';
import SearchIcon from '../Icons/SearchIcon';

type Props = {
  searching?: boolean;
  onSearch: (value: string) => void;
};

const SearchBar = (props: Props) => {
  const { searching, onSearch } = props;
  const [value, setValue] = useState('周杰伦');

  function handleClear() {
    setValue('');
  }

  function handleSearch(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !searching) {
      onSearch(value);
    }
  }

  return (
    <div className='search-wrap'>
      <div className='search-wrap__search-box'>
        <input
          enterKeyHint='search'
          name='search'
          placeholder='搜索'
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
          }}
          onKeyDown={handleSearch}
        />
        <SearchIcon svg={{ viewBox: '0 0 24 24', className: 'search-icon' }} />
        <span
          hidden={!value}
          className='search-clear-btn'
          onClick={() => {
            handleClear();
          }}
        >
          清空
        </span>
      </div>
    </div>
  );
};
export default SearchBar;
