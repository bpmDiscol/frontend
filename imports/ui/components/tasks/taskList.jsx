import React from "react";
import {
  Button,
  Divider,
  Empty,
  Flex,
  Input,
  List,
  Skeleton,
  Space,
  Spin,
  Typography,
} from "antd";
import TaskCard from "./taskCard";
import { ArrowDownOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { checkPartialWordsInObjects } from "../../misc/checkWordsInObject";

import { Meteor } from "meteor/meteor";
import InfiniteScroll from "react-infinite-scroll-component";

export default function TaskList({
  filter,
  buttons,
  title,
  resume = false,
  updateList,
}) {
  const { Title } = Typography;
  const [taskList, setTaskList] = React.useState([]);
  const [taskData, setTaskData] = React.useState([]);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [visibleTasks, setVisibleTasks] = React.useState([]);
  const [config, setConfig] = React.useState({
    items: 10,
    page: 0,
    hasMore: true,
  });

  function addData() {
    setConfig({ ...config, hasMore: true });
    Meteor.call(
      "get_task_list",
      filter,
      Meteor.userId(),
      config.page,
      config.items,
      (error, result) => {
        if (error) return console.log("tasklist error");
        if (result.length) {
          setTaskList(taskList.concat(result));
          setConfig({
            ...config,
            page: config.page + 1,
            hasMore: result.length >= config.items,
          });
        } else setConfig({ ...config, hasMore: false });
      }
    );
  }

  React.useEffect(() => {
    addData();
  }, []);

  // React.useEffect(() => {
  //   if (taskList?.length > 0 && title !== "Completado") {
  //     const taskDataPromises = taskList.map(async (task) => {
  //       try {
  //         return await Meteor.callAsync(
  //           "get_employee_request_data",
  //           task.id,
  //           Meteor.userId()
  //         );
  //       } catch (e) {
  //         return console.log(e);
  //       }
  //     });

  //     Promise.all(taskDataPromises)
  //       .then((data) => data)
  //       .then((data) => {
  //         const newData = data.map((innerInfo, index) => {
  //           return {
  //             area_proyect: innerInfo.area_proyect,
  //             observations: innerInfo.observations,
  //             requirements: innerInfo.requirements,
  //             salary_string: innerInfo.salary_string,
  //             site: innerInfo.site,
  //             vehicleType: innerInfo.vehicleType,
  //             workPlace: innerInfo.workPlace,
  //             taskId: taskList[index].id,
  //             displayName: taskList[index].displayName,
  //             description: taskList[index].displayDescription,
  //             subtitle: taskList[index].displayDescription,
  //           };
  //         });
  //         setTaskData(newData);
  //       })
  //       .catch((err) => err /*console.log(err)*/);
  //   }
  // }, [taskList]);

  // React.useEffect(() => {
  //   if (!searchTerm) setVisibleTasks(taskList);
  //   if (searchTerm) {
  //     const filteredIds = checkPartialWordsInObjects(
  //       taskData,
  //       searchTerm,
  //       "taskId"
  //     );
  //     const filteredTasks = taskList.filter((task) =>
  //       filteredIds.includes(task.id)
  //     );
  //     setVisibleTasks(filteredTasks);
  //   }
  // }, [searchTerm]);

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
          {title} | {taskList.length} {config.hasMore && <PlusOutlined />}
        </Title>
      </Flex>

      <Flex
        vertical
        style={{ overflowY: "auto", height: "100%", padding: "0 5px 0 0" }}
        gap={"15px"}
        id={"scrollable_" + title.toLowerCase().replace(" ", "_")}
      >
        <InfiniteScroll
          dataLength={taskList.length}
          next={addData}
          hasMore={config.hasMore}
          loader={
            <Skeleton
              avatar
              paragraph={{
                rows: 1,
              }}
              active
            />
          }
          endMessage={<Divider plain>Fin de la lista 🤐</Divider>}
          scrollableTarget={
            "scrollable_" + title.toLowerCase().replace(" ", "_")
          }
        >
          {taskList.length ? (
            <List
              dataSource={taskList}
              renderItem={(task, index) => (
                <Flex style={{ paddingBottom: "1rem" }}>
                  <TaskCard
                    key={index}
                    task={task}
                    buttons={buttons}
                    updateList={updateList}
                    resume={resume}
                  />
                </Flex>
              )}
            />
          ) : null}
        </InfiniteScroll>

        {!taskList && <Spin fullscreen />}
      </Flex>
    </Flex>
  );
}
