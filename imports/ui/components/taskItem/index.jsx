import React from "react";
import { formatDate } from "../../misc/formatDate";
import PreviewDisplay from "./previewDisplay";
import { getView } from "../../config/getView";

export default function TaskItem({
  task,
  setTaskKeys,
  updateAvailableTasks,
  updateMyTasks,
  updateDoneTasks,
  delay,
  buttons,
}) {
  const [openTask, setOpenTask] = React.useState(false);
  const [previewTask, setPreviewTask] = React.useState();

  function setPreview() {
    Meteor.call("set_task_id", { taskId: task.id });
    setPreviewTask(getView(task.name + "_preview"));
    setOpenTask(true);
  }

  return (
    <React.Fragment>
      <div onClick={() => setPreview()}>
        <div className="task-card" style={{ animationDelay: `${delay / 10}s` }}>
          <div className="task-img"></div>
          <div className="task-text-box">
            <div className="task-content">
              <p className="task-title">{task.displayName}</p>
              <span>{formatDate(task.last_update_date)}</span>
            </div>
            <div className="task-description">{task.displayDescription}</div>
          </div>
          <div></div>
          <div
            className="task-priority"
            style={{
              backgroundColor: task.priority == "normal" ? "lightgreen" : "red",
            }}
          >
            {/* TODO: asignar prioridades (se asignan el la GUI >> pertaña "General") */}
          </div>
        </div>
      </div>
      <PreviewDisplay
        task={task}
        setTaskKeys={setTaskKeys}
        updateAvailableTasks={updateAvailableTasks}
        updateMyTasks={updateMyTasks}
        updateDoneTasks={updateDoneTasks}
        buttons={buttons}
        openTask={openTask}
        setOpenTask={setOpenTask}
        previewTask={previewTask}
      />
    </React.Fragment>
  );
}
