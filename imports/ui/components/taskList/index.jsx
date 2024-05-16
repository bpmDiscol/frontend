import React from "react";
import LoginModal from "../../pages/loginModal";
import { SecurityContext } from "../../context/securityProvider";
import { filterTasks } from "../../misc/filterTask";
import TaskItem from "../taskItem";

export default function TaskList({ method, params = {}, filter, buttons }) {
  const [taskList, setTaskList] = React.useState();
  const [openLogin, setOpenLogin] = React.useState(false);
  const { setToken } = React.useContext(SecurityContext);

  const onCloseModal = () => setOpenLogin(false);

  React.useEffect(() => {
    Meteor.call(method, params, (error, result) => {
      if (error) console.log(error);
      else {
        if (result == "no token") setOpenLogin(true);
        else {
          setOpenLogin(false);
          setTaskList(filterTasks(result, filter));
        }
      }
    });
  }, []);

  return (
    <div className="task-list">
      {taskList &&
        taskList.map((task, index) => {
          return (
            <TaskItem
              task={task}
              key={index}
              delay={index}
              taskItem={params.menuId + index}
              setTaskKeys={params.setTaskKeys}
              updateAvailableTasks={params.updateAvailableTasks}
              updateMyTasks={params.updateMyTasks}
              updateDoneTasks={params.updateDoneTasks}
              buttons={buttons}
            />
          );
        })}

      <LoginModal
        openLogin={openLogin}
        onCloseLogin={onCloseModal}
        setToken={setToken}
      />
    </div>
  );
}
