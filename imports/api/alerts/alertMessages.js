import { Meteor } from "meteor/meteor";
import { Random } from "meteor/random";
import { Picker } from "meteor/meteorhacks:picker";
import sendMails from "./sendMails";

const bodyParser = Meteor.npmRequire("body-parser");

Picker.middleware(bodyParser.json());
Picker.middleware(bodyParser.urlencoded({ extended: false }));

const postRoutes = Picker.filter(function (req, res) {
  return req.method == "POST";
});

// Diccionario para rastrear las solicitudes
const requestCache = {};

// Función de middleware para limitar la tasa de solicitudes
function rateLimiter(req, res, next) {
  const clientIP =
    req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const currentTime = Date.now();

  // Verificar si hay una solicitud previa de esta IP
  if (requestCache[clientIP]) {
    const timeSinceLastRequest = currentTime - requestCache[clientIP];

    if (timeSinceLastRequest < 5000) {
      // 5 segundos
      res.writeHead(429, { "Content-Type": "text/plain" });
      res.end("Too many requests. Please wait a few seconds.");
      return;
    }
  }

  // Actualizar el tiempo de la última solicitud para esta IP
  requestCache[clientIP] = currentTime;

  next(); // Continuar con la solicitud si no se ha excedido el límite
}

postRoutes.route("/alert", function (params, req, res, next) {
  rateLimiter(req, res, async () => {
    await Meteor.callAsync("create_alert", req.body).catch(() =>
      console.err("error enviando notificaciones")
    );
    const alertID = Random.id();
    await sendMails(req.body, alertID);
    res.end();
  });
});
