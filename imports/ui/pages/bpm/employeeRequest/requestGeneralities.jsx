import React from "react";
import {
  Col,
  Dropdown,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Space,
  Switch,
} from "antd";

import siteOptions from "../data/sites.json";
import workPlaceOptions from "../data/municipios.json";
import motiveOptions from "../data/motives.json";
import timeOptions from "../data/time.json";
import contractTypeOptions from "../data/contractType.json";
import workingDayOptions from "../data/workingDay.json";
import salaryScale from "../data/salaryScale.json";
import areasByMemberships from "../data/areasByMemberships.json";
import containsAny from "../../../misc/containsAny";

const higherMemberships = [
  ["director", "discol"],
  ["director", "Direccion_Administrativa"],
];

export default function RequestGeneralities({
  requestData,
  update,
  fiterErrors,
}) {
  const [isBonus, setIsBonus] = React.useState();
  const [isUndefinedTermContract, setUndefinedTerm] = React.useState(false);
  const [area, setArea] = React.useState();
  const [openDropdown, setOpenDropdown] = React.useState(false);
  const [selectedSalary, setSelectedSalary] = React.useState([]);
  const [salaryOptions, setsalaryOptions] = React.useState([]);

  function getKeysForValue(value) {
    return salaryScale
      .filter((item) => value >= item.min && value <= item.max)
      .map((item) => item.key);
  }

  React.useEffect(() => {
    if (requestData) {
      setUndefinedTerm(requestData?.contractType === "undefined");
      setIsBonus(requestData?.isBonus);
    }
  }, [requestData]);

  function getMyMenu(membership) {
    return areasByMemberships
      .filter(
        (area) => JSON.stringify(area.membership) === JSON.stringify(membership)
      )
      .map((area) => area.menu)
      .flat(1);
  }

  function getUniqueAreas(memberships) {
    const myMenu = memberships.map((membership) => getMyMenu(membership));
    const uniqueMap = myMenu.flat().reduce((map, obj) => {
      const key = `${obj.label}-${obj.value}`;
      if (!map.has(key)) {
        map.set(key, obj);
      }
      return map;
    }, new Map());
    return Array.from(uniqueMap.values());
  }

  async function getMemberships() {
    const memberships = await Meteor.callAsync(
      "get_my_memberships",
      Meteor.userId()
    )
      .then((resp) => resp)
      .catch(() => []);
    if (!memberships?.length) return [];
    return memberships;
  }

  React.useEffect(() => {
    getMemberships().then((memberships) => {
      if (containsAny(memberships, higherMemberships))
        setsalaryOptions(salaryScale);
      else setsalaryOptions(salaryScale.slice(0, -2));
      setArea(getUniqueAreas(memberships));
    });
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
              min={1}
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
          <Dropdown
            arrow
            menu={{
              items: salaryOptions,
              selectedKeys: selectedSalary,
              onClick: (info) => console.log(info.key)
            }}
            open={openDropdown}
            
          >
            <Form.Item label="Salario" name={"salary"} help='Debes escribir. Valores solo para referencia' tooltip='Valores solo informativos'>
              <InputNumber
                stringMode
                type="number"
                min={975000}
                id="salary"
                status={fiterErrors("salary")}
                defaultValue={parseInt(requestData?.salary) || 0}
                addonBefore="$"
                onChange={(value) => {
                  update("salary", value);
                  setSelectedSalary(getKeysForValue(value));
                }}
                onFocus={(e) => {
                  setOpenDropdown(true);
                  setSelectedSalary(
                    getKeysForValue(parseInt(e.currentTarget.value))
                  );
                }}
                onBlur={() => setOpenDropdown(false)}
              />
            </Form.Item>
          </Dropdown>
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
                <InputNumber
                  stringMode
                  inputMode="numeric"
                  id="durationCuantity"
                  status={fiterErrors("duration")}
                  defaultValue={parseInt(
                    requestData?.duration?.cuantity || "0"
                  )}
                  type="number"
                  onChange={(value) => update("duration.cuantity", value)}
                  min={1}
                  max={100}
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
                <InputNumber
                  stringMode
                  inputMode="numeric"
                  defaultValue={parseInt(
                    requestData?.bonusesFrecuency?.cuantity || "1"
                  )}
                  type="number"
                  onChange={(value) =>
                    update("bonusesFrecuency.cuantity", value)
                  }
                  min={1}
                  max={100}
                  id="bonusesFrecuencyCuantity"
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
