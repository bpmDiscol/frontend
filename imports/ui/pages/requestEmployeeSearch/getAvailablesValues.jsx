export default function getAvailablesValues(key, requestEmployeeData ) {
    return requestEmployeeData
      .map((request) => request[key])
      .filter((value, index, array) => array.indexOf(value) === index)
      .map((value) => ({
        text: value,
        value,
      }));
  }