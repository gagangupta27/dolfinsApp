import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import { AntDesign } from "@expo/vector-icons";
import { Audio } from "expo-av";
import Slider from "@react-native-community/slider";

const AudioPlayer = ({ audioUri }) => {
  const [sound, setSound] = useState(null);
  const [runComplete, setRunComplete] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const intervalRef = useRef(null);

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

  //   const getFormattedTime = (millis) => {
  //     const totalSeconds = millis / 1000;
  //     const minutes = Math.floor(totalSeconds / 60);
  //     const seconds = Math.floor(totalSeconds % 60);
  //     return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  //   };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={playPauseAudio}>
        {isPlaying ? (
          <AntDesign name="pausecircle" size={24} color="black" />
        ) : (
          <AntDesign name="play" size={24} color="black" />
        )}
      </TouchableOpacity>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={duration}
        value={progress}
        onValueChange={onSeek}
        minimumTrackTintColor="#1fb28a"
        maximumTrackTintColor="#d3d3d3"
        thumbTintColor="#1a9274"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    padding: 4,
    // margin: 2,
  },

  slider: {
    flex: 1,
  },
});

export default AudioPlayer;
