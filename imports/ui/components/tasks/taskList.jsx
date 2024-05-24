import React from "react";
import LoginModal from "../../pages/loginModal";
import { SecurityContext } from "../../context/securityProvider";
import TaskItem from "./taskItem";
import { Divider, Empty, Flex, Spin, Typography } from "antd";

export default function TaskList({
  filter,
  buttons,
  title,
  resume = false,
  updateList,
}) {
  const { Title } = Typography;
  const [taskList, setTaskList] = React.useState();
  const [openLogin, setOpenLogin] = React.useState(false);
  const { setToken } = React.useContext(SecurityContext);
  const [activeResume, setActiveResume] = React.useState(null);
  const onCloseModal = () => setOpenLogin(false);

  React.useEffect(() => {
    Meteor.call("get_task_list", filter, (error, result) => {
      if (error) console.log(error);
      else {
        if (result == "no token") setOpenLogin(true);
        else {
          setOpenLogin(false);
          setTaskList(result);
        }
      }
    });
  }, []);

  return (
    <Flex
      vertical
      style={{
        border: "1px solid black",
        borderRadius: "10px",
        padding: "10px",
        height: "70lvh",
        boxShadow: "5px 5px 10px black",
        background: "white",
      }}
      className="task-list"
    >
      <Title level={4} style={{ margin: "0 0 15px 0" }}>
        {title} | {taskList ? taskList.length : <Spin size="small" />}
      </Title>
      <Flex
        vertical
        style={{ overflowY: "auto", height: "100%", padding: "0 5px 0 0" }}
        gap={"15px"}
      >
        {taskList &&
          taskList !== "error" &&
          taskList.map((task, index) => {
            return (
              <TaskItem
                key={index}
                task={task}
                buttons={buttons}
                index={index}
                activeResume={index == activeResume}
                setActiveResume={setActiveResume}
                resume={resume}
                updateList={updateList}
                filter={filter}
              />
            );
          })}
        {taskList?.length == 0 && <Empty description="Sin tareas" />}
        {!taskList && <Spin fullscreen />}
      </Flex>

      <LoginModal
        openLogin={openLogin}
        onCloseLogin={onCloseModal}
        setToken={setToken}
      />
    </Flex>
  );
}
