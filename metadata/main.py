import requests
from mutagen.flac import FLAC, Picture
from fastapi import FastAPI
from pydantic import BaseModel

from qq import QQMusicParser
from netease import NeteaseMusicParser

app = FastAPI()

class Metadata(BaseModel):
    title: str = None
    album: str = None
    date: str = None
    artist: list = None
    
@app.post("/metadata/update")
def update_music_metadata(filePath: str, coverUrl: str = None, metadata: Metadata = None):
    try:
        if coverUrl != None: 
            update_flac_cover_image_from_url(filePath, coverUrl)
        if metadata != None: 
            update_flac_metadata(filePath, metadata)
        return {
            'code': 200,
            'text': "修改成功",
        }
    except Exception as e:
        return {
            'code': 400,
            'text': "修改失败"+ e,
        }

@app.get("/qq/{name}")
def search_music_by_qq(name: str):
    qq = QQMusicParser()
    song = qq.search_song(name)
    return song

@app.get("/netease/{name}")
def search_music_by_netease(name: str):
    netease = NeteaseMusicParser()
    song = netease.search_song(name, 0)
    return song
    
def update_flac_cover_image_from_url(file_path, cover_image_url):
    audio = FLAC(file_path)

    # 从URL下载图像
    response = requests.get(cover_image_url)
    if response.status_code == 200:
        img_data = response.content  # 获取图像数据
    else:
        print(f"无法下载图像: {response.status_code}")
        return

    # 创建新的Picture对象
    picture = Picture()
    picture.data = img_data
    picture.type = 3 # 设置类型为3，代表封面（COVER_FRONT）
    picture.mime = 'image/jpeg'
    picture.desc = 'Cover'

    # 删除已有的封面图像（如果存在）
    audio.clear_pictures()

    # 添加新的封面图像
    audio.add_picture(picture)

    audio.save()  # 保存修改
    print(f"封面图像已更新: {file_path}")

def read_flac_cover_image(file_path):
    audio = FLAC(file_path)
    if audio.pictures:
        for picture in audio.pictures:
            with open('cover_image_flac.jpg', 'wb') as img:
                img.write(picture.data)
            print("封面图像已保存为 'cover_image_flac.jpg'")
            return
    print("未找到 FLAC 文件的封面图像。")

def read_flac_metadata(file_path):
    audio = FLAC(file_path)
    for key, value in audio.items():
        print(f"{key}: {value}", type(value))
    print(f"FLAC Metadata for {file_path}")
        
def update_flac_metadata(file_path, metadata: Metadata):
    audio = FLAC(file_path)
    metadata_dict = metadata.model_dump(exclude_none=True) 
    for key, value in metadata_dict.items():
        audio[key] = value
    audio.save()
    print(f"元数据已更新: {file_path}")

# if __name__ == "__main__":
#     uvicorn.run(app, host="0.0.0.0", port=8000)
