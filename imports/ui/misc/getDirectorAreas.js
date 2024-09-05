import areasByMemberships from "../pages/bpm/data/areasByMemberships.json";

export default function getDirectorAreas(user) {
  const memberships = Meteor.users.findOne(user).profile.memberships;

  const directorMemberships = memberships.filter((ms) => ms[0] == "director");
  if (!directorMemberships.length) return [];
  const areas = directorMemberships.map((dms) => {
    const directorData = areasByMemberships.find(
      (value) => JSON.stringify(value.membership) == JSON.stringify(dms)
    );
    return directorData?.menu.map((menu) => menu.value);
  });
  return areas.flat(1);
}
