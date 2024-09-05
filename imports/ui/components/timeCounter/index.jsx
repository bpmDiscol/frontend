import React from "react";
import { differenceInMinutes, parseISO } from "date-fns";
import formatDuration from "../RequestDashboard/formatDuration";
import moment from "moment";

export default function TimeCounter({ startDate, endDate }) {
  const [clock, setClock] = React.useState();
  function getTimeDiference() {
    const end = endDate ? endDate : Date.now();
    const start = startDate ? moment(startDate).toDate().getTime() : Date.now();
    setClock(differenceInMinutes(end, start));
  }
  React.useEffect(() => {
    getTimeDiference();
  }, [startDate]);
  return (
    <div>
      {!endDate && "En proceso hace"} {clock && formatDuration(clock)}
    </div>
  );
}
