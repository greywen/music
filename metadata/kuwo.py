import requests
import json
from datetime import datetime

class KuwoMusicParser:
    def __init__(self):
        self.base_url = "http://kuwo.cn"
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:106.0) Gecko/20100101 Firefox/106.0',
            'Accept': 'application/json, text/plain, */*',
            'Referer': 'https://kuwo.cn',
            'Secret': '10373b58aee58943f95eaf17d38bc9cf50fbbef8e4bf4ec6401a3ae3ef8154560507f032',
        }
        self.cookies = {
            'Hm_lvt_cdb524f42f0ce19b169a8071123a4797': '1687520303,1689840209',
            '_ga': 'GA1.2.2021483490.1666455184',
            '_ga_ETPBRPM9ML': 'GS1.2.1689840210.4.1.1689840304.60.0.0',
            'Hm_Iuvt_cdb524f42f0ce19b169b8072123a4727': 'NkA4TadJGeBWwmP2mNGpYRrM8f62K8Cm',
            'Hm_lpvt_cdb524f42f0ce19b169a8071123a4797': '1689840223',
            '_gid': 'GA1.2.1606176174.1689840209',
            '_gat': '1',
        }

    def search_music(self, query, n=None, type='song', page_limit=1, count_limit=5):
        if type not in ['song', 'mv', 'rid', 'mid']:
            return {'code': 200, 'text': '请求参数不存在'}

        if type == 'mv':
            return self.get_kuwo_mv(query, page_limit, count_limit, n)

        elif type == 'song':
            return self.get_kuwo_song(query, page_limit, count_limit, n)

        elif type == 'rid':
            if n is not None:
                return self.get_mp3_data(n)
            return {'code': 200, 'text': '解析失败，请检查歌曲rid值是否正确', 'type': '歌曲解析'}

        elif type == 'mid':
            if n is not None:
                return self.get_mv_data(n)
            return {'code': 200, 'text': '解析失败，请检查MV mid值是否正确', 'type': 'MV解析'}

    def get_kuwo_song(self, query, page_limit, count_limit, n):
        url = f"{self.base_url}/api/www/search/searchMusicBykeyWord?key={requests.utils.quote(query)}&pn={page_limit}&rn={count_limit}&httpsStatus=1"
        response = self.get_curl(url)
        json_data = response.json()
        
        data_list = []
        print(json_data)
        info_list = json_data['data']['list']
        
        if n is not None and n < len(info_list):
            info = info_list[n]
            song_rid = info['rid']
            song_url_data = self.get_mp3_data(song_rid)
            song_url = song_url_data['data']['url'] if 'data' in song_url_data and song_url_data['data'] else "付费歌曲暂时无法获取歌曲下载链接"
            mv_url = self.get_mv_data(song_rid)['data']['url']
            data_list = {
                "name": info['name'],
                "singername": info['artist'],
                "duration": self.format_duration(info['duration']),
                "file_size": None,
                "song_url": song_url,
                "mv_url": mv_url,
                "album_img": info['pic'],
            }
        else:
            for info in info_list:
                data = {
                    "name": info['name'],
                    "singername": info['artist'],
                    "duration": self.format_duration(info['duration']),
                    "rid": info['rid']
                }
                data_list.append(data)

        return {'code': 200, 'text': '解析成功', 'type': '歌曲解析', 'now': datetime.now().strftime("%Y-%m-%d %H:%M:%S"), 'data': data_list}

    def get_kuwo_mv(self, query, page_limit, count_limit, n):
        url = f"{self.base_url}/api/www/search/searchMvBykeyWord?key={requests.utils.quote(query)}&pn={page_limit}&rn={count_limit}&httpsStatus=1"
        response = self.get_curl(url)
        json_data = response.json()

        data_list = []
        info_list = json_data['data']['mvlist']
        
        if n is not None and n < len(info_list):
            info = info_list[n]
            mv_url_data = self.get_mv_data(info['id'])
            mv_url = mv_url_data['data']['url']
            data_list = {
                "name": info['name'],
                "singername": info['artist'],
                "duration": self.format_duration(info['duration']),
                "file_size": None,
                "mv_url": mv_url,
                "cover_url": info['pic'],
                "publish_date": None
            }
        else:
            for info in info_list:
                data = {
                    "name": info['name'],
                    "singername": info['artist'],
                    "duration": self.format_duration(info['duration']),
                    "cover_url": info['pic'],
                }
                data_list.append(data)

        return {'code': 200, 'text': '解析成功', 'type': 'MV解析', 'now': datetime.now().strftime("%Y-%m-%d %H:%M:%S"), 'data': data_list}

    def get_mp3_data(self, song_rid):
        url = f'{self.base_url}/api/v1/www/music/playUrl?mid={song_rid}&type=music&httpsStatus=1'
        return self.get_curl(url).json()

    def get_mv_data(self, mv_mid):
        url = f'{self.base_url}/api/v1/www/music/playUrl?mid={mv_mid}&type=mv&httpsStatus=1'
        return self.get_curl(url).json()

    def get_curl(self, url):
        response = requests.get(url, headers=self.headers, cookies=self.cookies)
        response.raise_for_status()  # Raise an error for bad responses
        return response

    @staticmethod
    def format_duration(seconds):
        return f"{seconds // 60}:{seconds % 60:02d}"  # Format to mm:ss

# 使用示例
# parser = KuwoMusicParser()
# result = parser.search_music('歌曲标题', type='song', n=0)
# print(result)