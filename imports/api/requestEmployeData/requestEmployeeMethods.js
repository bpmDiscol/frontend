import { Meteor } from "meteor/meteor";
import { requestEmployeeCollection } from "./requestEmployeeDataPublication";

Meteor.methods({
  add_request(data, caseId) {
    requestEmployeeCollection.insert({
      ...data,
      createdAt: new Date(),
      caseId,
    });
  },
  update_data(data, caseId) {
    const field = data?.field?.join(".");
    requestEmployeeCollection.update(
      { caseId: caseId },
      { $addToSet: { [`${field}`]: data.value } }
    );
  },
  set_data(data, caseId) {
    const field = data?.field?.join(".");
    requestEmployeeCollection.update(
      { caseId },
      { $set: { [`${field}`]: data.value } }
    );
  },
  count_employee_font(font) {
    return requestEmployeeCollection
      .find({ "curricullumsInput.foundBy": font })
      .count();
  },
});
