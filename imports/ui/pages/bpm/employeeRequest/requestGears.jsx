import { Flex } from "antd";
import React from "react";
import ListCheckItems from "../../../components/listCheckItems";
import { gearOptions } from "../../../misc/gearsOptions";
import AddOtherGears from "../../../components/addOtherGears";

//TODO: diadema, teléfono celular.
export default function RequestGears({ requestData, update }) {
  return (
    <Flex justify="space-around">
      <ListCheckItems
        options={gearOptions}
        update={update}
        requestData={requestData}
      />
      <AddOtherGears update={update} requestData={requestData} />
    </Flex>
  );
}
