import React from "react";
import {
  Col,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Space,
  Switch,
} from "antd";

import siteOptions from "../data/sites.json";
import areaProyectOptions from "../data/area.json";
import workPlaceOptions from "../data/municipios.json";
import motiveOptions from "../data/motives.json";
import timeOptions from "../data/time.json";
import contractTypeOptions from "../data/contractType.json";
import workingDayOptions from "../data/workingDay.json";

export default function RequestGeneralities({
  requestData,
  update,
  fiterErrors,
}) {
  const [isBonus, setIsBonus] = React.useState();
  const [isUndefinedTermContract, setUndefinedTerm] = React.useState(false);
  const [area, setArea] = React.useState();

  React.useEffect(() => {
    if (requestData) {
      setUndefinedTerm(requestData?.contractType === "undefined");
      setIsBonus(requestData?.isBonus);
    }
  }, [requestData]);

  async function getMyAreaOptions() {
    const memberships = await Meteor.callAsync("get_my_memberships")
      .then((resp) => resp)
      .catch(() => []);
    if (memberships?.length) {
      if (memberships.flat(1).includes("director")) return areaProyectOptions;
      const flatMemberships = memberships.flat(1);
      return flatMemberships
        .filter((item, index) => flatMemberships.indexOf(item) === index)
        .filter((item) => !["Lider", "member", "digitador"].includes(item))
        .map((group) => {
          return {
            label: group.replace(/_/g, " "),
            value: group.replace(/_/g, " "),
          };
        });
    }
  }

  React.useEffect(() => {
    getMyAreaOptions().then((resp) => setArea(resp));
  }, []);

  return (
    <Form>
      <Row gutter={32} style={{ padding: "10px 20px", width: "90%" }}>
        <Col span={12}>
          <Form.Item label="Vacantes" hasFeedback>
            <InputNumber
              stringMode
              inputMode="numeric"
              type="number"
              id="vacancies"
              status={fiterErrors("vacancies")}
              defaultValue={parseInt(requestData?.vacancies)}
              onChange={(value) => update("vacancies", value)}
              min={0}
              max={100}
            />
          </Form.Item>
          <Form.Item label="Puesto solicitado" hasFeedback>
            <Input
              id="companyPosition"
              status={fiterErrors("companyPosition")}
              defaultValue={requestData?.companyPosition}
              onChange={(e) => update("companyPosition", e.target.value)}
            />
          </Form.Item>

          <Form.Item label="Sede" hasFeedback>
            <Select
              id="site"
              status={fiterErrors("site")}
              defaultValue={requestData?.site}
              options={siteOptions}
              onChange={(value) => update("site", value)}
            />
          </Form.Item>
          <Form.Item label="Area/proyecto">
            <Select
              loading={!area}
              id="area_proyect"
              status={fiterErrors("area_proyect")}
              options={area}
              onChange={(value) => update("area_proyect", value)}
            />
          </Form.Item>
          <Form.Item label="Lugar de trabajo">
            <Select
              id="workPlace"
              status={fiterErrors("workPlace")}
              defaultValue={requestData?.workPlace}
              options={workPlaceOptions}
              onChange={(value) => update("workPlace", value)}
            />
          </Form.Item>
          <Form.Item label="Motivo de la solicitud">
            <Select
              id="motive"
              status={fiterErrors("motive")}
              defaultValue={requestData?.motive}
              options={motiveOptions}
              onChange={(value) => update("motive", value)}
            />
          </Form.Item>
          <Form.Item label="Dentro del manual de funciones">
            <Switch
              id="isHandbookFunction"
              checkedChildren="Si"
              unCheckedChildren="No"
              defaultValue={requestData?.isHandbookFunction}
              onChange={(value) => update("isHandbookFunction", value)}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Salario" name={"salary"}>
            <InputNumber
              stringMode
              type="number"
              min={1}
              id="salary"
              status={fiterErrors("salary")}
              defaultValue={parseInt(requestData?.salary) || 0}
              addonBefore="$"
              onChange={(value) => update("salary", value)}
            />
          </Form.Item>
          <Form.Item label="Jornada laboral">
            <Select
              id="workingDayType"
              status={fiterErrors("workingDayType")}
              defaultValue={requestData?.workingDayType}
              options={workingDayOptions}
              onChange={(value) => update("workingDayType", value)}
            />
          </Form.Item>
          <Form.Item label="Tipo de contrato">
            <Select
              id="contractType"
              status={fiterErrors("contractType")}
              defaultValue={requestData?.contractType}
              onChange={(value) => {
                setUndefinedTerm(value === "undefined");
                update("contractType", value);
              }}
              options={contractTypeOptions}
            />
          </Form.Item>
          {!isUndefinedTermContract && (
            <Form.Item label="Duración" id="duration">
              <Space.Compact style={{ width: "100%" }}>
                <Input
                  id="durationCuantity"
                  status={fiterErrors("duration")}
                  defaultValue={requestData?.duration?.cuantity || 0}
                  type="number"
                  onChange={(e) => update("duration.cuantity", e.target.value)}
                />
                
                <Select
                  options={timeOptions}
                  id="durationTimePart"
                  status={fiterErrors("duration")}
                  defaultValue={requestData?.duration?.timePart}
                  onChange={(value) => update("duration.timePart", value)}
                />
              </Space.Compact>
            </Form.Item>
          )}
          <Space>
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
          {isBonus && (
            <Form.Item
              label="Bono cada"
              style={{ width: "100&" }}
              id={"bonusesFrecuency"}
            >
              <Space.Compact style={{ width: "100%" }}>
                <Input
                  id="bonusesFrecuencyCuantity"
                  status={fiterErrors("bonusesFrecuency")}
                  defaultValue={requestData?.bonusesFrecuency?.cuantity || 0}
                  type="number"
                  onChange={(e) =>
                    update("bonusesFrecuency.cuantity", e.target.value)
                  }
                />
                <Select
                  options={timeOptions}
                  id="bonusesFrecuencyTimePart"
                  status={fiterErrors("bonusesFrecuency")}
                  defaultValue={requestData?.bonusesFrecuency?.timePart}
                  onChange={(value) =>
                    update("bonusesFrecuency.timePart", value)
                  }
                />
              </Space.Compact>
            </Form.Item>
          )}
        </Col>
      </Row>
    </Form>
  );
}
