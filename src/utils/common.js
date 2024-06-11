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
