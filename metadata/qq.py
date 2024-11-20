import json
import requests
import re
from datetime import datetime

class QQMusicParser:
    def __init__(self):
        self.headers = {
            "Content-Type": "application/json; charset=UTF-8",
            "Charset": "UTF-8",
            "Accept": "*/*",
            "User-Agent": "Mozilla/5.0 (Linux; Android 6.0.1; OPPO R9s Plus Build/MMB29M; wv) "
                          "AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 "
                          "Chrome/55.0.2883.91 Mobile Safari/537.36",
            "Host": "u.y.qq.com"
        }
        self.base_url = "https://u.y.qq.com/cgi-bin/musicu.fcg"

    def search_song(self, msg, n=None, page_limit=1, count_limit=5):
        if not msg:
            return self._response(400, '请输入要解析的歌名')

        post_data = {
            "comm": {
                "_channelid": "19",
                "_os_version": "6.2.9200-2",
                "authst": "Q_H_L_5tvGesDV1E9ywCVIuapBeYL7IYKKtbZErLj5HeBkyXeqXtjfQYhP5tg",
                "ct": "19",
                "cv": "1873",
                "guid": "B69D8BC956E47C2B65440380380B7E9A",
                "patch": "118",
                "psrf_access_token_expiresAt": 1697829214,
                "psrf_qqaccess_token": "A865B8CA3016A74B1616F8919F667B0B",
                "psrf_qqopenid": "2AEA845D18EF4BCE287B8EFEDEA1EBCA",
                "psrf_qqunionid": "6EFC814008FAA695ADD95392D7D5ADD2",
                "tmeAppID": "qqmusic",
                "tmeLoginType": 2,
                "uin": "961532186",
                "wid": "0"
            },
            "music.search.SearchCgiService": {
                "method": "DoSearchForQQMusicDesktop",
                "module": "music.search.SearchCgiService",
                "param": {
                    "grp": 1,
                    "num_per_page": count_limit,
                    "page_num": page_limit,
                    "query": msg,
                    "remoteplace": "txt.newclient.history",
                    "search_type": 0,
                    "searchid": "6254988708H54D2F969E5D1C81472A98609002"
                }
            }
        }

        response = self._post_request(self.base_url, json.dumps(post_data))
        json_data = json.loads(response)
        info_list = json_data["music.search.SearchCgiService"]["data"]["body"]["song"]["list"]

        if n is not None and n < len(info_list):
            return self._get_song_details(info_list[n])
        else:
            return self._list_songs(info_list)

    def get_song_by_id(self, song_id):
        json_data = self._get_mp3_data(song_id)
        if json_data and "songList" in json_data and len(json_data["songList"]) > 0:
            song_url = json_data["songList"][0]["url"]
            return self._response(200, '解析成功', song_url)
        return self._response(400, '解析失败，请检查歌曲id值是否正确',)

    def _list_songs(self, info_list):
        data_list = []
        for info in info_list:
            data = {
                "mid": info["mid"],
                "title": info["name"],
                "date": info['time_public'],
                "artist": info["singer"][0]["name"],
                "album": info['album']['name'],
                "album_img": f"https://y.qq.com/music/photo_new/T002R300x300M000{info['album']['pmid']}.jpg",
            }
            data_list.append(data)
        return self._response(200, '解析成功', data_list)

    def _get_song_details(self, info):
        data_list = {
            "mid": info["mid"],
            "title": info["name"],
            "date": info['time_public'],
            "artist": info["singer"][0]["name"],
            "album": info['album']['name'],
            "album_img": f"https://y.qq.com/music/photo_new/T002R300x300M000{info['album']['pmid']}.jpg",
        }
        return self._response(200, '解析成功', data_list)

    def _get_mp3_data(self, song_mid):
        url = f"https://i.y.qq.com/v8/playsong.html?ADTAG=ryqq.songDetail&songmid={song_mid}&songid=0&songtype=0"
        html_str = self._get_request(url)
        match = self._extract_json_from_html(html_str)
        if match:
            return json.loads(match)
        return {}

    def _extract_json_from_html(self, html_str):
        match = re.search(r'>window.__ssrFirstPageData__ =(.*?)<\/script', html_str)
        return match.group(1) if match else None

    def _response(self, code, text, data=None):
        result = {
            'code': code,
            'text': text,
            'data': data
        }
        return result

    def _get_request(self, url):
        response = requests.get(url, headers=self.headers)
        return response.text

    def _post_request(self, url, data):
        response = requests.post(url, headers=self.headers, data=data)
        return response.text