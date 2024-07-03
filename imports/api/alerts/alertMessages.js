import { Meteor } from "meteor/meteor";
import { Picker } from "meteor/meteorhacks:picker";

const bodyParser = Meteor.npmRequire("body-parser");

Picker.middleware(bodyParser.json());
Picker.middleware(bodyParser.urlencoded({ extended: false }));

const postRoutes = Picker.filter(function (req, res) {
  return req.method == "POST";
});

postRoutes.route("/post", function (params, req, res, next) {
  console.log("Body: " + JSON.stringify(req.body));

  const { user } = req.body;
  Meteor.call("create_alert", { user });
  res.end();
});
