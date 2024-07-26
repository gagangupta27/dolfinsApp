import { AntDesign, Entypo } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { Audio } from "expo-av";
import Slider from "@react-native-community/slider";

const AudioPlayer = ({ audioUri, volumeLevels }) => {
  const BAR_WIDTH = 4;
  const BAR_MARGIN = 1;
  const MAX_BAR_HEIGHT = 40;
  const NUMBER_OF_BARS = 25;

  // Generate random bar heights for the waveform
  const generateWaveform = (volumeLevels) => {
    let bars = [];
    if (volumeLevels && volumeLevels.length > 0) {
      let maxVolume = Math.max(...volumeLevels);
      let minVolume = Math.min(...volumeLevels);
      let normalizedVolumeLevels = volumeLevels.map(
        (level) =>
          (((level - minVolume) / (maxVolume - minVolume)) *
            MAX_BAR_HEIGHT *
            7) /
            8 +
          MAX_BAR_HEIGHT / 8
      );

      let stepSize = normalizedVolumeLevels.length / NUMBER_OF_BARS;

      for (let i = 0; i < NUMBER_OF_BARS; i++) {
        let index = Math.floor(i * stepSize);
        if (index >= normalizedVolumeLevels.length) {
          index = normalizedVolumeLevels.length - 1;
        }
        bars.push(normalizedVolumeLevels[index]);
      }
    }
    return bars;
  };

  const [sound, setSound] = useState(null);
  const [runComplete, setRunComplete] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const intervalRef = useRef(null);
  const [bars, setBars] = useState([]);
  const [indexTillWhichColored, setIndexTillWhichColored] = useState(0);

  useEffect(() => {
    setBars(generateWaveform(volumeLevels));
  }, [volumeLevels]);

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  useEffect(() => {
    const fn = async () => {
      if (runComplete) {
        await sound.setPositionAsync(0);
        setRunComplete(false);
      }
    };
    fn();
  }, [runComplete]);

  const playPauseAudio = async () => {
    if (!sound) {
      const { sound: newSound, status } = await Audio.Sound.createAsync(
        { uri: audioUri },
        { shouldPlay: true },
        onPlaybackStatusUpdate
      );
      setSound(newSound);
      setDuration(status.durationMillis);
      setIsPlaying(true);
      startProgressUpdater(newSound);
    } else {
      if (isPlaying) {
        await sound.pauseAsync();
        clearInterval(intervalRef.current);
      } else {
        const status = await sound.getStatusAsync();
        if (runComplete) {
          await sound.setPositionAsync(0); // Reset position if the audio has finished
          setProgress(0);
        }
        await sound.playAsync();
        startProgressUpdater(sound);
      }
      setIsPlaying(!isPlaying);
    }
  };

  const onPlaybackStatusUpdate = async (status) => {
    if (status.didJustFinish && !status.isLooping) {
      setIsPlaying(false);
      setProgress(0);
      setRunComplete(true);
      clearInterval(intervalRef.current);
      // status.shouldPlay = false;
    }
  };

  const startProgressUpdater = (sound) => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(async () => {
      const status = await sound.getStatusAsync();
      setProgress(status.positionMillis);
    }, 100);
  };

  const onSeek = async (value) => {
    if (sound) {
      await sound.setPositionAsync(value);
      setProgress(value);
    }
  };

  const getFormattedTime = (millis) => {
    const totalSeconds = millis / 1000;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  // Constants for waveform rendering

  useEffect(() => {
    var indexTillWhichColored = 0;
    if (duration != 0 && progress != 0) {
      setIndexTillWhichColored(
        Math.ceil((progress / duration) * NUMBER_OF_BARS)
      );
    } else {
      setIndexTillWhichColored(0);
    }
  }, [duration, progress]);

  const Waveform = ({ bars }) => {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          height: MAX_BAR_HEIGHT,
          position: "absolute",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {bars.map((height, index) => (
          <View
            key={index}
            style={{
              width: BAR_WIDTH,
              height: height,
              marginHorizontal: BAR_MARGIN,
              backgroundColor: index < indexTillWhichColored ? "blue" : "white",
              borderRadius: BAR_WIDTH / 2,
            }}
          />
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={{ color: "white", fontFamily: "Inter-Bold", padding: 5 }}>
        {getFormattedTime(progress)}
      </Text>
      <Waveform bars={bars} />
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={duration}
        value={progress}
        onValueChange={onSeek}
        minimumTrackTintColor="transparent"
        maximumTrackTintColor="transparent"
        thumbTintColor="transparent"
        tapToSeek={true}
      />
      <TouchableOpacity style={styles.button} onPress={playPauseAudio}>
        <View
          style={{
            backgroundColor: "rgba(70, 121, 192, 1)",
            width: 36,
            height: 36,
            borderRadius: 18,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {isPlaying ? (
            <AntDesign name="pause" size={24} color="white" />
          ) : (
            <Entypo
              name="triangle-right"
              size={30}
              color="white"
              style={{ marginLeft: 3 }}
            />
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 61,
    backgroundColor: "#5796F2",
    borderRadius: 20,
    padding: 10,
    marginHorizontal: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    padding: 4,
  },

  slider: {
    flex: 1,
  },
});

export default AudioPlayer;
