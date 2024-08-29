import { Meteor } from "meteor/meteor";

Meteor.methods({
  async get_requestProcess(user) {
    const data = await Meteor.callAsync("manage_data", "get", {
      url: "/API/bdm/businessData/com.discol.model.RequestProcess?p=0&c=9999&q=find",
      data: {},
      user,
    }).catch((error) => console.error(error));
    return data.response;
  },
  async get_approvations(requestProcess, user) {
    const approvationsLinks = requestProcess?.map(
      (request) => request.links[0].href
    );
    const approvationsData = approvationsLinks?.map((url) => {
      const data = Meteor.callAsync("manage_data", "get", {
        url,
        data: {},
        user,
      });
      return data;
    });
    return await Promise.all(approvationsData)
      .then((data) => {
        return data.map((data) => data.response);
      })
      .catch((e) => {
        console.log(e);
        return [];
      });
  },
});
