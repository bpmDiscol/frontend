import { Empty, Flex, Table, Tabs, Tag } from "antd";
import React from "react";
import getAvailablesValues from "./getAvailablesValues";
import translate from "../../misc/translate.json";
import capitalize from "../../misc/capitalize";
import CandidateData from "./candidateData";
import CandidateDocuments from "./candidateDocuments";
import Title from "antd/es/typography/Title";

export default function CandidateList({ requestEmployee }) {
  const [candidatesData, setCandidateData] = React.useState();
  const [selectedCandidate, setSelectedCandidate] = React.useState();
  const { Column } = Table;

  React.useEffect(() => {
    if (requestEmployee) {
      const candidatesData = requestEmployee?.curricullumsInput?.map(
        (request, index) => {
          let response = {
            name: capitalize(request.applicantName),
            lastNames: `${capitalize(request.applicantMidname)} ${capitalize(
              request.applicantLastname
            )}`,
            interviewId: request.fileId,
          };
          if (Object.keys(requestEmployee).includes("interviewInput")) {
            response = {
              ...response,

              id: requestEmployee?.interviewInput[index].id,
              email: requestEmployee.interviewInput[index].email,
              phone: requestEmployee.interviewInput[index].phone,
              residence: requestEmployee.interviewInput[index].residence,
              age: requestEmployee.interviewInput[index].age,
              applicationType:
                translate[
                  requestEmployee.interviewInput[index].applicationType
                ],
              selected: requestEmployee.interviewInput[index]?.selected
                ? "Seleccionado"
                : "No seleccionado",
              civilStatus:
                translate[requestEmployee.interviewInput[index]?.status],
              salaryGoal: requestEmployee.interviewInput[index]?.salaryGoal,
              finalSalary:
                requestEmployee.interviewInput[index]?.salary ||
                requestEmployee.salary,
              // subdata

              isAboutBussiness:
                requestEmployee.interviewInput[index]?.isAboutBussiness,
              aboutBusinessBoss:
                requestEmployee.interviewInput[index]?.aboutBusinessBoss,
              aboutBusinessMotive:
                requestEmployee.interviewInput[index]?.aboutBusinessMotive,
              aboutBusinessName:
                requestEmployee.interviewInput[index]?.aboutBusinessName,

              isAboutFamily:
                requestEmployee.interviewInput[index]?.isAboutFamily,
              kinName: requestEmployee.interviewInput[index]?.kinName,
              kinship: requestEmployee.interviewInput[index]?.kinship,

              isPreviusEmployee:
                requestEmployee.interviewInput[index]?.isPreviusEmployee,
              retirementDate:
                requestEmployee.interviewInput[index]?.retirementDate,
              retirementMotive:
                requestEmployee.interviewInput[index]?.retirementMotive,

              personalAnnotation:
                requestEmployee.interviewInput[index]?.personalAnnotation,

              academicLevel:
                requestEmployee.interviewInput[index]?.academicLevel,
              grade: requestEmployee.interviewInput[index]?.grade,
              study: requestEmployee.interviewInput[index]?.study,
              systemKnown: requestEmployee.interviewInput[index]?.systemKnown,

              sizeShirt: requestEmployee.interviewInput[index]?.sizeShirt,
              sizeShoes: requestEmployee.interviewInput[index]?.sizeShoes,
              sizePants: requestEmployee.interviewInput[index]?.sizePants,

              laboralExperience:
                requestEmployee.interviewInput[index]?.laboralExperience,

              isVehicle: requestEmployee.interviewInput[index]?.isVehicle,
              isValidLicence:
                requestEmployee.interviewInput[index]?.isValidLicence,
              isValidDocuments:
                requestEmployee.interviewInput[index]?.isValidDocuments,
              vechiclePlate:
                requestEmployee.interviewInput[index]?.vechiclePlate,
              vehicle_owner_id:
                requestEmployee.interviewInput[index]?.vehicle_owner_id,
              vehicle_owner_name:
                requestEmployee.interviewInput[index]?.vehicle_owner_name,

              isLicence: requestEmployee.interviewInput[index]?.isLicence,
              isSOAT: requestEmployee.interviewInput[index]?.isSOAT,
              isTecnomecanica:
                requestEmployee.interviewInput[index]?.isTecnomecanica,

              isEvaluationControl:
                requestEmployee.interviewInput[index]?.isEvaluationControl,
              isEvaluationFocus:
                requestEmployee.interviewInput[index]?.isEvaluationFocus,
              isEvaluationLearning:
                requestEmployee.interviewInput[index]?.isEvaluationLearning,
              isEvaluationOrientation:
                requestEmployee.interviewInput[index]?.isEvaluationOrientation,
              isEvaluationSensibility:
                requestEmployee.interviewInput[index]?.isEvaluationSensibility,

              requiredAcademic:
                requestEmployee.interviewInput[index]?.requiredAcademic,
              requiredCompetences:
                requestEmployee.interviewInput[index]?.requiredCompetences,
              requiredExperience:
                requestEmployee.interviewInput[index]?.requiredExperience,

              tecnicalknowledge:
                requestEmployee.interviewInput[index]?.tecnicalknowledge,
              learningAdaptation:
                requestEmployee.interviewInput[index]?.learningAdaptation,
              tecnicalEvaluation:
                requestEmployee.interviewInput[index]?.tecnicalEvaluation,
              finalConcept: requestEmployee.interviewInput[index]?.finalConcept,
            };
          }
          return response;
        }
      );
      setCandidateData(candidatesData);
    }
  }, [requestEmployee]);

  const tabs = [
    {
      key: 1,
      label: `Entrevista`,
      children: <CandidateData data={selectedCandidate} />,
    },
    {
      key: 2,
      label: `Documentos`,
      children: (
        <CandidateDocuments
          id={selectedCandidate?.interviewId}
          backgrounds={requestEmployee?.backgoundsInput}
          cvFiles={requestEmployee?.cvFilesInput}
        />
      ),
    },
  ];

  return (
    <Flex vertical>
      <Flex justify="center" style={{ height: "30dvh", border: "1px solid" }}>
        {!candidatesData && (
          <Empty
            description="Aún sin candidatos"
            image="/empty-box.png"
            style={{ marginTop: "5dvh" }}
          />
        )}
        {candidatesData && (
          <Table
            bordered
            dataSource={candidatesData}
            size="small"
            pagination={
              candidatesData.length > 5
                ? {
                    position: ["topLeft"],
                    pageSize: 5,
                  }
                : false
            }
            scroll={{
              y: 440,
              x: 100,
            }}
            rowKey={(record) => record.interviewId}
            onRow={(record) => {
              return {
                onClick: () => setSelectedCandidate(record),
                onMouseEnter: (event) =>
                  (event.currentTarget.style.cursor = "pointer"),
              };
            }}
          >
            <Column
              title="Estado"
              dataIndex={"selected"}
              width={100}
              filters={getAvailablesValues("selected", candidatesData)}
              filterMode="menu"
              fixed="left"
              align="center"
              render={(value) => (
                <Tag
                  style={{ fontSize: "10px" }}
                  color={value === "Seleccionado" ? "success" : "error"}
                >
                  {value || "Para entrevista"}
                </Tag>
              )}
            />
            <Column
              title="Nombre"
              dataIndex={"name"}
              width={100}
              filters={getAvailablesValues("name", candidatesData)}
              filterMode="menu"
              onFilter={(value, record) => record.name.startsWith(value)}
              fixed="left"
              elipsis
            />
            <Column
              title="Apellidos"
              dataIndex={"lastNames"}
              width={180}
              filters={getAvailablesValues("lastNames", candidatesData)}
              filterMode="menu"
              onFilter={(value, record) => record.lastNames.startsWith(value)}
              fixed="left"
              elipsis
            />
            <Column
              title="Identificación"
              dataIndex={"id"}
              width={100}
              filters={getAvailablesValues("id", candidatesData)}
              filterMode="menu"
              onFilter={(value, record) => record.id.startsWith(value)}
            />
            <Column
              title="Email"
              dataIndex={"email"}
              width={180}
              filters={getAvailablesValues("email", candidatesData)}
              filterMode="menu"
              onFilter={(value, record) => record.email.startsWith(value)}
              elipsis
            />
            <Column
              title="Teléfono"
              dataIndex={"phone"}
              width={120}
              filters={getAvailablesValues("phone", candidatesData)}
              filterMode="menu"
              onFilter={(value, record) => record.phone.startsWith(value)}
              elipsis
            />

            <Column
              title="Residencia"
              dataIndex={"residence"}
              width={100}
              filters={getAvailablesValues("residence", candidatesData)}
              filterMode="menu"
              onFilter={(value, record) => record.residence.startsWith(value)}
              elipsis
            />
            <Column
              title="Edad"
              dataIndex={"age"}
              width={70}
              filterMode="menu"
              elipsis
              sorter={(a, b) => a.places - b.places}
            />
            <Column
              title="Estado civil"
              dataIndex={"civilStatus"}
              width={100}
              filters={getAvailablesValues("civilStatus", candidatesData)}
              filterMode="menu"
              onFilter={(value, record) => record.civilStatus.startsWith(value)}
              elipsis
            />
            <Column
              title="Aspiración salarial"
              dataIndex={"salaryGoal"}
              width={120}
              filters={getAvailablesValues("salaryGoal", candidatesData)}
              filterMode="menu"
              onFilter={(value, record) => record.salaryGoal.startsWith(value)}
              elipsis
            />
            <Column
              title="Corrección salarial"
              dataIndex={"finalSalary"}
              width={120}
              filters={getAvailablesValues("finalSalary", candidatesData)}
              filterMode="menu"
              onFilter={(value, record) => record.finalSalary.startsWith(value)}
              elipsis
            />
            <Column
              title="Tipo de aplicación"
              dataIndex={"applicationType"}
              width={100}
              filters={getAvailablesValues("applicationType", candidatesData)}
              filterMode="menu"
              onFilter={(value, record) =>
                record.applicationType.startsWith(value)
              }
              elipsis
            />
          </Table>
        )}
      </Flex>
      {selectedCandidate && (
        <Flex vertical>
          <Title level={3}>
            {selectedCandidate.name} {selectedCandidate.lastNames}
          </Title>

          <Tabs style={{ width: "100%" }} items={tabs} />
        </Flex>
      )}
    </Flex>
  );
}
