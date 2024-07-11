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
