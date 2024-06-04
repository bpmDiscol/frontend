import { Col, Form, Input, Row, Select, Space, Spin, Switch } from "antd";
import React from "react";

const motiveOptions = [
  {
    label: "Nuevo cargo",
    value: "new-charge",
  },
  {
    label: "Aumento del personal",
    value: "upgrade",
  },
  {
    label: "Licencia",
    value: "licence",
  },
  {
    label: "Nuevo proyecto",
    value: "new-proyect",
  },
  {
    label: "Reemplazo",
    value: "replacement",
  },
  {
    label: "Incapacidad",
    value: "inhability",
  },
];

const timeOptions = [
  { label: "dia", value: "dia" },
  { label: "semana", value: "semana" },
  { label: "mes", value: "mes" },
  { label: "año", value: "año" },
];

const contractTypeOptions = [
  {
    label: "Obra o labor contratada",
    value: "labour",
  },
  {
    label: "Indefinido",
    value: "undefined",
  },
  {
    label: "Termino fijo",
    value: "fixed",
  },
  {
    label: "Aprendizaje",
    value: "learning",
  },
];

const workingDayOptions = [
  {
    label: "Tiempo completo",
    value: "full-time",
  },
  {
    label: "Medio completo",
    value: "mid-time",
  },
  {
    label: "Trabajo por dias",
    value: "day-time",
  },
];
export default function RequestGeneralities({ requestData, update, fiterErrors }) {
  const [isBonus, setIsBonus] = React.useState();

  React.useEffect(() => {
    if (requestData) setIsBonus(requestData?.isBonus);
  }, [requestData]);

  return (
    <Form>
      <Row gutter={32} style={{ padding: "10px 20px", width: "90%" }}>
        <Col span={12}>
          <Form.Item label="Puesto solicitado" >
            <Input
              id="companyPosition"
              status={fiterErrors('companyPosition')}
              defaultValue={requestData?.companyPosition}
              onChange={(e) => update("companyPosition", e.target.value)}
            />
          </Form.Item>

          <Form.Item label="Sede">
            <Input
              id="site"
              status={fiterErrors('site')}
              defaultValue={requestData?.site}
              onChange={(e) => update("site", e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Area/proyecto">
            <Input
              id="area_proyect"
              status={fiterErrors('area_proyect')}
              defaultValue={requestData?.area_proyect}
              onChange={(e) => update("area_proyect", e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Lugar de trabajo">
            <Input
              id="workPlace"
              status={fiterErrors('workPlace')}
              defaultValue={requestData?.workPlace}
              onChange={(e) => update("workPlace", e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Motivo del requerimiento">
            <Select
              id="motive"
              status={fiterErrors('motive')}
              defaultValue={requestData?.motive}
              options={motiveOptions}
              onChange={(value) => update("motive", value)}
            />
          </Form.Item>
          <Form.Item label='Duración' id='duration'>
          <Space.Compact>
                <Input
                  id="durationCuantity"
                  status={fiterErrors('duration')}
                  defaultValue={requestData?.duration?.cuantity||0}
                  type="number"
                  onChange={(e) =>
                    update("duration.cuantity", e.target.value)
                  }
                />
                <Select
                  options={timeOptions}
                  id="durationTimePart"
                  status={fiterErrors('duration')}
                  defaultValue={requestData?.duration?.timePart}
                  onChange={(value) =>
                    update("duration.timePart", value)
                  }
                />
              </Space.Compact>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Salario">
            <Input
              id="salary"
              status={fiterErrors('salary')}
              defaultValue={requestData?.salary||0}
              addonBefore="$"
              type="number"
              onChange={(e) => update("salary", e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Jornada laboral">
            <Select
              id="workingDayType"
              status={fiterErrors('workingDayType')}
              defaultValue={requestData?.workingDayType}
              options={workingDayOptions}
              onChange={(value) => update("workingDayType", value)}
            />
          </Form.Item>
          <Form.Item label="Tipo de contrato">
            <Select
              id="contractType"
              status={fiterErrors('contractType')}
              defaultValue={requestData?.contractType}
              onChange={(value) => update("contractType", value)}
              options={contractTypeOptions}
            />
          </Form.Item>
          <Space style={{ width: "100%", justifyContent: "space-around" }}>
            <Form.Item label="Dentro del manual de funciones">
              <Switch
                id="isHandbookFunction"
                checkedChildren="Si"
                unCheckedChildren="No"
                defaultValue={requestData?.isHandbookFunction}
                onChange={(value) => update("isHandbookFunction", value)}
              />
            </Form.Item>
            <Form.Item label="Bono salarial">
              <Switch
                id="isBonus"
                checked={isBonus}
                checkedChildren="Si"
                unCheckedChildren="No"
                style={{ margin: "0 5px" }}
                onChange={() => {
                  setIsBonus(!isBonus);
                  update("isBonus", !isBonus);
                }}
              />
            </Form.Item>
          </Space>
          <Form.Item style={{ width: "100&" }} id={"bonusesFrecuency"}>
            {isBonus && (
              <Space.Compact>
                <Input
                  addonBefore="Bono cada"
                  id="bonusesFrecuencyCuantity"
                  status={fiterErrors('bonusesFrecuency')}
                  defaultValue={requestData?.bonusesFrecuency?.cuantity||0}
                  type="number"
                  onChange={(e) =>
                    update("bonusesFrecuency.cuantity", e.target.value)
                  }
                />
                <Select
                  options={timeOptions}
                  id="bonusesFrecuencyTimePart"
                  status={fiterErrors('bonusesFrecuency')}
                  defaultValue={requestData?.bonusesFrecuency?.timePart}
                  onChange={(value) =>
                    update("bonusesFrecuency.timePart", value)
                  }
                />
              </Space.Compact>
            )}
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
}
