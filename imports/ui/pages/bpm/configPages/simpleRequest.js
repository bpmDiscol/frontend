import { getCase, getTask, getTaskName } from "../../../config/taskManagement";

export async function request({ userName }) {
    return Meteor.callAsync(
      "simpleAcceptResponse",
      getTaskName(),
      userName,
      getCase(),
      getTask()
    ).catch((e) => {
      return e;
    });
  }