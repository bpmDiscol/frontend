export function getAreasTimes(procesedTimes, yearToView, monthToView, timeOperatorValue) {
  if (
    procesedTimes &&
    yearToView &&
    monthToView &&
    Object.keys(procesedTimes[yearToView]).includes(monthToView)
  ) {
    const areasTimes = {
      areas: [],
      finishedMedias: [],
      unfinishedMedias: [],
      finishedCosts: [],
      unfinishedCosts: [],
    };
    Object.keys(procesedTimes[yearToView][monthToView]).forEach((area) => {
      const currentArea = procesedTimes[yearToView][monthToView][area];
      areasTimes.areas.push(area);
      areasTimes.finishedMedias.push(
        (
          currentArea.elapsedFinishedTime /
            currentArea.count /
            timeOperatorValue || 0
        ).toFixed(2)
      );
      areasTimes.unfinishedMedias.push(
        (
          currentArea.elapsedNonFinishedTime /
            currentArea.unfinishedCount /
            timeOperatorValue || 0
        ).toFixed(2)
      );
      areasTimes.finishedCosts.push(currentArea.cost/1000000);
      areasTimes.unfinishedCosts.push(currentArea.unfinishedCost/1000000);
    });
    return areasTimes;
  }
}
