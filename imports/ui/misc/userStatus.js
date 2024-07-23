import { timeCounter } from "./timeCounter";
import { Meteor } from "meteor/meteor";

// import config from "../../private/config.json";

const offlineTime = new timeCounter();

export function goUserOnline() {
  offlineTime.reset();
  Meteor.call("go_online", Meteor.userId(), (error) => {
    if (error) console.log(error.reason);
  });
}

export function goUserOffline() {
  offlineTime.start();
  Meteor.call("go_offline", Meteor.userId(), (error) => {
    if (error) console.log(error.reason);
  });
}
export function safeLogOut() {
  offlineTime.reset();
  sessionStorage.removeItem("currentView");
  sessionStorage.removeItem("constId");
  sessionStorage.removeItem("currentTick");
  sessionStorage.removeItem("currentMove");
  sessionStorage.removeItem("albous");

  Meteor.call("go_offline");
  Meteor.logout();
}

export function isDelayedUser() {
  const minutesDelay = 20;
  // console.log(`${minutesDelay} >> ${offlineTime.getTime()}`)
  return offlineTime.getTime() >= minutesDelay;
}
