import { Descriptions, Form } from "antd";
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
  console.log("🚀 ~ InterviewView ~ laboralExperience:", interviewForm);

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
      span: 4,
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
      span: 3,
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
      span: 3,
    },
    {
      key: "3",
      label: "Jefe inmediato",
      children: interviewForm.aboutBusinessBoss,
      span: 3,
    },
  ];
  const family = [
    {
      key: "1",
      label: "Parentezco",
      children: interviewForm.kinship,
      span: 2,
    },
    {
      key: "2",
      label: "Familiar",
      children: interviewForm.kinName,
      span: 3,
    },
  ];
  return (
    <div>
      <Descriptions
        title="Generalidades"
        items={generalities}
        bordered
        size="small"
      />
      {interviewForm.previousEmployee ? (
        <Descriptions
          title="Laboró en discol"
          items={laboredBefore}
          bordered
          size="small"
        />
      ) : (
        "No ha laborado en Discol anteriormente"
      )}
     {interviewForm.aboutBusiness? <Descriptions
        title="Laboró en empresa vinculada"
        items={asociatedBefore}
        bordered
        size="small"
      />:"No ha trabajado en empresas asociadas"}
     {interviewForm.isAboutFamily? <Descriptions
        title="Familiar en Discol"
        items={family}
        bordered
        size="small"
      />:"No tiene familiares en discol"}
    </div>
  );
}
