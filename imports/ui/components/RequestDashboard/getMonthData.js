import monthNames from "./monthNames.json";
import translate from "../../misc/translate.json";


export default function getMonthData(data, year, month) {
  if (!year) return;
  if (!Object.keys(data[year]).includes(monthNames[month])) return;
  const monthData = data[year][monthNames[month]];
  const areas = monthData.areas;
  const tasks = monthData.tasks;

  const areaTitles = Object.keys(areas);
  const areaValues = areaTitles.map((area) =>
    (areas[area].total / areas[area].quantity).toFixed(2)
  );

  const titles = Object.keys(tasks);
  const taskValues = titles.map((task) =>
    (tasks[task].total / tasks[task].quantity).toFixed(2)
  );
  const taskTitles = titles.map((title) => translate[title]);

  return {
    areaTitles,
    areaValues,
    taskTitles,
    taskValues,
  };
}
