export function sumaArrayValues(arr1, arr2) {
  const suma = arr1.map((value, index) => {
    return parseFloat(value) + parseFloat(arr2[index]);
  });
  return suma;
}
