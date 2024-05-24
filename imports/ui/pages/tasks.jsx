import React from "react";
import "./styles/tasks.css";
import TaskList from "../";
import { MonthPicker, MonthInput } from "react-lite-month-picker";

export default function Tasks({ bonitaUserId }) {
  const [selectedMonthData, setSelectedMonthData] = React.useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });
  const [isPickerOpen, setIsPickerOpen] = React.useState(false);

  const [taskKeys, setTaskKeys] = React.useState(0);
  const [availableKey, updateAvailableTasks] = React.useState(Math.random());
  const [myTasksKey, updateMyTasks] = React.useState(Math.random());
  const [doneKey, updateDoneTasks] = React.useState(Math.random());

  return (
    <div className="task-container" key={taskKeys}>
      <div className="task-block">
        <h1>Tareas disponibles</h1>
        <TaskList
          filter={'available'}
          params={{
            menuId: "available-",
            setTaskKeys,
            updateAvailableTasks,
            updateMyTasks,
            updateDoneTasks,
          }}
          buttons={{
            accept: true,
            abandon: false,
            procced: false
          }}
          key={availableKey}
        />
      </div>
      <div className="task-block">
        <h1>Tareas por hacer</h1>
        <TaskList
          method={"get_available_tasks"}
          filter={'assigned'}
          params={{
            menuId: "mytasks-",
            setTaskKeys,
            updateAvailableTasks,
            updateMyTasks,
            updateDoneTasks,
          }}
          buttons={{
            accept: false,
            abandon: true,
            procced: true
          }}
          key={myTasksKey}
        />
      </div>
      <div className="task-block">
        <h1>Tareas realizadas</h1>
        <div
          style={{
            display: "flex",
            justifyContent: "end",
            width: "100%",
            paddingRight: "10px",
          }}
        >
          {/* TODO: filtrar por fecha */}
          {/* <MonthInput
            selected={selectedMonthData}
            setShowMonthPicker={setIsPickerOpen}
            showMonthPicker={isPickerOpen}
          />
          {isPickerOpen ? (
            <div className="date-selector">
              <MonthPicker
                setIsOpen={setIsPickerOpen}
                selected={selectedMonthData}
                onChange={setSelectedMonthData}
                size="large"
              />
            </div>
          ) : null} */}
        </div>

        <TaskList
          method={"get_done_tasks"}
          filter={'doneTasks'}
          params={{
            bonitaUserId,
            menuId: "done-",
            setTaskKeys,
            updateAvailableTasks,
            updateMyTasks,
            updateDoneTasks,
          }}
          buttons={{
            accept: false,
            abandon: false,
            procced: false
          }}
          key={doneKey}
        />
      </div>
    </div>
  );
}
