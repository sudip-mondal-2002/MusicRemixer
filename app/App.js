import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import RNFetchBlob from 'rn-fetch-blob'
import Sound from 'react-native-sound'
Sound.setCategory('Playback');

export default function App() {
  const [musics, setMusics] = React.useState({})
  const [selected, setSelected] = React.useState([])
  const add = (name) => {
    setSelected([...selected, name])
  }
  const remove = (name) => {
    var filteredArr = selected.filter(select => select != name);
    setSelected(filteredArr)
  }
  const mix = async () => {
    var urls = [];
    urls = selected.map(filename => {
      return musics[filename]
    })
    try {
      const blob = await RNFetchBlob.config({
        fileCache: true
      }).fetch('POST', "https://musicremixer.herokuapp.com/remix", {
        "Content-Type": "application/json",
      }, JSON.stringify({ urls }))
      var music = new Sound(blob.path(), Sound.MAIN_BUNDLE, (error) => {
        if (error) {
          console.log('failed to load the sound', error);
          return;
        }
        // loaded successfully
        console.log('duration in seconds: ' + music.getDuration() + 'number of channels: ' + music.getNumberOfChannels());

        // Play the sound with an onEnd callback
        music.play((success) => {
          if (success) {
            console.log('successfully finished playing');
          } else {
            console.log('playback failed due to audio decoding errors');
          }
        })
      })
    } catch (error) {

    }
  }
  React.useEffect(async () => {
    const res = await fetch("https://musicremixer.herokuapp.com/music")
    const listOfMusic = await res.json();
    setMusics(listOfMusic["musics"])
  }, [])
  return (
    <View style={styles.container}>
      {
        Object.keys(musics).map((name) => {
          return (
            <View key={name} style={{ height: 50, marginTop: 5, width: 300 }}>
              {selected.filter(select => select == name).length == 0 ?
                <Button title={`Add ${name}`} color="#2E8B57" onPress={() => { add(name) }} disabled={selected.length>=3} /> :
                <Button title={`Delete ${name}`} color="#8B572E" onPress={() => { remove(name) }} />}
            </View>
          )
        })
      }
      <View style={{ height: 50, marginTop: 10, width: 200 }}>
        <Button title="Mix" onPress={mix} />
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listItem: {
    minWidth: 200
  }
});
