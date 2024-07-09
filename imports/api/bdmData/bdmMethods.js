import { Meteor } from "meteor/meteor";

Meteor.methods({
  async get_requestProcess() {
    return await Meteor.callAsync("get_data", {
      url: "/API/bdm/businessData/com.discol.model.RequestProcess?p=0&c=9999&q=find",
      params: {},
    }).catch((error) => console.error(error));
  },
  async get_approvations(requestProcess) {
    const approvationsLinks = requestProcess.map(
      (request) => request.links[0].href
    );
    const approvationsData = approvationsLinks.map((url) => {
      return Meteor.callAsync("get_data", {
        url,
        params: {},
      });
    });

    return await Promise.all(approvationsData)
      .then((data) => data)
      .catch((e) => {
        console.log(e);
        return [];
      });
  },
});
