import config from "../../private/config.json";
import { timeCounter } from "./timeCounter";

const offlineTime = new timeCounter();

export function goUserOnline() {
  offlineTime.reset();
  Meteor.call("go_online", (error) => {
    if (error) console.log(error.reason);
  });
}

export function goUserOffline() {
  offlineTime.start();
  Meteor.call("go_offline", (error) => {
    if (error) console.log(error.reason);
  });
}
export function safeLogOut(){
  offlineTime.reset()
  Meteor.call("go_offline");
  Meteor.logout()
}

export function isDelayedUser() {
  
  const minutesDelay = config.minutesDelay;
  // console.log(`${minutesDelay} >> ${offlineTime.getTime()}`)
  return offlineTime.getTime() >= minutesDelay;
}
