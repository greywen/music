export const SOURCE_ID = {
  tencent: 1,
  netease: 2,
  kugou: 3,
};

export enum Area {
  'All' = -100,
  'Mainland' = 200,
  'HKAndTW' = 2,
  'Korea' = 3,
  'Japan' = 4,
  'Occident' = 5,
  'Other' = 6,
}

export const areas = [
  {
    id: Area.All,
    name: '全部',
  },
  {
    id: Area.Mainland,
    name: '内地',
  },
  {
    id: Area.HKAndTW,
    name: '港台',
  },
  {
    id: Area.Korea,
    name: '韩国',
  },
  {
    id: Area.Japan,
    name: '日本',
  },
  {
    id: Area.Occident,
    name: '欧美',
  },
];
