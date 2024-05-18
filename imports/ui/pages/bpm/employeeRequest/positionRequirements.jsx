import React from "react";

export default function PositionRequirements({ requestEmployee }) {
  React.useEffect(() => {
    const requirements = document.getElementById("requirements");
    requirements.innerHTML = requestEmployee.requirements;
  }, []);
  return (
    <div className="rich-text-view-box">
      <p id="requirements"></p>
    </div>
  );
}
