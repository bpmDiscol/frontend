import React from "react";
import TaskList from "../components/taskList";

export default function Process({ bonitaUserId }) {
  return (
    <div className="task-contaner">
      <div>
        <h1>Iniciar procesos</h1>
        <TaskList
          method={"get_done_tasks"}
          filter={[bonitaUserId]}
          params={{ bonitaUserId }}
        />
      </div>
    </div>
  );
}
