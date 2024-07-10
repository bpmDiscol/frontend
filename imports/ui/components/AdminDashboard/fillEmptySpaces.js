export  function fillEmptySpaces(array) {
    const newArray = [];
    for (i = 0; i < array.length; i++) {
      newArray.push(array[i] || 0);
    }
    return newArray;
  }