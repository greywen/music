import requests
import json
from datetime import datetime

class KugouMusicParser:

    @staticmethod
    def search(msg, n=None, type='song', page_limit=1, count_limit=1):
        if type == 'mv':
            return KugouMusicParser.get_kugou_mv(msg, page_limit, count_limit, n)
        elif type == 'song':
            return KugouMusicParser.get_kugou_song(msg, page_limit, count_limit, n)
        elif type == 'shash':
            hash_value = None  # This will be filled later
            return KugouMusicParser.get_mp3_data(hash_value)
        elif type == 'mhash':
            hash_value = None  # This will be filled later
            return KugouMusicParser.get_mv_data(hash_value)
        else:
            return {'code': 200, 'text': '请求参数不存在'}

    @staticmethod
    def get_kugou_mv(msg, page_limit, count_limit, n):
        url = f"https://mobiles.kugou.com/api/v3/search/mv?format=json&keyword={msg}&page={page_limit}&pagesize={count_limit}&showtype=1"
        response = requests.get(url)
        json_data = response.json()

        info_list = json_data['data']['info']
        data_list = []

        if n is not None and n < len(info_list):
            info = info_list[n]
            mv_data = KugouMusicParser.get_mv_data(info['hash'])

            mvdata = next((mv_data['mvdata'][key] for key in ['sq', 'le', 'rq'] if key in mv_data['mvdata']), None)
            
            data_list = {
                "name": info['filename'],
                "singername": info['singername'],
                "duration": gmdate("i:s", info['duration']),
                "file_size": round(mvdata['filesize'] / (1024 * 1024), 2),
                "play_count": json_data['play_count'],
                "like_count": json_data['like_count'],
                "comment_count": json_data['comment_count'],
                "collect_count": json_data['collect_count'],
                "mv_url": mvdata['downurl'],
                "cover_url": info['imgurl'].replace('/{size}', ''),
                "publish_date": json_data['publish_date']
            }
        else:
            for info in info_list:
                data = {
                    "name": info['filename'],
                    "singername": info['singername'],
                    "duration": gmdate("i:s", info['duration']),
                    "cover_url": info['imgurl'].replace('/{size}', '')
                }
                data_list.append(data)
        
        return {'code': 200, 'text': '解析成功', 'type': 'MV解析', 'now': datetime.now().strftime("%Y-%m-%d %H:%M:%S"), 'data': data_list}

    @staticmethod
    def get_kugou_song(msg, page_limit, count_limit, n):
        url = f"https://mobiles.kugou.com/api/v3/search/song?format=json&keyword={msg}&page={page_limit}&pagesize={count_limit}&showtype=1"
        response = requests.get(url)
        json_data = response.json()
        
        info_list = json_data['data']['info']
        data_list = []

        if n is not None and n < len(info_list):
            info = info_list[n]
            print(info)
            data_list = {
                "name": info['filename'],
                "singername": info['singername'],
                "duration": gmdate("i:s", info['duration']),
            }
        else:
            for info in info_list:
                data = {
                    "name": info['filename'],
                    "album_name": info['album_name'],
                    "singername": info['singername'],
                    "duration": gmdate("i:s", info['duration']),
                    "hash": info['hash'],
                    "mvhash": info.get('mvhash')
                }
                data_list.append(info)

        return {'code': 200, 'text': '解析成功', 'type': '歌曲解析', 'now': datetime.now().strftime("%Y-%m-%d %H:%M:%S"), 'data': data_list}

    @staticmethod
    def get_mp3_data(song_hash):
        url = f'https://m.kugou.com/app/i/getSongInfo.php?hash={song_hash}&cmd=playInfo'
        response = requests.get(url)
        json_data = response.json()
        return json_data

    @staticmethod
    def get_mv_data(mv_hash):
        url = f'http://m.kugou.com/app/i/mv.php?cmd=100&hash={mv_hash}&ismp3=1&ext=mp4'
        response = requests.get(url)
        json_data = response.json()
        return json_data

def gmdate(format, timestamp):
    return datetime.utcfromtimestamp(timestamp).strftime(format)

# Example usage (commented out for a library)
# if __name__ == "__main__":
#     parser = KugouMusicParser()
#     result = parser.search("song_name", n=0, type="song")
#     print(result)