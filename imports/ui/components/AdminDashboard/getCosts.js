import monthNames from "./monthNames.json";

export function getCosts(procesedTimes, year) {
  if (!procesedTimes) return;
  const monthlyCost = [];
  const unfinishedMonthlyCost = [];

  const thisYear = procesedTimes[year];
  Object.keys(thisYear).forEach((monthName) => {
    const thisMonth = thisYear[monthName];
    let cost = 0;
    let unfinishedCost = 0;
    Object.keys(thisMonth).forEach((area) => {
      cost += thisMonth[area].cost;
      unfinishedCost += thisMonth[area].unfinishedCost;
    });
    monthlyCost[monthNames.indexOf(monthName)] = cost/1000000;
    unfinishedMonthlyCost[monthNames.indexOf(monthName)] = unfinishedCost/1000000;
  });
  return {
    monthlyCost,
    unfinishedMonthlyCost,
  };
}
