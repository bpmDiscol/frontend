import React from "react";
import { useTracker } from "meteor/react-meteor-data";
import { requestEmployeeCollection } from "../../../api/requestEmployeData/requestEmployeeDataPublication";
import { Drawer, Flex, Table, Tag, Typography } from "antd";
import capitalize from "../../misc/capitalize";
import translate from "../../misc/translate.json";
import RequestDrawer from "./requestDrawer";
import getAvailablesValues from "./getAvailablesValues";

export default function RequestEmployeeSearch() {
  const { Column, ColumnGroup } = Table;
  const { Paragraph, Text } = Typography;

  const [drawerData, setDrawerData] = React.useState();

  const requestEmployeeData = useTracker(() => {
    Meteor.subscribe("requestEmployee");
    const requestCollection = requestEmployeeCollection.find().fetch();

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
    <div>
      <Flex>Campos de busqueda</Flex>
      <Flex vertical>
        <Table
          showSorterTooltip={false}
          dataSource={requestEmployeeData}
          bordered
          size="small"
          pagination={{
            position: ["topLeft"],
          }}
          scroll={{
            y: 440,
          }}
          rowKey={(record)=>record.caseId}
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
            width={100}
            filters={getAvailablesValues("status", requestEmployeeData)}
            filterMode="menu"
            onFilter={(value, record) => record.status.startsWith(value)}
            fixed="left"
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
            fixed="left"
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
            onFilter={(value, record) =>
              record.workingDayType.startsWith(value)
            }
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
          />
        </Table>
      </Flex>
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
    </div>
  );
}
