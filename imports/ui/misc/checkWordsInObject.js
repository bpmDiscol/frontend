export function checkPartialWordsInObjects(objects, words, idKey) {
  let wordsArray = words.split(" ");
  wordsArray = wordsArray.map((word) => word.toLowerCase());
  const foundKeys = objects
    .filter((obj) => {
      return Object.values(obj).some((value) => {
        let lowerCaseValue = String(value).toLowerCase();
        return wordsArray.some((word) => lowerCaseValue.includes(word));
      });
    })
    .map((obj) => obj[idKey]);

  return foundKeys;
}
