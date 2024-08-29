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
    console.log(JSON.stringify(result));
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
    console.log(JSON.stringify(result));
    const list: TopCategoryResult[] = [];
    result.topList.data.group.forEach((o) => {
      list.push(
        ...o.toplist.map((t) => ({
          topId: t.topId,
          label: t.title,
          intro: Number(showDetail) ? t.intro : undefined,
          period: t.period,
          updateTime: t.updateTime,
          song: Number(showDetail) ? t.song : undefined,
          headPicUrl: t.headPicUrl,
        }))
      );
    });
    return list;
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
  intro?: string;
  period: string;
  updateTime: string;
  song?: {
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
}
