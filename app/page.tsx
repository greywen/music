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
    searchByGd({ ...fetchParams }).then((data) => {
      setMusicList(
        data.map((x) => {
          return { ...x, checked: false };
        })
      );
    }).finally(() => {
      setLoading(false);
    });
  }

  function keyDownSearch(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      search();
    }
  }

  function loadMore() {
    const fetchParams = { ...params, pages: params.pages + 1 };
    setParams(fetchParams);
    setLoading(true);
    searchByGd({ ...fetchParams }).then((data) => {
      setMusicList([...musicList, ...data]);
    }).finally(() => {
      setLoading(false);
    });;
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
    downloadMusic(downloadList).then((data) => {
      setMusicList(musicList.map(x => {
        if (data.includes(x.id)) {
          x.checked = false;
        }
        return x;
      }))
    }).catch(()=>{
      alert('下载失败，请尝试切换音乐源。');
    }).finally(() => {
      setDownloading(false);
    });
  }

  return (
    <div className=''>
      <div className='flex mt-1 h-8 rounded-md'>
        <select
          className='rounded-md border px-2 border-input bg-transparent'
          value={params.source}
          onChange={(e) => {
            setParams({ ...params, source: e.target.value as Source });
          }}
        >
          <option value='netease'>网易云音乐</option>
          <option value='tencent'>QQ音乐</option>
        </select>
        <input
          className='rounded-md border px-2 border-input bg-transparent'
          enterKeyHint='search'
          name='search'
          placeholder='搜索'
          type='text'
          onKeyDown={keyDownSearch}
          onChange={(e) => setParams({ ...params, name: e.target.value })}
        />
        <button
          disabled={downloading}
          className='rounded-md border px-2 border-input bg-transparent'
          hidden={musicList.filter((x) => x.checked).length === 0}
          onClick={download}
        >
          {downloading ? '下载中' : '下载'}
        </button>
      </div>
      <div className='mt-2'>
        {musicList.map((music, index) => (
          <div className='flex items-center overflow-hidden align-middle h-6'
            key={music.id}
            onClick={() => {
              selectMusic(index);
            }}
          >
            <input className='mr-1' type='checkbox' checked={music.checked} />
            <span className='text-ellipsis text-nowrap overflow-hidden'>{music.name} {music.artist} - {music.album}</span>
          </div>
        ))}
      </div>
      <div className='py-2' hidden={!loading}>加载中...</div>
      <div
        className='py-2'
        hidden={!(musicList.length > 0 && musicList.length % COUNT === 0)}
        onClick={loadMore}
      >
        加载更多
      </div>
    </div>
  );
};

export default Home;
