import { AESencrypt, AESdecrypt } from "meteor/ostrio:aes-crypto";
import config from "../../../data.json";

export function saveTask(id) {
  const taskId = AESencrypt(id, config.secret);
  sessionStorage.setItem("currentMove", taskId);
}

export function getTask() {
  return AESdecrypt(sessionStorage.getItem("currentMove"), config.secret);
}

export function saveCase(id) {
  const taskId = AESencrypt(id, config.secret);
  sessionStorage.setItem("currentTick", taskId);
}

export function getCase() {
  return parseInt(
    AESdecrypt(sessionStorage.getItem("currentTick"), config.secret)
  );
}

export function saveTaskName(id) {
  const taskId = AESencrypt(id, config.secret);
  sessionStorage.setItem("albous", taskId);
}

export function getTaskName() {
  return AESdecrypt(sessionStorage.getItem("albous"), config.secret);
}
