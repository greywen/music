'use client';
import { useState } from 'react';
import SearchIcon from '../Icons/SearchIcon';
import { ClearIcon } from '../Icons';

type Props = {
  searching?: boolean;
  onSearch: (value: string) => void;
  onClear: () => void;
};

const SearchBar = (props: Props) => {
  const { searching, onSearch, onClear } = props;
  const [value, setValue] = useState('周杰伦');

  function handleClear() {
    setValue('');
    onClear && onClear();
  }

  function handleSearch(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !searching) {
      onSearch(value);
    }
  }

  return (
    <div className='px-3'>
      <div className='relative'>
        <input
          enterKeyHint='search'
          name='search'
          placeholder='搜索'
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
          }}
          onKeyDown={handleSearch}
          className='p-4 pl-11 w-full border-none rounded-2xl shadow-md shadow-[rgba(70,96,187,0.2)]'
        />
        <SearchIcon
          svg={{
            viewBox: '0 0 24 24',
            className: 'absolute left-3.5 top-[15px] text-blue-500 h-5',
          }}
        />
        <span
          hidden={!value}
          className='absolute right-[2.14%] top-[6px] py-2 px-4 text-sm cursor-pointer transition ease-in-out text-gray-500'
          onClick={() => {
            handleClear();
          }}
        >
          <ClearIcon />
        </span>
      </div>
    </div>
  );
};

export default SearchBar;
