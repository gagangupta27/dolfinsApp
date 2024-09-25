import { Alert } from "react-native";
import { Audio } from "expo-av";
import { useState } from "react";

const useAudioRecording = (existingAudioUri = null) => {
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

    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });
    const uri = recording.getURI();

    const filename = uri.split("/").pop();
    // const newUri = FileSystem.documentDirectory + filename;
    // await FileSystem.copyAsync({
    //   from: uri,
    //   to: newUri,
    // });
    // setVolumeLevels([])
    setRecording(null);
    setAudioUri(filename);
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
