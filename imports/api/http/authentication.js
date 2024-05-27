import { Meteor } from "meteor/meteor";
import Axios from "axios";

import { wrapper } from "axios-cookiejar-support";
import { CookieJar } from "tough-cookie";

import config from "../../private/config.json";

wrapper(Axios);

const cookieJar = new CookieJar();
Axios.defaults.jar = cookieJar;
Axios.defaults.withCredentials = true;
//TODO: change to .env
Axios.defaults.baseURL = config.baseUrl;

const serviceUrl = "/loginservice";
const session = "/API/system/session/unusedid";

let token = "";

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
          token = tokenCookie[0]?.value;

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
    const token = await Meteor.callAsync("get_token");
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
          return "error";
        });
    else return "no token";
  },
  async post_data({ url, data }) {
    const token = await Meteor.callAsync("get_token");
    if (token) {
      return await Axios.post(url, data, {
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
            message: "Error al realizar la transaccion",
          };
        });
    } else return "no token";
  },
  async put_data({ url, data }) {
    const token = await Meteor.callAsync("get_token");
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
            message: "Error al realizar la transaccion",
          };
        });
    } else return "no token";
  },
  get_token() {
    return Meteor.users.findOne(Meteor.userId({})).profile?.token;
  },
});
