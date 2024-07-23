import { getCase, getTask, getTaskName } from "../../../config/taskManagement";
import {Meteor} from "meteor/meteor"
export async function request({ userName }) {
    return Meteor.callAsync(
      "simpleAcceptResponse",
      getTaskName(),
      userName,
      getCase(),
      getTask(),
      Meteor.userId()
    ).catch((e) => {
      return e;
    });
  }