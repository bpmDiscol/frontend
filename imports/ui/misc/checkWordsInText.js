function checkWordsInText(text, words) {
  let wordsArray = words.split(" ");
  let lowerCaseText = text.toLowerCase();
  wordsArray = wordsArray.map((word) => word.toLowerCase());
  const foundWords = wordsArray.filter((word) => lowerCaseText.includes(word));
  return foundWords.length > 0;
}
