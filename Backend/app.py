from flask import Flask, request, send_file
import librosa
import numpy as np
import random
from sklearn.cluster import KMeans
import io
from six.moves.urllib.request import urlopen
import pathlib
import pydub
import base64
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def beatExtractor(track, sr):
    tempo, beat_times = librosa.beat.beat_track(
        y=track, sr=sr, tightness=10, start_bpm=30, units='time')
    beat_points = beat_times*sr
    beats = []
    for i in range(len(beat_points)):
        if(i==0):
            beats.append(librosa.effects.trim(track[:int(beat_points[0]-1)])[0])
        else:
            beats.append(librosa.effects.trim(track[int(beat_points[i-1]):int(beat_points[i]-1)])[0])
        if(i==len(beat_points)-1):
            beats.append(librosa.effects.trim(track[int(beat_points[i]):])[0])
    beats = np.array(beats)
    return beats

def featureExtractor(beats, sr, n_features):
    features =[]
    for beat in beats:
        beat_features_raw = librosa.feature.chroma_stft(y=beat, sr=sr,n_chroma=n_features)
        beat_features = []
        for raw in beat_features_raw:
            beat_features.append(sum(raw)/len(raw))
        features.append(beat_features)
    features = np.array(features, dtype=np.float32)
    return features

def groupExtractor(features, beats, n_groups):
    if(len(features)!=len(beats)):
        raise("Error: beats and features mismatch")
    kmeans = KMeans(n_clusters=n_groups, init='k-means++', random_state=0)
    y_kmeans = kmeans.fit_predict(features)
    group_to_index = {}
    for i in range(len(y_kmeans)):
        group_to_index[y_kmeans[i]] = []
    for i in range(len(y_kmeans)):
        group_to_index[y_kmeans[i]].append(i)
    return (y_kmeans, group_to_index)

def musicGenerator(beats, beat_notes):
    music = []
    for note in beat_notes:
        music = music + list(beats[note])
    return np.array(music, dtype=np.float32)

def main(main_track, sr, N_FEATURES=50, N_GROUPS=5, N_BEATS=20, TEMPERATURE=3):
    beats = beatExtractor(main_track, sr)
    features = featureExtractor(beats, sr, N_FEATURES)
    groups,group_to_index = groupExtractor(features, beats, N_GROUPS)
    groups = list(groups)
    curr_group = random.randrange(N_GROUPS)
    curr_beat = -1
    music = []
    for i in range(N_BEATS):
        nextTone = random.randint(0,TEMPERATURE)
        if(nextTone==0 and curr_beat<len(beats)-1):
            curr_beat+=1
        else:
            curr_beat = random.choice(group_to_index[curr_group])
            curr_group = groups[curr_beat]
        music.append(curr_beat)
    music_arr = musicGenerator(beats,music)
    return music_arr

def write(f, sr, x, normalized=False):
    channels = 2 if (x.ndim == 2 and x.shape[1] == 2) else 1
    if normalized:  
        y = np.int16(x * 2 ** 15)
    else:
        y = np.int16(x)
    song = pydub.AudioSegment(y.tobytes(), frame_rate=sr, sample_width=2, channels=channels)
    song.export(f, format="wav")
    
@app.route('/', methods=['GET'])
def fun():
    return {"path": "/remix", "method":"POST", "body":{"urls":"string[]"}}

@app.route('/remix', methods=['POST'])
def server():
    urls = request.get_json()["urls"]
    music = []
    rate = 48000
    for url in urls:
        z = io.BytesIO(urlopen(url).read())
        pathlib.Path(('./tmp/temp.wav')).write_bytes(z.getbuffer())
        x, _= librosa.load('./tmp/temp.wav', sr = rate)

        music += list(x)
    music = np.array(music, dtype = np.float32)
    remix = main(music, rate)
    write("./tmp/remix.wav",rate, remix,True)
    return send_file("./tmp/remix.wav")

@app.route("/music", methods=['GET'])
def music():
    links = {"musics":{
        "Animals":"https://drive.google.com/uc?id=1PztZQ1NFVVnE2ec2U3dB4Hoc7PqqaAkV",
        "Ben 10 Theme":"https://drive.google.com/uc?id=1zyV05-mZbxsbRT5O23nPjHV2LSBrri-5",
        "DesPacito":"https://drive.google.com/uc?id=1LJnlDYP2DAYZ_J2Qm9j3eZQ8nqW0p4cE",
        "GTA San Andreas":"https://drive.google.com/uc?id=1fRqKSiYgCeArNZk5pC7zVjpp_rRtsZLW",
        "Lily":"https://drive.google.com/uc?id=1LxYH9sf5FD6SAs8plwF4dYKZ5sH8zeuZ",
        "ShapeOfYou":"https://drive.google.com/uc?id=19Gi7qVPcNz9Ax0I-f3dQ4sxdSDKZjAiS",
        "Titanic":"https://drive.google.com/uc?id=1UPHwsM5g1oFZpr5d3-uXwI-iNo9gke2K",
        "Zara zara":"https://drive.google.com/uc?id=1AcoMhTd_hT_gkIVphEzpgP5sY2osxKWp",
        }}
    return links
if __name__ == '__main__':
    app.run()
