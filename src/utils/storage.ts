import AsyncStorage from "@react-native-async-storage/async-storage";

async function setItem(key: string, value: any) {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    console.error(e);
  }
}

function getItem(key: string) {
  return new Promise(async function (resolve, reject) {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      const val = jsonValue != null ? JSON.parse(jsonValue) : null;
      resolve(val);
    } catch (e) {
      reject(e);
      console.error(e);
    }
  });
}

async function removeItem(key: string) {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    console.error(e);
  }
}

export const Storage = {
  setItem: (key, value) => setItem(key, value),
  getItem: (key) => getItem(key),
  removeItem: (key) => removeItem(key),
};
