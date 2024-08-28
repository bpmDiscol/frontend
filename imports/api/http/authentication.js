import { Meteor } from "meteor/meteor";
import Axios from "axios";

import { wrapper } from "axios-cookiejar-support";
import { Cookie, CookieJar } from "tough-cookie";

import configData from "../../../data.json";

wrapper(Axios);
const cookieJar = new CookieJar();
Axios.defaults.jar = cookieJar;
Axios.defaults.withCredentials = true;

if (Meteor.isDevelopment)
  Axios.defaults.baseURL = configData.server.development;
else Axios.defaults.baseURL = configData.server.production;

const serviceUrl = "/loginservice";
const session = "/API/system/session/unusedid";

Meteor.methods({
  async bonita_login({ username, password }) {
    await cookieJar.removeAllCookies();
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
          const token = tokenCookie[0]?.value;

          const axiosCookie = response.config.jar
            .serializeSync()
            .cookies.filter((cookie) => cookie.key == "JSESSIONID")[0];

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
                axiosCookie,
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
  async manage_data(method, { url, data, user }) {
    const currentUser = Meteor.users.findOne(user);
    const { token, axiosCookie } = currentUser?.profile;
    if (!token && !axiosCookie) return "no token";

    await cookieJar.removeAllCookies();
    cookieJar.setCookie(new Cookie(axiosCookie), Axios.defaults.baseURL);
    return await Axios({
      url,
      data,
      method,
      headers: { "X-Bonita-API-Token": token },
    })
      .then((response) => {
        return {
          error: false,
          response: response.data,
          message: "Completado exitosamente",
        };
      })
      .catch((error) => {
        console.warn({
          status: error.response.status,
          message: error.response.data,
        });
        return {
          error: true,
          status: error.response.status,
          message: error.response.data,
        };
      });
  },
  async update_credentials({ bonitaUser, token, axiosCookie, user }) {
    const memberships = await Meteor.callAsync(
      "get_my_memberships",
      user,
      bonitaUser
    ).catch(() => []);

    const professionalcontactdata = await Meteor.callAsync(
      "get_professionalcontactdata",
      bonitaUser,
      user,
    ).then(resp=> resp.response).catch(() => console.warn(`User ${bonitaUser} has no setted mail`));
    const email = professionalcontactdata
      ? professionalcontactdata.email
      : "nomail@discol.co";

    Meteor.users.update(
      { _id: user },
      {
        $set: {
          profile: { bonitaUser, token, axiosCookie, memberships, email },
        },
      },
      { upsert: true }
    );
  },
});
