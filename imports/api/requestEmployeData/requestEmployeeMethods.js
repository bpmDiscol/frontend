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
  async paginateRequestEmployee(query, page, pageSize) {
    const collection = await requestEmployeeCollection
      .rawCollection()
      .aggregate([
        { $match: query },
        { $sort: { createdAt: -1 } },
        {
          $facet: {
            metadata: [{ $count: "totalCount" }],
            data: [{ $skip: (page - 1) * pageSize }, { $limit: pageSize }],
          },
        },
        {
          $project: {
            data: 1,
            totalCount: { $arrayElemAt: ["$metadata.totalCount", 0] },
          },
        },
      ])
      .toArray();
    return {
      data: collection[0].data,
      total: collection[0].totalCount,
    };
  },
});
