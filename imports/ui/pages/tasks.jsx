import React from "react";
import "./styles/tasks.css";
import TaskList from "../components/taskList";

export default function Tasks({ bonitaUserId }) {

  return (
    <div className="task-contaner">
      <div>
        <h1>Tareas</h1>
        <TaskList method={"get_available_tasks"} filter={["", bonitaUserId]} />
      </div>
    </div>
  );
}
