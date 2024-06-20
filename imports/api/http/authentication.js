import { Meteor } from "meteor/meteor";
import Axios from "axios";

import { wrapper } from "axios-cookiejar-support";
import { CookieJar } from "tough-cookie";

// import config from "../../private/config.json";

wrapper(Axios);

const cookieJar = new CookieJar();
Axios.defaults.jar = cookieJar;
Axios.defaults.withCredentials = true;
//TODO: change to .env

if(process.env.ROOT_URL == "http://localhost:3000/") Axios.defaults.baseURL = "http://localhost:8080/bonita";
else Axios.defaults.baseURL = "http://35.202.4.246/bonita";
const serviceUrl = "/loginservice";
const session = "/API/system/session/unusedid";

let token = "";
let JSESSIONID = "";

Meteor.methods({
  async bonita_login({ username, password }) {
    const response = await Axios.post(
      serviceUrl,
      {
        username,
        password,
      },
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        transformRequest: [
          (data, _) => {
            return Object.entries(data)
              .map(
                ([key, value]) =>
                  `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
              )
              .join("&");
          },
        ],
      }
    )
      .then(async (response) => {
        if ((response.status = 204)) {
          const tokenCookie = response.config.jar
            .serializeSync()
            .cookies.filter((cookie) => cookie.key == "X-Bonita-API-Token");
          const JSESSIONIDCookie = response.config.jar
            .serializeSync()
            .cookies.filter((cookie) => cookie.key == "JSESSIONID");
          token = tokenCookie[0]?.value;
          JSESSIONID = JSESSIONIDCookie[0]?.value;

          return await Axios.get(session, {
            headers: {
              "X-Bonita-API-Token": token,
            },
          })
            .then(async (response) => {
              return {
                message: "Autorizado",
                variant: "success",
                bonitaUser: response.data.user_id,
                token,
                JSESSIONID,
              };
            })
            .catch((error) => {
              return {
                message: "error adquiriendo usuario",
                variant: "error",
              };
            });
        }
      })
      .catch((error) => {
        return {
          message: "Error de validación",
          variant: "error",
        };
      });
    return response;
  },
  async get_data({ url, params }) {
    const token = await Meteor.callAsync("get_token").catch(error=> console.error(error));
    if (token)
      return await Axios.get(url, params, {
        headers: {
          "X-Bonita-API-Token": token,
        },
      })
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          // console.log(error)
          return "error";
        });
    else return "no token";
  },
  async post_data({ url, data }) {
    const token = await Meteor.callAsync("get_token").catch(error=> console.error(error));
    if (token) {
       console.log(url)
      return await Axios.post(url, data, {
        headers: {
          "X-Bonita-API-Token": token,
        },
      })
        .then((response) => {
          console.log("🚀 ~ .then ~ response:", response)
          
          return {
            error: false,
            response: response.data,
            message: "Completado exitosamente",
          };
        })
        .catch((error) => {
          console.log("🚀 ~ post_data ~ error:", error)
          return {
            error: true,
            status: error.response.status,
            message: error.response.data,
          };
        });
    } else return "no token";
  },
  async put_data({ url, data }) {
    const token = await Meteor.callAsync("get_token").catch(error=> console.error(error));
    if (token) {
      return await Axios.put(url, data, {
        headers: {
          "X-Bonita-API-Token": token,
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          return {
            error: false,
            response: response.data,
            message: "Completado exitosamente",
          };
        })
        .catch((error) => {
          return {
            error: true,
            status: error.response.status,
            message: error,
          };
        });
    } else return "no token";
  },
  get_token() {
    return Meteor.users.findOne(Meteor.userId({})).profile?.token;
  },
  get_jsession_id() {
    return Meteor.users.findOne(Meteor.userId({})).profile?.JSESSIONID;
  },
  update_credentials({ bonitaUser, token, JSESSIONID }) {
    Meteor.users.update(
      { _id: Meteor.userId() },
      { $set: { profile: { bonitaUser, token, JSESSIONID } } }
    );
  },
});
