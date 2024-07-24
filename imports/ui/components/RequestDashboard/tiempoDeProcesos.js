import { differenceInMinutes, parseISO } from "date-fns";
import monthNames from "./monthNames.json";

export default function ProcessTimes(requestProcess) {
  const mediaTimes = {};
  requestProcess.forEach((process) => {
    const processStart = parseISO(process.createdAt);
    const processend = parseISO(process.modifyedAt);
    const now = new Date(Date.now());
    const currentTime = now.toISOString();
    const month = monthNames[processend.getMonth()];
    const year = processend.getFullYear();
    const timeDiference = differenceInMinutes(processend, processStart);
    const currentTimeDiference = differenceInMinutes(currentTime, processStart);

    if (!mediaTimes[year]) mediaTimes[year] = {};
    if (!mediaTimes[year][month]) mediaTimes[year][month] = {};
    if (!mediaTimes[year][month][process.requestArea])
      mediaTimes[year][month][process.requestArea] = {
        elapsedFinishedTime: 0,
        elapsedNonFinishedTime: 0,
        count: 0,
        unfinishedCount: 0,
        unfinishedCount: 0,
        cost: 0,
        unfinishedCost: 0,
      };

    if (process.done) {
      mediaTimes[year][month][process.requestArea].elapsedTime += timeDiference;
      mediaTimes[year][month][process.requestArea].cost +=
        process.salary * process.places;
      mediaTimes[year][month][process.requestArea].count++;
    } else {
      mediaTimes[year][month][process.requestArea].elapsedNonFinishedTime +=
        currentTimeDiference;
      mediaTimes[year][month][process.requestArea].unfinishedCost +=
        process.salary * process.places;
      mediaTimes[year][month][process.requestArea].unfinishedCount++;
    }
  });
  return mediaTimes;
}
