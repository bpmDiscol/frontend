import monthNames from "./monthNames.json";

export function getTotalElapsedTime(year, chartData, timeOperatorValue) {
  let finisheds = [];
  let unfinisheds = [];

  Object.keys(chartData[year]).forEach((month) => {
    let monthTime = 0;
    let monthcount = 0;
    let monthUnfinishedTime = 0;
    let monthUnfinishedCount = 0;

    const areas = Object.keys(chartData[year][month]);
    const currentMonthData = chartData[year][month];
    areas.forEach((area) => {
      monthTime += currentMonthData[area].elapsedFinishedTime;
      monthcount += currentMonthData[area].count;
      monthUnfinishedTime += currentMonthData[area].elapsedNonFinishedTime;
      monthUnfinishedCount += currentMonthData[area].unfinishedCount;
    });

    const monthMedia = monthTime / monthcount || 0;
    const unfinishedsMedia = monthUnfinishedTime / monthUnfinishedCount;
    finisheds[monthNames.indexOf(month)] = Math.ceil(
      monthMedia / timeOperatorValue
    ).toFixed(2);
    unfinisheds[monthNames.indexOf(month)] = (
      unfinishedsMedia / timeOperatorValue
    ).toFixed(2);
  });
  return {
    finisheds,
    unfinisheds,
  };
}
