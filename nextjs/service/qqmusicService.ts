import moment from 'moment';

export default class QQMusicService {
  private static get = async function <T>(url: string): Promise<T> {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`QQ music http error! status: ${response.status}`);
      }
      const json = await response.json();
      return json as T;
    } catch (error) {
      console.error('QQ music http error: ');
      console.error(error);
      throw error;
    }
  };

  static singerList = async (
    params: SingerListParams
  ): Promise<SingerListResult> => {
    const { area, sex, genre, index, pageNo } = params;
    const requestData = {
      comm: {
        ct: 24,
        cv: 0,
      },
      singerList: {
        module: 'Music.SingerListServer',
        method: 'get_singer_list',
        param: {
          area: Number(area),
          sex: Number(sex),
          genre: Number(genre),
          index: Number(index),
          sin: (pageNo - 1) * 80,
          cur_page: Number(pageNo),
        },
      },
    };
    const queryParams = new URLSearchParams();
    queryParams.append('data', JSON.stringify(requestData));
    const url = `https://u.y.qq.com/cgi-bin/musicu.fcg?${queryParams}`;
    const result = await QQMusicService.get<QQSingerListResult>(url);
    return {
      list: result.singerList.data.singerlist,
      total: result.singerList.data.total,
    };
  };

  static topCategory = async (
    params: TopCategoryParams = {}
  ): Promise<TopCategoryResult[]> => {
    const { showDetail = 1 } = params;
    const uin = '12345';
    const result = await QQMusicService.get<QQTopCategoryResult>(
      `https://u.y.qq.com/cgi-bin/musicu.fcg?_=1577086820633&data={%22comm%22:{%22g_tk%22:5381,%22uin%22:${uin},%22format%22:%22json%22,%22inCharset%22:%22utf-8%22,%22outCharset%22:%22utf-8%22,%22notice%22:0,%22platform%22:%22h5%22,%22needNewCode%22:1,%22ct%22:23,%22cv%22:0},%22topList%22:{%22module%22:%22musicToplist.ToplistInfoServer%22,%22method%22:%22GetAll%22,%22param%22:{}}}`
    );
    const list: TopCategoryResult[] = [];
    result.topList.data.group.forEach((o) => {
      list.push(
        ...o.toplist.map((t) => ({
          topId: t.topId,
          label: t.title,
          period: t.period,
          song: Number(showDetail)
            ? t.song.map((x) => ({
                title: x.title,
                singerName: x.singerName,
                cover: x.cover,
              }))
            : undefined,
          headPicUrl: t.headPicUrl,
        }))
      );
    });
    return list;
  };

  static top = async (params: TopParams): Promise<TopResult | undefined> => {
    const {
      id = '4',
      pageNo = 1,
      pageSize = 100,
      period,
      time = moment().format('YYYY-MM-DD'),
    } = params;

    let timeType = '';
    let postPeriod = period || moment(time).format(timeType);

    switch (Number(id)) {
      case 4:
      case 27:
      case 62:
        timeType = 'YYYY-MM-DD';
        break;
      default:
        timeType = 'YYYY_W';
    }
    const reqFn = async (): Promise<QQTopResult> =>
      await QQMusicService.get<QQTopResult>(
        `https://u.y.qq.com/cgi-bin/musicu.fcg?g_tk=5381&data=${encodeURIComponent(
          JSON.stringify({
            detail: {
              module: 'musicToplist.ToplistInfoServer',
              method: 'GetDetail',
              param: {
                topId: Number(id),
                offset: (pageNo - 1) * pageSize,
                num: Number(pageSize),
                period: postPeriod,
              },
            },
            comm: { ct: 24, cv: 0 },
          })
        )}`
      );

    let result = await reqFn();

    if (result.detail.data.data.period !== postPeriod) {
      postPeriod = result.detail.data.data.period;
      result = await reqFn();
    }

    if (result.detail.data.data.period) {
      const resData = result.detail.data;
      return {
        list: resData.data.song.map((o, i: number) => {
          const song = resData.songInfoList[i];
          return {
            mid: song.mid,
            title: o.title,
            singerName: o.singerName,
            albumName: song.album.name,
          };
        }),
        period: postPeriod,
      };
    }
  };
}

interface SingerListParams {
  area: number;
  sex: number;
  genre: number;
  index: number;
  pageNo: number;
}

interface SingerListResult {
  total: number;
  list: {
    country: string;
    singer_id: number;
    singer_mid: string;
    singer_name: string;
    singer_pic: string;
  }[];
}

interface QQSingerListResult {
  code: number;
  ts: number;
  start_ts: number;
  traceid: string;
  singerList: {
    code: number;
    data: {
      area: number;
      genre: number;
      index: number;
      sex: number;
      singerlist: {
        country: string;
        singer_id: number;
        singer_mid: string;
        singer_name: string;
        singer_pic: string;
      }[];
      tags: {
        area: IdName[];
        genre: IdName[];
        index: IdName[];
        sex: IdName[];
      };
      total: number;
    };
  };
}

interface IdName {
  id: number;
  name: string;
}

interface TopCategoryParams {
  showDetail?: number;
}

interface QQTopCategoryResult {
  code: number;
  ts: number;
  start_ts: number;
  traceid: string;
  topList: {
    code: number;
    data: {
      group: {
        groupId: number;
        groupName: string;
        toplist: {
          topId: number;
          recType: number;
          topType: number;
          updateType: number;
          title: string;
          titleDetail: string;
          titleShare: string;
          titleSub: string;
          intro: string;
          cornerMark: number;
          period: string;
          updateTime: string;
          history: {
            year: number[];
            subPeriod: number[][];
          };
          listenNum: number;
          totalNum: number;
          song: {
            rank: number;
            rankType: number;
            rankValue: string;
            recType: number;
            songId: number;
            vid: string;
            albumMid: string;
            title: string;
            singerName: string;
            singerMid: string;
            songType: number;
            uuidCnt: number;
            cover: string;
            mvid: number;
          }[];
          headPicUrl: string;
          frontPicUrl: string;
          mbFrontPicUrl: string;
          mbHeadPicUrl: string;
          pcSubTopIds: any[];
          pcSubTopTitles: any[];
          subTopIds: any[];
          adJumpUrl: string;
          h5JumpUrl: string;
          url_key: string;
          url_params: string;
          tjreport: string;
          rt: number;
          updateTips: string;
          bannerText: string;
          AdShareContent: string;
          abt: string;
          cityId: number;
          provId: number;
          sinceCV: number;
          musichallTitle: string;
          musichallSubtitle: string;
          musichallPicUrl: string;
          specialScheme: string;
          mbFrontLogoUrl: string;
          mbHeadLogoUrl: string;
          cityName: string;
          magicColor: {
            r: number;
            g: number;
            b: number;
          };
          topAlbumURL: string;
          groupType: number;
          icon: number;
          adID: number;
          mbIntroWebUrl: string;
          mbLogoUrl: string;
        }[];
        type: number;
        myFeatureButtonText: string;
        myFeatureButtonScheme: string;
      }[];
      refreshInterval: number;
      abt: string;
      location: {
        province: {
          provinceID: number;
          name: string;
          pinyin: string;
        };
      };
    };
  };
}

interface TopCategoryResult {
  topId: number;
  label: string;
  period: string;
  song?: {
    title: string;
    singerName: string;
    cover: string;
  }[];
  headPicUrl: string;
}

interface TopParams {
  id?: string;
  pageNo?: number;
  pageSize?: number;
  period?: string;
  time?: string;
}

interface QQTopResult {
  code: number;
  ts: number;
  start_ts: number;
  traceid: string;
  detail: {
    code: number;
    data: {
      data: {
        topId: number;
        recType: number;
        topType: number;
        updateType: number;
        title: string;
        titleDetail: string;
        titleShare: string;
        titleSub: string;
        intro: string;
        cornerMark: number;
        period: string;
        updateTime: string;
        history: History;
        listenNum: number;
        totalNum: number;
        song: {
          rank: number;
          rankType: number;
          rankValue: string;
          recType: number;
          songId: number;
          vid: string;
          albumMid: string;
          title: string;
          singerName: string;
          singerMid: string;
          songType: number;
          uuidCnt: number;
          cover: string;
          mvid: number;
        }[];
        headPicUrl: string;
        frontPicUrl: string;
        mbFrontPicUrl: string;
        mbHeadPicUrl: string;
        pcSubTopIds: any[];
        pcSubTopTitles: any[];
        subTopIds: any[];
        adJumpUrl: string;
        h5JumpUrl: string;
        url_key: string;
        url_params: string;
        tjreport: string;
        rt: number;
        updateTips: string;
        bannerText: string;
        AdShareContent: string;
        abt: string;
        cityId: number;
        provId: number;
        sinceCV: number;
        musichallTitle: string;
        musichallSubtitle: string;
        musichallPicUrl: string;
        specialScheme: string;
        mbFrontLogoUrl: string;
        mbHeadLogoUrl: string;
        cityName: string;
        magicColor: {
          r: number;
          g: number;
          b: number;
        };
        topAlbumURL: string;
        groupType: number;
        icon: number;
        adID: number;
        mbIntroWebUrl: string;
        mbLogoUrl: string;
      };
      songInfoList: {
        id: number;
        type: number;
        mid: string;
        name: string;
        title: string;
        subtitle: string;
        singer: {
          id: number;
          mid: string;
          name: string;
          title: string;
          type: number;
          uin: number;
          pmid: string;
        }[];
        album: {
          id: number;
          mid: string;
          name: string;
          title: string;
          subtitle: string;
          time_public: string;
          pmid: string;
        };
        mv: {
          id: number;
          vid: string;
          name: string;
          title: string;
          vt: number;
        };
        interval: number;
        isonly: number;
        language: number;
        genre: number;
        index_cd: number;
        index_album: number;
        time_public: string;
        status: number;
        fnote: number;
        file: {
          media_mid: string;
          size_24aac: number;
          size_48aac: number;
          size_96aac: number;
          size_192ogg: number;
          size_192aac: number;
          size_128mp3: number;
          size_320mp3: number;
          size_ape: number;
          size_flac: number;
          size_dts: number;
          size_try: number;
          try_begin: number;
          try_end: number;
          url: string;
          size_hires: number;
          hires_sample: number;
          hires_bitdepth: number;
          b_30s: number;
          e_30s: number;
          size_96ogg: number;
          size_360ra: any[];
          size_dolby: number;
          size_new: number[];
        };
        pay: {
          pay_month: number;
          price_track: number;
          price_album: number;
          pay_play: number;
          pay_down: number;
          pay_status: number;
          time_free: number;
        };
        action: {
          switch: number;
          msgid: number;
          alert: number;
          icons: number;
          msgshare: number;
          msgfav: number;
          msgdown: number;
          msgpay: number;
          switch2: number;
          icon2: number;
        };
        ksong: { id: number; mid: string };
        volume: { gain: number; peak: number; lra: number };
        label: string;
        url: string;
        bpm: number;
        version: number;
        trace: string;
        data_type: number;
        modify_stamp: number;
        pingpong: string;
        aid: number;
        ppurl: string;
        tid: number;
        ov: number;
        sa: number;
        es: string;
        vs: string[];
        vi: number[];
        ktag: string;
        vf: number[];
      }[];
    };
  };
}

interface TopResult {
  list: {
    mid: string;
    title: string;
    singerName: string;
    albumName: string;
  }[];
  period: string;
}
