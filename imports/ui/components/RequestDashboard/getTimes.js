import moment from "moment";
import monthNames from "./monthNames.json";

const tasksOutANS = [
  "employee_request_hr",
  "salary_validation",
  "sign_contract",
  "generate_induction",
  "activate_social_security",
  "gears_auth",
  "healt_service_response",
];

function getEffective(ANS, areaCode, thisTime) {
  if (!ANS) return;
  if (!ANS[areaCode]) return;
  if (ANS[areaCode] >= thisTime) return "effective";
  else return "no-effective";
}

export default async function getApprovationsTimes(
  requestProcess,
  approvations,
  ANS = []
) {
  const totals = {};

  approvations.forEach((tasks, index) => {
    const startDate = requestProcess[index].createdAt;
    const year = moment(startDate).year();
    const month = monthNames[moment(startDate).month()];

    if (!totals[year]) totals[year] = {};
    if (!totals[year][month])
      totals[year][month] = {
        tasks: {},
        areas: {},
        processIds: [],
        hhrrEfectivity: [],
        leaderEfectivity: [],
        activities: [],
      };

    totals[year][month].processIds.push(requestProcess[index].processId);
    const myANS = ANS.find(
      (ans) => ans.caseId == requestProcess[index].processId
    );

    let hhrrTime = 0;
    let leaderTime = 0;
    const activities = {};
    tasks.forEach((task, idx) => {
      if (task.response === "undefined") {
        thisTask = task.taskName;

        if (!totals[year][month].tasks[task.taskName])
          totals[year][month].tasks[task.taskName] = {};

        const thisMonth = totals[year][month].tasks;
        const taskName = thisMonth[task.taskName];

        let endOfTask = { responseDate: Date.now() };

        for (i = idx + 1; i < tasks.length; i++) {
          if (
            tasks[i].response !== "undefined" &&
            tasks[i].taskName == thisTask
          ) {
            endOfTask = tasks[i];
            break;
          }
        }

        if (!taskName.total) {
          taskName.total = 0;
          taskName.quantity = 0;
        }
        taskName.total += moment(endOfTask.responseDate).diff(
          task.responseDate,
          "days",
          true
        );
        taskName.quantity += 1;
      }
    });
    let tasksAreas = [];
    tasks.forEach((task, idx) => {
      if (task.response === "undefined") {
        thisArea = task.area;

        if (!totals[year][month].areas[thisArea])
          totals[year][month].areas[thisArea] = {};

        const thisMonth = totals[year][month].areas;
        const taskArea = thisMonth[thisArea];

        let endOfTask = { responseDate: Date.now() };

        for (i = idx + 1; i < tasks.length; i++) {
          if (tasks[i].response !== "undefined" && tasks[i].area == thisArea) {
            endOfTask = tasks[i];
            break;
          }
        }
        if (
          thisArea === "Gestion humana" &&
          !tasksOutANS.includes(task.taskName)
        )
          hhrrTime += moment(endOfTask.responseDate).diff(
            task.responseDate,
            "days",
            true
          );
        if (thisArea === "Lider")
          leaderTime += moment(endOfTask.responseDate).diff(
            task.responseDate,
            "days",
            true
          );

        if (!taskArea.total) {
          taskArea.total = 0;
          taskArea.quantity = 0;
        }
        taskArea.total += moment(endOfTask.responseDate).diff(
          task.responseDate,
          "days",
          true
        );
        if (!activities[thisArea]) activities[thisArea] = 0;
        activities[thisArea] += moment(endOfTask.responseDate).diff(
          task.responseDate,
          "days",
          true
        );

        if (!tasksAreas.includes(thisArea)) {
          taskArea.quantity += 1;
          tasksAreas.push(thisArea);
        }
      }
    });
    if (hhrrTime) {
      const isHHRREffective = getEffective(myANS, "hhrr", hhrrTime);
      if (isHHRREffective)
        totals[year][month].hhrrEfectivity.push(isHHRREffective);

      if (leaderTime) {
        const isLeaderEffective = getEffective(myANS, "isTech", leaderTime);
        if (isLeaderEffective)
          totals[year][month].leaderEfectivity.push(isLeaderEffective);
      }
    }

    totals[year][month].activities.push({
      ...activities,
      id: requestProcess[index].processId,
    });
  });

  return totals;
}
