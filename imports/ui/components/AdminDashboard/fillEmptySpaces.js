export function fillEmptySpaces(array) {
  if (!array?.length) return;
  const newArray = [];
  for (i = 0; i < array.length; i++) {
    newArray.push(array[i] || 0);
  }
  return newArray;
}
