from flask import Flask, request, send_file
import librosa
import numpy as np
import random
from sklearn.cluster import KMeans
import io
from six.moves.urllib.request import urlopen
import pathlib
import pydub
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
        beat_features_raw = librosa.feature.mfcc(y=beat, sr=sr, n_mfcc=n_features)
        beat_features = []
        for raw in beat_features_raw:
            beat_features.append(sum(raw)/len(raw))
        features.append(beat_features)
    features = np.array(features)
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
    return np.array(music)

def main(main_track, sr, N_FEATURES=5, N_GROUPS=5, N_BEATS=20, TEMPERATURE=1):
    x,_ = librosa.effects.trim(main_track)
    beats = beatExtractor(x, sr)
    features = featureExtractor(beats, sr, N_FEATURES)
    groups,group_to_index = groupExtractor(features, beats, N_GROUPS)
    groups = list(groups)
    curr_group = random.randrange(N_GROUPS)
    music = []
    for i in range(N_BEATS):
        choices = groups + [curr_group]*(len(groups)//TEMPERATURE)
        curr_group = random.choice(choices)
        curr_beat = random.choice(group_to_index[curr_group])
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
    return "Hello"

@app.route('/remix', methods=['GET', 'POST'])
def server():
    if request.method == 'GET':
        return {"server":"true"}
    urls = request.get_json()["urls"]
    music = []
    rate = 48000
    for url in urls:
        z = io.BytesIO(urlopen(url).read())
        pathlib.Path(('./tmp/temp.wav')).write_bytes(z.getbuffer())
        x, _= librosa.load('./tmp/temp.wav', sr = rate)

        music += list(x)
    music = np.array(music, dtype = np.float32)
    remix = main(x, rate)
    write("./tmp/remix.wav",rate, remix,True)
    return send_file("./tmp/remix.wav")

if __name__ == '__main__':

    app.run()
