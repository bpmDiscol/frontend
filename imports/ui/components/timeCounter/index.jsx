import React from "react";
import { differenceInMinutes, parseISO } from "date-fns";
import formatDuration from "../AdminDashboard/formatDuration";

export default function TimeCounter({ startDate, endDate }) {
  const [clock, setClock] = React.useState();
  React.useEffect(() => {
    function getTimeDiference() {
      const end = endDate ? endDate : Date.now();
      const start = parseISO(startDate);
      setClock(differenceInMinutes(end, start));
    }
    setInterval(getTimeDiference, 1000);
  }, []);
  return (
    <div>
      {!endDate && "En proceso hace"} {clock && formatDuration(clock)}
    </div>
  );
}
