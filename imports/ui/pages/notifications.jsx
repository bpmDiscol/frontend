import React from "react";
import { useTracker } from "meteor/react-meteor-data";
import { AlertsCollection } from "../../api/alerts/alertsCollection";

export default function Notifications() {
  const [myMemberships, setMyMemberships] = React.useState();

  const alerts = useTracker(() => {
    if (myMemberships) {
      const query = {
        $or: myMemberships.map((arr) => ({
          user: { $all: arr },
        })),
      };
      Meteor.subscribe("alerts");
      return AlertsCollection.find(query).fetch();
    }
  });
  console.log("🚀 ~ alerts ~ alerts:", alerts);

  React.useEffect(() => {
    Meteor.call("get_my_memberships", (err, resp) => {
      if (err) console.log(err);
      else setMyMemberships(resp);
    });
  }, []);
  return <div>Notificarions</div>;
}
