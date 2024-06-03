import { useRoute } from "@react-navigation/native";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";
import { useState } from "react";
import { Alert } from "react-native";
import {
  BUTTON_NAME,
  EVENTS,
  INPUT_NAME,
  useTrackWithPageInfo
} from "../utils/analytics";

const useAudioRecording = (existingAudioUri = null) => {
  const route = useRoute();

  const track = useTrackWithPageInfo();
  const [recording, setRecording] = useState(null);
  const [audioUri, setAudioUri] = useState(existingAudioUri);
  const [volumeLevels, setVolumeLevels] = useState([]);

  const onPlaybackStatusUpdate = async (status) => {
    const { metering } = status;
    if (metering) {
      setVolumeLevels((prevVolumeLevels) => [...prevVolumeLevels, metering]);
    }
  };

  const onStartRecording = async () => {
    track(EVENTS.BUTTON_TAPPED.NAME, {
      [EVENTS.BUTTON_TAPPED.KEYS.BUTTON_NAME]: BUTTON_NAME.RECORD_AUDIO,
    });

    track(EVENTS.INPUT_START.NAME, {
      [EVENTS.INPUT_START.KEYS.INPUT_NAME]: INPUT_NAME.RECORD_AUDIO,
    });

    try {
      setAudioUri(null);
      setVolumeLevels([]);
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission not granted for audio recording.");
        return;
      }
      // Stop and unload any active recording
      if (recording) {
        await recording.stopAndUnloadAsync();
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      recording.setOnRecordingStatusUpdate(onPlaybackStatusUpdate);
      setRecording(recording);
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  };

  const onStopRecording = async () => {
    const status = await recording.getStatusAsync();
    const recordingLength = status.durationMillis;
    track(EVENTS.INPUT_DONE.NAME, {
      [EVENTS.INPUT_DONE.KEYS.INPUT_NAME]: INPUT_NAME.RECORD_AUDIO,
      [EVENTS.INPUT_DONE.KEYS.INPUT_IDENTIFIER]: recordingLength,
    });

    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });
    const uri = recording.getURI();

    const filename = uri.split("/").pop();
    const newUri = FileSystem.documentDirectory + filename;
    await FileSystem.copyAsync({
      from: uri,
      to: newUri,
    });
    // setVolumeLevels([])
    setRecording(null);
    setAudioUri(newUri);
  };

  return {
    recording,
    onStartRecording,
    onStopRecording,
    audioUri,
    setAudioUri,
    setRecording,
    volumeLevels,
    setVolumeLevels,
  };
};

export default useAudioRecording;
