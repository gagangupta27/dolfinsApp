import { Feather } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import { Animated, Button, StyleSheet, Text, View } from "react-native";

const Recording = ({ onStopRecording }) => {
  const fadeAnim = useRef(new Animated.Value(1)).current; // Initial opacity: 1

  /**
   * This was an attempt to make recording look like a waveform similar to Whatsapp
   * 
   */

  
  // const BAR_WIDTH = 4;
  // const BAR_MARGIN = 1;
  // const MAX_BAR_HEIGHT = 40;
  // const NUMBER_OF_BARS = 25;
  //   // Generate random bar heights for the waveform
  // const generateWaveform = (volumeLevels) => {
  // let bars = [];
  // if(volumeLevels && volumeLevels.length > 0){
  //     let maxVolume = Math.max(...volumeLevels);
  //     let minVolume = Math.min(...volumeLevels);
  //     let normalizedVolumeLevels = volumeLevels.map(level => ((level - minVolume) / (maxVolume - minVolume)) * MAX_BAR_HEIGHT*7/8 + MAX_BAR_HEIGHT/8);

  //     if(normalizedVolumeLevels.length > NUMBER_OF_BARS){
  //         bars = normalizedVolumeLevels.slice(normalizedVolumeLevels - NUMBER_OF_BARS, normalizedVolumeLevels.length);
  //     }
  //     else{
  //         bars = normalizedVolumeLevels;
  //     }
  // }
  // console.log(bars);
  // return bars;
  // };

  // const [bars, setBars] = useState([]);

  // useEffect(() => {
  //     setBars(generateWaveform(volumeLevels));
  // }, [volumeLevels]);

  // const Waveform = ({bars}) => {
  //     console.log(bars);
  //   return (
  //       <View style={{flexDirection: 'row', height: MAX_BAR_HEIGHT,  alignItems: 'center', justifyContent: 'center'}}>
  //         {bars.map((height, index) => (
  //           <View
  //             key={index}
  //             style={{
  //               width: BAR_WIDTH,
  //               height: 10,
  //               marginHorizontal: BAR_MARGIN,
  //               backgroundColor: 'white',
  //               borderRadius: BAR_WIDTH / 2,
  //             }}
  //           />
  //         ))}
  //       </View>
  //   );
  // };

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0, // Fade to opacity 0
          duration: 1000, // Duration of one fade out
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1, // Fade back to opacity 1
          duration: 1000, // Duration of one fade in
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [fadeAnim]);

  return (
    <View style={styles.container}>
      <Animated.View style={{ ...styles.mic, opacity: fadeAnim }}>
        <Feather name="mic" size={24} color="#7879F1" />
      </Animated.View>
      <Text style={styles.recordingtext}> Recording ... </Text>
      {/* <Waveform bars={bars}/> */}
      <Button onPress={onStopRecording} title={"Stop"}>
        =
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 5,
  },
  recordingtext: {
    flex: 1,
    padding: 2,
  },
  mic: {
    padding: 2,
  },
});

export default Recording;
