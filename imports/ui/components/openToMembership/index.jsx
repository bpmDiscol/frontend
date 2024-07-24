import React from "react";

export default function OpenToMembership({ children, memberships }) {
  const [isVisible, setVisible] = React.useState(false);

  async function openVisibility() {
    // const roles = [
    //   ["director", "discol"],
    //   ["Lider", "Gestion_Humana"],
    // ];
    const test = memberships.map((role) => {
      return Meteor.callAsync("is_proccess_auth", role, Meteor.userId());
    });
    Promise.all(test)
      .then((permissions) => setVisible(permissions.includes(true)))
      .catch((error) => {
        console.log(error);
      });
  }
  React.useEffect(() => {
    openVisibility();
  }, []);

  return <div>{isVisible && children}</div>;
}
