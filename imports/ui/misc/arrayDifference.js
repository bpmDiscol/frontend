export function arrayDifference(bigArray, smallArray){
    return bigArray.filter(arr=> !smallArray.includes(arr))
}