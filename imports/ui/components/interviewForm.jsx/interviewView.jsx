import {
  Badge,
  Col,
  Descriptions,
  Flex,
  List,
  Row,
  Table,
  Tag,
  Typography,
} from "antd";
import React from "react";

function gimmeThaLinks(datastream, callback) {
  if (Object.keys(datastream).includes("links")) {
    const linksPromises = datastream.links.map(({ href }) =>
      Meteor.callAsync("get_link_data", { href })
    );
    Promise.all(linksPromises)
      .then((data) => callback(data[0]))
      .catch((error) => console.log(error));
  }
}

export default function InterviewView({ onClose, fileId, interviewForm }) {
  const { Title, Text } = Typography;
  const personalAnnotations = React.useRef();
  const tecnicalknowledge = React.useRef();
  const learningAdaptation = React.useRef();
  const tecnicalEvaluation = React.useRef();
  const finalConcept = React.useRef();
//TODO: imprimir PDF
  const [laboralExperience, setLaboralExperience] = React.useState([]);

  function BooleanTag({ tagValue }) {
    return (
      <Tag color={"purple"}>
        {tagValue
          ? tagValue == "si"
            ? "Si"
            : tagValue == "no"
            ? "No"
            : tagValue == "NA"
            ? "N/A"
            : "Si"
          : "No"}
      </Tag>
    );
  }
  function mediaValues(values) {
    let total = 0;
    values.forEach((value) => {
      total += parseInt(value);
    });
    // (total = total + aspect.value));
    return (total / values.length).toFixed(1);
  }

  React.useLayoutEffect(() => {
    if(personalAnnotations &&
      tecnicalknowledge &&
      learningAdaptation &&
      tecnicalEvaluation &&
      finalConcept){
      personalAnnotations.current.innerHTML = interviewForm.personalAnnotation;
      tecnicalknowledge.current.innerHTML = interviewForm.tecnicalknowledge;
      learningAdaptation.current.innerHTML = interviewForm.learningAdaptation;
      tecnicalEvaluation.current.innerHTML = interviewForm.tecnicalEvaluation;
      finalConcept.current.innerHTML = interviewForm.finalConcept;
    }

    setLaboralExperience(
      interviewForm.laboralExperience.map((labExp, index) => ({
        ...labExp,
        key: index,
      }))
    );
  }, [
    personalAnnotations,
    tecnicalknowledge,
    learningAdaptation,
    tecnicalEvaluation,
    finalConcept,
  ]);

  const whiteStyle = {
    labelStyle: { background: "whitesmoke" },
    contentStyle: { background: "white" },
  };
  const softStyle = {
    labelStyle: { background: "#F6F6F6" },
    contentStyle: { background: "white" },
  };

  const generalities = [
    {
      key: "1",
      label: "Documento",
      children: interviewForm.id,
      span: 1,
    },
    {
      key: "2",
      label: "Ciudad",
      children: interviewForm.city,
      span: 2,
    },
    {
      key: "3",
      label: "Telefono",
      children: interviewForm.phone,
      span: 1,
    },
    {
      key: "4",
      label: "Cargo aspirado",
      children: interviewForm.expectedPosition,
      span: 2,
    },
    {
      key: "5",
      label: "Tipo de postulación",
      children: interviewForm.applicationType,
      span: 4,
    },
    {
      key: "8",
      label: "Aspiración salarial",
      children: interviewForm.salaryGoal,
      span: 1,
    },
    {
      key: "7",
      label: "Estado civil",
      children: interviewForm.status,
      span: 1,
    },
    {
      key: "6",
      label: "Edad",
      children: interviewForm.age,
      span: 1,
    },
    {
      key: "9",
      label: "Lugar de residencia",
      children: interviewForm.residence,
      span: 3,
    },
    {
      key: "9",
      label: "Talla pantalón",
      children: interviewForm.sizePants,
      span: 1,
    },
    {
      key: "9",
      label: "Talla camisa",
      children: interviewForm.sizeShirt,
      span: 1,
    },
    {
      key: "9",
      label: "Talla zapatos",
      children: interviewForm.sizeShoes,
      span: 1,
    },
  ];
  const laboredBefore = [
    {
      key: "1",
      label: "Fecha de retiro",
      children: interviewForm.retirementDate,
      span: 2,
    },
    {
      key: "2",
      label: "Motivo de retiro",
      children: interviewForm.retirementMotive,
      span: 2,
    },
  ];
  const asociatedBefore = [
    {
      key: "1",
      label: "Empresa",
      children: interviewForm.aboutBusinessName,
      span: 2,
    },
    {
      key: "2",
      label: "Motivo de retiro",
      children: interviewForm.aboutBusinessMotive,
      span: 2,
    },
    {
      key: "3",
      label: "Jefe inmediato",
      children: interviewForm.aboutBusinessBoss,
      span: 2,
    },
  ];
  const family = [
    {
      key: "1",
      label: "Familiar",
      children: interviewForm.kinName,
      span: 2,
    },
    {
      key: "2",
      label: "Parentezco",
      children: interviewForm.kinship,
      span: 2,
    },
  ];
  const academicInfo = [
    {
      key: "1",
      label: "Nivel academico",
      children: interviewForm.academicLevel.toUpperCase(),
      span: 1,
    },
    {
      key: "2",
      label: "Título obtenido",
      children: interviewForm.grade,
      span: 2,
    },
    {
      key: "3",
      label: "Estudios complementarios",
      children: (
        <List
          dataSource={interviewForm.study}
          renderItem={(item) => (
            <List.Item>
              <Badge status="processing" />
              {`  ${item}`}
            </List.Item>
          )}
        />
      ),
      span: 3,
    },
    {
      key: "4",
      label: "Sistemas/software que conoce",
      children: (
        <List
          dataSource={interviewForm.systemKnown}
          renderItem={(item) => (
            <List.Item>
              <Badge status="processing" />
              {`  ${item}`}
            </List.Item>
          )}
        />
      ),
      span: 3,
    },
  ];

  const experienceColumns = [
    {
      title: "Empresa",
      dataIndex: "companyName",
      key: "companyName",
    },
    {
      title: "Cargo desempeñado",
      dataIndex: "laboredPosition",
      key: "laboredPosition",
    },
    {
      title: "Tiempo laborado",
      dataIndex: "companyTime",
      key: "companyTime",
      render: (companyTime) =>
        `${companyTime.cuantity} ${companyTime.timePart}`,
    },
    {
      title: "Motivo de retiro",
      dataIndex: "dismissMotive",
      key: "dismissMotive",
    },
  ];

  const movility = [
    {
      key: "1",
      label: "¿Cuenta con moto o vehiculo?",
      children: <BooleanTag tagValue={interviewForm.isVehicle} />,
      span: 2,
    },
    {
      key: "2",
      label: "¿Cuenta con licencia vigente?",
      children: <BooleanTag tagValue={interviewForm.isLicence} />,
      span: 2,
    },
    {
      key: "3",
      label: "Su vehiculo cuenta con documentos al día?",
      children: <BooleanTag tagValue={interviewForm.isValidDocuments} />,
      span: 2,
    },
    {
      key: "4",
      label: "Placa del vehiculo",
      children: interviewForm.vechiclePlate,
      span: 2,
    },
    {
      key: "5",
      label: "Nombre del propietario",
      children: interviewForm.vehicle_owner_name,
      span: 3,
    },
    {
      key: "6",
      label: "'Cumple con licencia?",
      children: <BooleanTag tagValue={interviewForm.isValidLicence} />,
      span: 2,
    },
    {
      key: "7",
      label: "¿Cumple con SOAT?",
      children: <BooleanTag tagValue={interviewForm.isSOAT} />,
      span: 2,
    },
    {
      key: "8",
      label: "¿Cumple tecnomecánica?",
      children: <BooleanTag tagValue={interviewForm.isTecnomecanica} />,
      span: 2,
    },
    {
      key: "9",
      label: "¿Aprobado revision vial?",
      children: <BooleanTag tagValue={interviewForm.revisionVial} />,
      span: 2,
    },
  ];

  const competences = [
    {
      key: "1",
      label: "Sensibilidad a lineamientos (Integridad)",
      children: interviewForm.isEvaluationSensibility,
      span: 3,
    },
    {
      key: "2",
      label: "Enfoque a resultados",
      children: interviewForm.isEvaluationFocus,
      span: 3,
    },
    {
      key: "3",
      label: "Control de actividades",
      children: interviewForm.isEvaluationControl,
      span: 3,
    },
    {
      key: "4",
      label: "Orientación al servicio",
      children: interviewForm.isEvaluationOrientation,
      span: 3,
    },
    {
      key: "5",
      label: "Aprendizaje",
      children: interviewForm.isEvaluationLearning,
      span: 3,
    },
  ];
  const perfil = [
    {
      key: "6",
      label: "Académico requerido",
      children: interviewForm.requiredAcademic,
      span: 3,
    },
    {
      key: "7",
      label: "Experiencia requerida",
      children: interviewForm.requiredExperience,
      span: 3,
    },
    {
      key: "8",
      label: "Competencias requeridas",
      children: interviewForm.requiredCompetences,
      span: 3,
    },
    {
      key: "9",
      label: "NIVEL TOTAL AJUSTE AL PERFIL:    ",
      children: mediaValues([
        interviewForm.requiredAcademic,
        interviewForm.requiredExperience,
        interviewForm.requiredCompetences,
      ]),
      span: 3,
    },
  ];

  return (
    <Row style={{ paddingLeft: "2%" }}>
      <Col xs={24} md={20} lg={18}>
        <Descriptions
          title="Generalidades"
          items={generalities}
          bordered
          size="small"
        />
        <Row
          style={{
            padding: "16px",
            background: "#aed4e8",
            borderRadius: "10px",
            marginTop: "20px",
          }}
          gutter={["5px", "15px"]}
        >
          {!interviewForm.previousEmployee && (
            <Col
              xs={24}
              sm={12}
              md={8}
              style={{ display: "flex", justifyContent: "center" }}
            >
              <Tag color="success" style={{ width: "90%" }}>
                <h4 style={{ textAlign: "center" }}>
                  No ha laborado en Discol
                </h4>
              </Tag>
            </Col>
          )}
          {!interviewForm.aboutBusiness && (
            <Col
              xs={24}
              sm={12}
              md={8}
              style={{ display: "flex", justifyContent: "center" }}
            >
              <Tag color="success" style={{ width: "90%" }}>
                <h4 style={{ textAlign: "center" }}>No empresas asociadas</h4>
              </Tag>
            </Col>
          )}
          {!interviewForm.isAboutFamily && (
            <Col
              xs={24}
              sm={12}
              md={8}
              style={{ display: "flex", justifyContent: "center" }}
            >
              <Tag color="success" style={{ width: "90%" }}>
                <h4 style={{ textAlign: "center" }}>
                  Sin familiares en discol
                </h4>
              </Tag>
            </Col>
          )}
          <Col span={24}>
            {interviewForm.previousEmployee && (
              <Descriptions
                {...whiteStyle}
                labelStyle={{ background: "white" }}
                title="Laboró en discol"
                items={laboredBefore}
                bordered
                size="small"
              />
            )}
            {interviewForm.aboutBusiness && (
              <Descriptions
                {...whiteStyle}
                title="Laboró en empresa vinculada"
                items={asociatedBefore}
                bordered
                size="small"
              />
            )}
            {interviewForm.isAboutFamily && (
              <Descriptions
                {...whiteStyle}
                title="Familiar en Discol"
                items={family}
                bordered
                size="small"
              />
            )}
          </Col>
        </Row>

        <Flex vertical>
          <Title level={5}>Información personal/familiar</Title>
          <Flex align="center">
            <div
              ref={personalAnnotations}
              style={{
                width: "96%",
                padding: "10px",
                border: "2px solid #aed4e8",
                borderRadius: "10px",
                margin: "0 0 20px 0 ",
              }}
              id="personal-annotations"
            ></div>
          </Flex>
        </Flex>
        <Descriptions
          items={academicInfo}
          title="Información académica"
          bordered
          size="small"
        />
        <Flex vertical>
          <Title level={5}>Experiencia laboral</Title>
          <Table
            style={{ margin: "16px 0" }}
            columns={experienceColumns}
            dataSource={laboralExperience}
            pagination={false}
            bordered
          />
        </Flex>
        <Descriptions
          items={movility}
          title="Movilidad"
          bordered
          size="small"
        />
        <Row>
          <Col xs={24} sm={12} style={{ marginTop: "30px" }}>
            <Descriptions
              items={competences}
              title="Evaluación de competencias"
              bordered
              size="small"
            />
          </Col>
          <Col xs={24} sm={12} style={{ margin: "30px 0" }}>
            <Descriptions
              items={perfil}
              title="Nivel de ajuste al perfil"
              bordered
              size="small"
              contentStyle={{ textAlign: "end" }}
            />
          </Col>
        </Row>

        <Flex vertical>
          <Title level={4}>Evaluación lider de area/proyecto</Title>
          <Title level={5}>Conocimientos técnicos</Title>
          <Flex align="center">
            <div
              ref={tecnicalknowledge}
              style={{
                width: "96%",
                padding: "10px",
                border: "2px solid #aed4e8",
                borderRadius: "10px",
                margin: "0 0 20px 0 ",
              }}
              id="personal-annotations"
            ></div>
          </Flex>
        </Flex>
        <Flex vertical>
          <Title level={5}>Adaptación o aprendizaje frente al cargo</Title>
          <Flex align="center">
            <div
              ref={learningAdaptation}
              style={{
                width: "96%",
                padding: "10px",
                border: "2px solid #aed4e8",
                borderRadius: "10px",
                margin: "0 0 20px 0 ",
              }}
              id="personal-annotations"
            ></div>
          </Flex>
        </Flex>
        <Flex vertical>
          <Title level={5}>observaciones de evaluación técnica</Title>
          <Flex align="center">
            <div
              ref={tecnicalEvaluation}
              style={{
                width: "96%",
                padding: "10px",
                border: "2px solid #aed4e8",
                borderRadius: "10px",
                margin: "0 0 20px 0 ",
              }}
              id="personal-annotations"
            ></div>
          </Flex>
        </Flex>

        <Flex vertical>
          <Title level={4}>Concepto final de entrevista</Title>
          <Flex align="center">
            <div
              ref={finalConcept}
              style={{
                width: "96%",
                padding: "10px",
                border: "2px solid #aed4e8",
                borderRadius: "10px",
                margin: "0 0 20px 0 ",
              }}
              id="personal-annotations"
            ></div>
          </Flex>
        </Flex>
      </Col>
    </Row>
  );
}

    
    
    
