import React from "react";
import LoginModal from "../../pages/loginModal";
import { SecurityContext } from "../../context/securityProvider";
import { formatDate } from "../../misc/formatDate";
import { filterTasks } from "../../misc/filterTask";

export default function TaskList({ method, params={}, filter }) {
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
    <div>
      {taskList &&
        taskList.map((task, index) => {
          return (
            <div className="task-card" key={index}>
              <div
                className={
                  task.assigned_id ? "task-item-selected" : "task-item"
                }
              >
                <div>{task.displayName}</div>
                <div>{formatDate(task.last_update_date)}</div>
              </div>
            </div>
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
