import React from "react";
import { useTracker } from "meteor/react-meteor-data";
import { requestEmployeeCollection } from "../../../api/requestEmployeData/requestEmployeeDataPublication";
import {
  Button,
  Drawer,
  Flex,
  Input,
  Space,
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
  SearchOutlined,
  SyncOutlined,
} from "@ant-design/icons";

export default function RequestEmployeeSearch() {
  const { Column } = Table;
  const { Text, Title } = Typography;
  const [drawerData, setDrawerData] = React.useState();
  const [searchTerm, setSearchTerm] = React.useState("");

  const requestEmployeeData = useTracker(() => {
    Meteor.subscribe("requestEmployee");
    const query = searchTerm
      ? { "interviewInput.id": { $regex: searchTerm, $options: "i" } }
      : {};
    const requestCollection = requestEmployeeCollection.find(query).fetch();
    return requestCollection.map((request, index) => {
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
        status: Object.keys(request).includes("sign_contract")
          ? "Finalizado"
          : "En proceso",
      };
    });
  });
  return (
    <Flex vertical align="center" style={{ width: "100%" }}>
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
              />
              <Button icon={<SearchOutlined />} />
            </Space.Compact>
          </Flex>
        )}
        showSorterTooltip={false}
        dataSource={requestEmployeeData}
        bordered
        size="small"
        pagination={{
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
          filters={getAvailablesValues("status", requestEmployeeData)}
          filterMode="menu"
          onFilter={(value, record) => record.status.startsWith(value)}
          fixed="left"
          render={(value) => (
            <Tag
              color={value === "Finalizado" ? "success" : "blue"}
              icon={
                value === "Finalizado" ? (
                  <CheckCircleOutlined />
                ) : (
                  <SyncOutlined spin />
                )
              }
            >
              {value}
            </Tag>
          )}
        />

        <Column
          title="Area"
          dataIndex={"area"}
          width={150}
          filters={getAvailablesValues("area", requestEmployeeData)}
          filterMode="menu"
          onFilter={(value, record) => record.area.startsWith(value)}
          fixed="left"
        />
        <Column
          title="Cargo solicitado"
          dataIndex={"place"}
          width={150}
          ellipsis
          filters={getAvailablesValues("place", requestEmployeeData)}
          filterMode="menu"
          filterSearch={true}
          onFilter={(value, record) => record.place.startsWith(value)}
        />
        <Column
          title="Lugar de trabajo"
          dataIndex={"localPlace"}
          width={150}
          filters={getAvailablesValues("localPlace", requestEmployeeData)}
          filterMode="menu"
          filterSearch={true}
          onFilter={(value, record) => record.localPlace.startsWith(value)}
        />
        <Column
          title="Vacantes"
          dataIndex={"places"}
          width={120}
          filters={getAvailablesValues("places", requestEmployeeData)}
          filterMode="menu"
          onFilter={(value, record) =>
            record.places.toString().startsWith(value)
          }
          sorter={(a, b) => a.places - b.places}
          defaultSortOrder="descend"
        />
        <Column
          title="Candidatos"
          dataIndex={"candidates"}
          width={120}
          filters={getAvailablesValues("candidates", requestEmployeeData)}
          filterMode="menu"
          onFilter={(value, record) =>
            record.candidates.toString().startsWith(value)
          }
          sorter={(a, b) => a.candidates - b.candidates}
        />
        <Column
          title="Jornada"
          dataIndex={"workingDayType"}
          width={150}
          filters={getAvailablesValues("workingDayType", requestEmployeeData)}
          filterMode="menu"
          filterSearch={true}
          onFilter={(value, record) => record.workingDayType.startsWith(value)}
        />
        <Column
          title="Contrato"
          dataIndex={"contractType"}
          width={150}
          filters={getAvailablesValues("contractType", requestEmployeeData)}
          filterMode="menu"
          filterSearch={true}
          onFilter={(value, record) => record.contractType.startsWith(value)}
        />
        <Column
          title="Duración"
          dataIndex={"duration"}
          width={100}
          filters={getAvailablesValues("duration", requestEmployeeData)}
          filterMode="menu"
          filterSearch={true}
          onFilter={(value, record) => record.duration.startsWith(value)}
        />

        <Column
          title="Motivo"
          dataIndex={"motive"}
          width={150}
          filters={getAvailablesValues("motive", requestEmployeeData)}
          filterMode="menu"
          filterSearch={true}
          onFilter={(value, record) => record.motive.startsWith(value)}
          render={(value) => (
            <Text style={{ width: "150px" }} ellipsis>
              {value}
            </Text>
          )}
        />

        <Column
          title="Inicio"
          dataIndex={"start"}
          width={230}
          sorter={(a, b) => a.start - b.start}
          defaultSortOrder="descend"
          render={(date) => new Date(date).toUTCString()}
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
                  color={
                    drawerData.status == "Finalizado" ? "success" : "processing"
                  }
                >
                  {drawerData.status}
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
