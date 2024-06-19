import React from "react";
import { Button, Empty, Flex, Input, Space, Spin, Typography } from "antd";
import TaskCard from "./taskCard";
import { SearchOutlined } from "@ant-design/icons";
import { checkPartialWordsInObjects } from "../../misc/checkWordsInObject";

import { Meteor } from "meteor/meteor";
import { useTracker } from "meteor/react-meteor-data";
import { requestEmployeeCollection } from "../../../api/requestEmployeData/requestEmployeeDataPublication";

export default function TaskList({
  filter,
  buttons,
  title,
  resume = false,
  updateList,
}) {
  const { Title } = Typography;
  const [taskList, setTaskList] = React.useState();
  const [activeResume, setActiveResume] = React.useState(null);
  const [taskData, setTaskData] = React.useState([]);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [visibleTasks, setVisibleTasks] = React.useState([]);

  React.useEffect(() => {
    Meteor.call("get_task_list", filter, (error, result) => {
      if (error) console.log(error);
      setTaskList(result);
      setVisibleTasks(result);
    });
  }, []);

  React.useEffect(() => {
    if (taskList?.length > 0 && taskList != "error")
      taskList.forEach((task) => {
        Meteor.call("get_employee_request_data", task.id, (err, data) => {
          if (!err)
            setTaskData([
              ...taskData,
              {
                area_proyect: data.area_proyect,
                observations: data.observations,
                requirements: data.requirements,
                salary_string: data.salary_string,
                site: data.site,
                vehicleType: data.vehicleType,
                workPlace: data.workPlace,
                taskId: task.id,
                displayName: task.displayName,
                description: task.displayDescription,
              },
            ]);
        });
      });
  }, [taskList]);


  React.useEffect(() => {
    if (!searchTerm) setVisibleTasks(taskList);
    if (searchTerm) {
      const filteredIds = checkPartialWordsInObjects(
        taskData,
        searchTerm,
        "taskId"
      );
      const filteredTasks = taskList.filter((task) =>
        filteredIds.includes(task.id)
      );
      setVisibleTasks(filteredTasks);
    }
  }, [searchTerm]);
  //TODO: filtar por tiempo(meses, semanas...) dependiendo del tipo de actividad

  return (
    <Flex
      vertical
      style={{
        border: "1px solid black",
        borderRadius: "10px",
        padding: "10px",
        height: "85lvh",
        width: "25lvw",
        minWidth: "300px",
      }}
      className="task-list"
    >
      <Flex
        style={{ width: "100%", margin: "0 0 10px 0" }}
        justify="space-between"
        align="center"
      >
        <Title level={4} style={{ margin: 0 }}>
          {title} | {taskList ? taskList.length : <Spin size="small" />}
        </Title>
        <Space.Compact style={{ maxWidth: "50%" }}>
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.currentTarget.value)}
          />
          <Button icon={<SearchOutlined />}></Button>
        </Space.Compact>
      </Flex>

      <Flex
        vertical
        style={{ overflowY: "auto", height: "100%", padding: "0 5px 0 0" }}
        gap={"15px"}
      >
        {visibleTasks &&
          visibleTasks != "error" &&
          visibleTasks?.map((task, index) => {
            
            
            return (
              <TaskCard
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
    </Flex>
  );
}
