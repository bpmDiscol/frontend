import React from "react";
import { Col, Flex, Form, Input, Row, Select } from "antd";
import evaluationOptions from "../../pages/bpm/data/evaluation.json";
import competenceGradesConfig from "./competencesGradesConfig.json";
import competencesProfileAdj from "./competencesProfileAdj.json";

export default function CompetencesStep() {
  const [selectedGrades, setSelectedGrades] = React.useState(
    competenceGradesConfig
  );

  const [competenceAspects, setCompetenceAspects] = React.useState(
    competencesProfileAdj.aspects
  );

  const [mediaGrade, setMediaGrade] = React.useState();

  function isGradeBelowMin(grade, minGrade) {
    const gradeOrder = ["D", "C", "B", "A"];
    return gradeOrder.indexOf(grade) < gradeOrder.indexOf(minGrade);
  }

  function handleChangeSelector(newGrade, selector) {
    const minGrade = selectedGrades[selector].minGrade;
    const warning = isGradeBelowMin(newGrade, minGrade);

    const newGrades = {
      ...selectedGrades,
      [selector]: { ...selectedGrades[selector], value: newGrade, warning },
    };
    setSelectedGrades(newGrades);
  }

  function handleChangeRequirement(index, value) {
    const currentAspects = [...competenceAspects];
    currentAspects[index].value = parseInt(value);
    setCompetenceAspects(currentAspects);
  }

  function mediaValues() {
    let total = 0;
    competenceAspects.forEach((aspect) => {
      total += parseInt(document.getElementById(aspect.id)?.value)
    })
      // (total = total + aspect.value));
    return (total / competenceAspects.length).toFixed(1);
  }

  function isEspectedTotal() {
    return mediaValues() >= competencesProfileAdj.espectedTotal;
  }

  React.useEffect(() => {
    if (competenceAspects) setMediaGrade(mediaValues());
  }, [competenceAspects]);

  return (
    <Flex vertical gap={16} style={{ width: "75lvw" }}>
      <Row gutter={64}>
        <Col
          xs={22}
          sm={11}
          style={{
            background: "#67abe0",
            padding: "10px 0 10px 20px",
            borderRadius: "10px",
            margin: "0 0 32px 32px",
          }}
        >
          {Object.keys(selectedGrades).map((selector, index) => {
            return (
              <Form.Item
                key={index}
                label={selectedGrades[selector].label}
                rules={[
                  {
                    required: true,
                    message: "Por favor, selecciona una opción",
                  },
                ]}
                name={selector}
                hasFeedback
              >
                <Select
                  value={selectedGrades[selector].value}
                  onChange={(value) => handleChangeSelector(value, selector)}
                  options={evaluationOptions}
                  placeholder="Selecciona una opción"
                  status={
                    selectedGrades[selector].warning ? "warning" : undefined
                  }
                  variant="filled"
                  style={{ background: "white", borderRadius: "5px" }}
                  id={selector}
                />
              </Form.Item>
            );
          })}
        </Col>
        <Col xs={22} sm={11}>
          {competencesProfileAdj.aspects.map((aspect, index) => {
            return (
              <Form.Item
                key={index}
                label={aspect.label}
                name={aspect.id}
                rules={[
                  {
                    required: true,
                    message: "Por favor, introduce una calificación",
                  },
                ]}
              >
                <Input
                  placeholder="Inserta una calificación"
                  type="number"
                  id={aspect.id}
                  onChange={(e) =>
                    handleChangeRequirement(index, e.currentTarget.value)
                  }
                  value={competenceAspects[index].value}
                />
              </Form.Item>
            );
          })}
          <h3 style={{color: isEspectedTotal()? "green":"red"}}>NIVEL TOTAL AJUSTE AL PERFIL: {mediaGrade}</h3>
        </Col>
      </Row>
    </Flex>
  );
}
