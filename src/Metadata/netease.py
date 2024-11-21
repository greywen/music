import requests
from datetime import datetime

class NeteaseMusicParser:

    def __init__(self):
        self.headers = {
            "User-Agent": "Mozilla/6.0 (Linux; Android 11; SAMSUNG SM-G973U) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/14.2 Chrome/87.0.4280.141 Mobile Safari/537.36"
        }

    def search_song(self, msg, n=None, offset_limit=0, count_limit=5):
        if not msg:
            return self._response(400, '请输入要解析的歌名')

        url = f"https://music.163.com/api/search/get/web?csrf_token=hlpretag=&hlposttag=&type=1&total=true&limit={count_limit}&offset={offset_limit}&s={msg}"
        response = self._get_curl(url)
        song_list = response.get('result', {}).get('songs', [])
        data_list = []

        if n is not None and n < len(song_list):
            info = song_list[n]
            album = self._get_song_album(info['album']['id'])
            data_list = {
                "mid": info["id"],
                "title": info["name"],
                "date": info['album']['publishTime'],
                "artist": info["artists"][0]["name"],
            } | album
        else:
            for song in song_list:
                album = self._get_song_album(song['album']['id'])
                data = {
                    "mid": song['id'],
                    "title": song['name'],
                    "date": info['album']['publishTime'],
                    "artist": song['artists'][0]['name']
                }
                merged = data | album
                data_list.append(merged)
                
        return self._response(200, '解析成功', data_list)
    
    def _get_song_album(self, album_id):
        url = f"https://interface.music.163.com/api/v1/album/{album_id}"
        response = self._get_curl(url)
        album = response.get('album', { })
        song = response.get('songs', { })
        print(song)
        return {
            "album": getattr(album, 'name', None),
            "album_img": getattr(album, 'picUrl', None),
        }

    def _get_curl(self, url):
        response = requests.get(url, headers=self.headers)
        print(f"Request URL: {url}")
        print(f"Response Status Code: {response.status_code}")

        try:
            return response.json()  
        except ValueError as e:  # 捕获 JSON 解析错误
            print(f"Error parsing JSON: {e}")
            return self._response(500, '解析失败')
    def _post_curl(self, post_url, post_data):
        response = requests.post(post_url, data=post_data, headers=self.headers)
        return response.json()

    def _get_redirect_url(self, url):
        response = requests.head(url, allow_redirects=True, headers=self.headers)
        return response.url   
    
    def _response(self, code, text, data=None):
        result = {
            'code': code,
            'text': text,
            'data': data
        }
        return result 