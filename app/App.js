import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

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
    const data = { "urls": urls }
    //TODO
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
                <Button title={`Add ${name}`} color="#2E8B57" onPress={() => { add(name) }} /> :
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
