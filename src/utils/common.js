export async function getLastSubstringAfterAt(text) {
  return new Promise((resolve, reject) => {
    const pattern = /@([^\s@]+)(?!\S)/g;
    let lastMatch = null;
    let match;

    while ((match = pattern.exec(text)) !== null) {
      lastMatch = match[1];
    }

    resolve(lastMatch);
  });
}

export function uuidv4() {
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) =>
    (
      +c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (+c / 4)))
    ).toString(16)
  );
}

export function asyncWrite(realm, cb) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        if (!realm.isInTransaction) {
          realm.write(() => {
            resolve(cb(realm));
          });
        } else {
          console.warn(
            "Realm (write) was already in a transaction, delaying call one more loop."
          );
          setTimeout(() => {
            try {
              realm.write(() => {
                resolve(cb(realm));
              });
            } catch (err) {
              reject(err);
            }
          });
        }
      } catch (err) {
        reject(err);
      }
    });
  });
}

export const getCircularReplacer = () => {
  const seen = new WeakSet();
  return (key, value) => {
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) {
        return;
      }
      seen.add(value);
    }
    return value;
  };
};

export const getTextFromAudio = (audioUri = "", setLoading = () => {}) => {};

export const debounce = (func, delay) => {
  let timeoutId;

  return function (...args) {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
};
