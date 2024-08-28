import React from "react";
import { useTracker } from "meteor/react-meteor-data";
import { requestEmployeeCollection } from "../../../api/requestEmployeData/requestEmployeeDataPublication";
import {
  Button,
  Drawer,
  Flex,
  Input,
  Space,
  Spin,
  Table,
  Tag,
  Typography,
} from "antd";
import capitalize from "../../misc/capitalize";
import translate from "../../misc/translate.json";
import RequestDrawer from "./requestDrawer";
import getAvailablesValues from "./getAvailablesValues";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  SearchOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import moment from "moment";

export default function RequestEmployeeSearch() {
  const { Column } = Table;
  const { Text, Title } = Typography;
  const [drawerData, setDrawerData] = React.useState();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [requestEmployeeData, setRequestEmployeeData] = React.useState();
  const [pagination, setPagination] = React.useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  async function fetchData(page, pageSize) {
    setLoading(true);
    const query = {};
    if (searchTerm)
      query["interviewInput.id"] = { $regex: searchTerm, $options: "i" };

    if (
      Meteor.user().profile.memberships.filter(
        (ms) =>
          JSON.stringify(ms) === JSON.stringify(["lider", "Gestion_Humana"])
      )
    )
      query["requestEmployeeDataInput.approvedHHRR"] = { $exists: true };

    await Meteor.call(
      "paginateRequestEmployee",
      query,
      page,
      pageSize,
      (err, resp) => {
        if (err) {
          console.log(err);
          return;
        }

        const request = resp?.data?.map((request, index) => {
          const duration = `${request.requestEmployeeDataInput.duration.cuantity} ${request.requestEmployeeDataInput.duration.timePart}`;

          return {
            index,
            start: request.createdAt,
            area: capitalize(request.requestEmployeeDataInput.area_proyect),
            place: capitalize(request.requestEmployeeDataInput.companyPosition),
            localPlace: capitalize(request.requestEmployeeDataInput.workPlace),
            places: request.requestEmployeeDataInput.vacancies,
            candidates: request?.curricullumsInput?.length || 0,
            duration: duration === "-1 mes" ? "N/A" : duration,
            contractType: translate[request.contractType],
            workingDayType: translate[request.workingDayType],
            motive: translate[request.motive],
            caseId: request.caseId,
            status: getStatus(request),
            approvedHHRR: request.requestEmployeeDataInput.approvedHHRR,
          };
        });
        // .filter((request) => request.approvedHHRR);

        setRequestEmployeeData(request);
        setPagination({
          ...pagination,
          current: page,
          total: resp.total,
        });
        setLoading(false);
      }
    );
  }

  React.useEffect(() => {
    fetchData(1, pagination.pageSize);
  }, [searchTerm]);

  const handleTableChange = (pagination) => {
    fetchData(pagination.current, pagination.pageSize);
  };

  function getStatus(request) {
    if (
      request.responseDirector === "reject" ||
      request.responseHHRR === "reject"
    )
      return { finished: true, color: "red" };

    if (request.sign_contract) return { finished: true, color: "success" };

    return { finished: false, color: "blue" };
  }

  return (
    <Flex vertical align="center" style={{ width: "100%" }}>
      <Spin spinning={loading} fullscreen />
      <Table
        title={() => (
          <Flex justify="space-between" align="center">
            <Title level={3}>Estado de contrataciones</Title>
            <Space.Compact>
              <Input
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.currentTarget.value)}
                placeholder="Buscar una cédula"
                onKeyDown={(input) => {
                  if (input.key == "Enter") fetchData(1, pagination.pageSize);
                }}
              />
              <Button
                onClick={() => fetchData(1, pagination.pageSize)}
                icon={<SearchOutlined />}
              />
            </Space.Compact>
          </Flex>
        )}
        onChange={handleTableChange}
        showSorterTooltip={false}
        dataSource={requestEmployeeData}
        bordered
        size="small"
        pagination={{
          ...pagination,
          position: ["bottomLeft"],
        }}
        scroll={{
          y: 440,
          x: 100,
        }}
        rowKey={(record) => record.caseId}
        onRow={(record) => {
          return {
            onClick: () => setDrawerData(record),
            onMouseEnter: (event) =>
              (event.currentTarget.style.cursor = "pointer"),
          };
        }}
      >
        <Column
          title="Estado"
          dataIndex={"status"}
          width={110}
          // filters={getAvailablesValues("status", requestEmployeeData)}
          // filterMode="menu"
          // onFilter={(value, record) => record.status.startsWith(value)}
          fixed="left"
          render={({ finished, color }) => (
            <Tag
              color={color}
              icon={
                finished ? (
                  color === "red" ? (
                    <CloseCircleOutlined />
                  ) : (
                    <CheckCircleOutlined />
                  )
                ) : (
                  <SyncOutlined spin />
                )
              }
            >
              {finished
                ? color === "red"
                  ? "Rechazado"
                  : "Finalizado"
                : "En proceso"}
            </Tag>
          )}
        />

        <Column
          title="Area"
          dataIndex={"area"}
          width={150}
          // filters={getAvailablesValues("area", requestEmployeeData)}
          // filterMode="menu"
          // onFilter={(value, record) => record.area.startsWith(value)}
          fixed="left"
        />
        <Column
          title="Cargo solicitado"
          dataIndex={"place"}
          width={150}
          ellipsis
          // filters={getAvailablesValues("place", requestEmployeeData)}
          // filterMode="menu"
          // filterSearch={true}
          // onFilter={(value, record) => record.place.startsWith(value)}
        />
        <Column
          title="Lugar de trabajo"
          dataIndex={"localPlace"}
          width={150}
          // filters={getAvailablesValues("localPlace", requestEmployeeData)}
          // filterMode="menu"
          // filterSearch={true}
          // onFilter={(value, record) => record.localPlace.startsWith(value)}
        />
        <Column
          title="Vacantes"
          dataIndex={"places"}
          width={120}
          // filters={getAvailablesValues("places", requestEmployeeData)}
          // filterMode="menu"
          // onFilter={(value, record) =>
          //   record.places.toString().startsWith(value)
          // }
          // sorter={(a, b) => a.places - b.places}
          // defaultSortOrder="descend"
        />
        <Column
          title="Candidatos"
          dataIndex={"candidates"}
          width={120}
          // filters={getAvailablesValues("candidates", requestEmployeeData)}
          // filterMode="menu"
          // onFilter={(value, record) =>
          //   record.candidates.toString().startsWith(value)
          // }
          // sorter={(a, b) => a.candidates - b.candidates}
        />
        <Column
          title="Jornada"
          dataIndex={"workingDayType"}
          width={150}
          // filters={getAvailablesValues("workingDayType", requestEmployeeData)}
          // filterMode="menu"
          // filterSearch={true}
          // onFilter={(value, record) => record.workingDayType.startsWith(value)}
        />
        <Column
          title="Contrato"
          dataIndex={"contractType"}
          width={150}
          // filters={getAvailablesValues("contractType", requestEmployeeData)}
          // filterMode="menu"
          // filterSearch={true}
          // onFilter={(value, record) => record.contractType.startsWith(value)}
        />
        <Column
          title="Duración"
          dataIndex={"duration"}
          width={100}
          // filters={getAvailablesValues("duration", requestEmployeeData)}
          // filterMode="menu"
          // filterSearch={true}
          // onFilter={(value, record) => record.duration.startsWith(value)}
        />

        <Column
          title="Motivo"
          dataIndex={"motive"}
          width={150}
          // filters={getAvailablesValues("motive", requestEmployeeData)}
          // filterMode="menu"
          // filterSearch={true}
          // onFilter={(value, record) => record.motive.startsWith(value)}
          render={(value) => (
            <Text style={{ width: "150px" }} ellipsis>
              {value}
            </Text>
          )}
        />

        <Column
          title="Inicio"
          dataIndex={"start"}
          width={130}
          // sorter={(a, b) => a.start - b.start}
          // defaultSortOrder="descend"
          render={(date) => moment(date).format("DD/MM/YYYY")}
          fixed="right"
        />

        <Column
          title="Visto"
          dataIndex={"approvedHHRR"}
          width={130}
          // sorter={(a, b) => a.start - b.start}
          // defaultSortOrder="descend"
          render={(date) =>
            date ? moment(date[0]).format("DD/MM/YYYY") : "No registrado"
          }
          fixed="right"
        />
      </Table>
      {drawerData && (
        <Drawer
          title={
            (
              <Text>
                {`${drawerData?.place} [${drawerData?.area}]`}{" "}
                <Tag
                  color={drawerData?.status?.color}
                  icon={
                    drawerData?.status.finished ? (
                      drawerData?.status.color === "red" ? (
                        <CloseCircleOutlined />
                      ) : (
                        <CheckCircleOutlined />
                      )
                    ) : (
                      <SyncOutlined spin />
                    )
                  }
                >
                  {drawerData?.status.finished
                    ? drawerData?.status.color === "red"
                      ? "Rechazado"
                      : "Finalizado"
                    : "En proceso"}
                </Tag>
              </Text>
            ) || ""
          }
          width={"60lvw"}
          open={drawerData}
          onClose={() => setDrawerData(null)}
          styles={{
            body: {
              paddingTop: "1lvh",
            },
          }}
        >
          <RequestDrawer drawerData={drawerData} />
        </Drawer>
      )}
    </Flex>
  );
}
