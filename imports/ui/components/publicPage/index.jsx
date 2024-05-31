import React from "react";
import { Flex, Layout, Typography } from "antd";
import PublicHeader from "./publicHeader";
import ButtonLink from "./buttonLink";
import { QuestionCircleOutlined } from "@ant-design/icons";
import "./bgmain.css"
const { Title, Text } = Typography;

export default function PublicPage() {
  return (
    <Flex vertical>
      <Flex
        style={{
          background: "#fff",
          width: "100%",
          padding: 0,
          height: "7vh",
        }}
      >
        <PublicHeader />
      </Flex>
      <Flex
        vertical
        style={{
          height: "70vh",
          width: "100%",
          backgroundColor: "white",
        }}
      >
        <Flex
          style={{
            height: "50vh",
            width: "100%",
            backgroundColor: "#014e72",
          }}
          justify="center"
        >
            <div className="bg-main"></div>
          <Flex
            style={{
              width: "40vw",
              height: "50vh",
              border: "2px solid black",
              borderRadius:'5px',
              background: "black",
              backgroundImage: "url('/intro-example.jpeg')",
              backgroundPosition: "center",
              backgroundOrigin: "border-box",
              backgroundRepeat: "no-repeat",
              backgroundSize: "contain",
              position: "absolute",
              zIndex:'1',
              top: "9vh",
              left: "48%",
              boxShadow:'15px 15px 20px black'
            }}
          >
            {" "}
          </Flex>
          <Flex
            vertical
            justify="center"
            style={{
              width: "25vw",
              height: "47vh",
              background: "#017db2",
              position: "absolute",
              top: "17vh",
              right: "47%",
              boxShadow:'15px 15px 20px black',
              borderRadius:'5px',
              zIndex:'2'
            }}
          >
            <Flex vertical style={{padding:'20px 30px'}}>
              <Title style={{ color: "white" }} level={3}>
                ¡25 AÑOS SUPERANDO TUS EXPECTATIVAS!
              </Title>
              <Text style={{ color: "whitesmoke", fontWeight:'normal', fontSize: 'clamp(.7rem, 0.8vw, 3rem)'}}>
                Nuestro principal compromiso es superar las expectativas que
                nuestros clientes, proveedores y colaboradores tienen sobre
                nosotros, mediante las buenas prácticas de la ingeniería, bajo
                unas políticas de responsabilidad social y de sostenibilidad
                ambiental.
              </Text>
            </Flex>
          </Flex>
        </Flex>
        <Flex
          style={{
            width: "50px",
            height: "50px",
            background: "#0991c6",
            border: "2px solid #006b96",
            position: "absolute",
            top: "64vh",
            right: "calc(47% + 25vw)",
            boxShadow:'15px 15px 20px black',
            borderRadius:'5px',
          }}
        >
          {" "}
        </Flex>
      </Flex>
      <Flex justify="center" gap={32}>
        <ButtonLink icon={QuestionCircleOutlined} title={"FAQ"} />
        <ButtonLink icon={QuestionCircleOutlined} title={"Semillero"} />
        <ButtonLink icon={QuestionCircleOutlined} title={"quejas y reclamos"} />
      </Flex>
    </Flex>
  );
}
