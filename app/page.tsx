'use client';
import { downloadMusic, searchByGd } from '@/apis/musicApi';
import { Source } from '@/interfaces/music';
import { IGetMusicSearchPage } from '@/interfaces/search';
import { useState } from 'react';

const Home = () => {
  const COUNT = 20;
  const [params, setParams] = useState({
    name: '',
    pages: 1,
    count: COUNT,
    source: 'netease' as Source,
  });
  const [musicList, setMusicList] = useState<IGetMusicSearchPage[]>([]);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);

  function search() {
    const fetchParams = { ...params, pages: 1 };
    setMusicList([]);
    if (!fetchParams.name.trim()) {
      return;
    }
    setLoading(true);
    setParams(fetchParams);
    searchByGd({ ...fetchParams })
      .then((data) => {
        setMusicList(
          data.map((x) => {
            return { ...x, checked: false };
          })
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function keyDownSearch(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !loading) {
      search();
    }
  }

  function loadMore() {
    const fetchParams = { ...params, pages: params.pages + 1 };
    setParams(fetchParams);
    setLoading(true);
    searchByGd({ ...fetchParams })
      .then((data) => {
        setMusicList([...musicList, ...data]);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function selectMusic(index: number) {
    const musics = [...musicList];
    musics[index].checked = !musics[index].checked;
    setMusicList(musics);
  }

  function download() {
    setDownloading(true);
    const downloadList = musicList.filter((x) => x.checked);
    if (downloadList.length === 0) return;
    downloadMusic(downloadList)
      .then((data) => {
        setMusicList(
          musicList.map((x) => {
            if (data.includes(x.id)) {
              x.checked = false;
            }
            return x;
          })
        );
      })
      .catch(() => {
        alert('下载失败，请尝试切换音乐源。');
      })
      .finally(() => {
        setDownloading(false);
      });
  }

  return (
    <div className='h-full'>
      <div className=' bg-gray-50 w-full sticky top-0'>
        <div className='flex h-12 rounded-md'>
          <select
            className='flex-none rounded-l-md border-none px-3 bg-gray-50 focus:outline-none'
            value={params.source}
            onChange={(e) => {
              setParams({ ...params, source: e.target.value as Source });
            }}
          >
            <option value='netease'>网易云音乐</option>
            <option value='tencent'>QQ音乐</option>
          </select>
          <input
            className={`flex-grow border-none min-w-24 px-2 bg-gray-50 focus:outline-none`}
            enterKeyHint='search'
            name='search'
            placeholder='搜索'
            type='text'
            onKeyDown={keyDownSearch}
            onChange={(e) => setParams({ ...params, name: e.target.value })}
          />
          <button
            disabled={downloading}
            className={`${
              musicList.filter((x) => x.checked).length === 0 && 'hidden'
            } flex-none min-w-12 flex justify-center align-middle items-center border-none bg-gray-50 px-2 focus:outline-none`}
            onClick={download}
          >
            <svg
              className={`${downloading && 'animate-bounce'}`}
              viewBox='0 0 1024 1024'
              version='1.1'
              xmlns='http://www.w3.org/2000/svg'
              width='16'
              height='16'
            >
              <path
                d='M512 102.4a40.96 40.96 0 0 1 40.96 40.96v552.96a40.96 40.96 0 1 1-81.92 0V143.36a40.96 40.96 0 0 1 40.96-40.96zM757.76 880.64a40.96 40.96 0 0 1-40.96 40.96H307.2a40.96 40.96 0 1 1 0-81.92h409.6a40.96 40.96 0 0 1 40.96 40.96z'
                fill='#000000'
              ></path>
              <path
                d='M513.06496 714.30144l203.22304-203.22304a40.96 40.96 0 1 1 57.91744 57.93792L542.5152 800.70656c-0.8192 0.8192-1.6384 1.57696-2.49856 2.29376a40.96 40.96 0 0 1-55.95136-1.8432L252.35456 569.46688a40.96 40.96 0 0 1 57.93792-57.93792l202.752 202.77248z'
                fill='#000000'
              ></path>
            </svg>
          </button>
        </div>
      </div>
      <div className='p-4  space-y-2'>
        {musicList.map((music, index) => (
          <div
            className='flex items-center overflow-hidden h-10 bg-white border border-gray-200 rounded-lg p-2'
            key={music.id}
            onClick={() => {
              selectMusic(index);
            }}
          >
            <input className='mr-2' type='checkbox' checked={music.checked} />
            <span className='text-sm text-gray-800 text-ellipsis whitespace-nowrap overflow-hidden'>
              {music.name} - {music.artist} - {music.album}
            </span>
          </div>
        ))}
      </div>
      <div className='text-sm py-2 text-center text-gray-500' hidden={!loading}>
        加载中...
      </div>
      <div
        className='py-2 text-sm text-center cursor-pointer hover:underline'
        hidden={!(musicList.length > 0 && musicList.length % COUNT === 0)}
        onClick={loadMore}
      >
        加载更多
      </div>
    </div>
  );
};

export default Home;
