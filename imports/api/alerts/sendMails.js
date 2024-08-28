import { Meteor } from "meteor/meteor";

let lastmail = "";

export default async function sendMails(alert, myID) {
  if (myID == lastmail) return;
  lastmail = myID;

  const membership = alert.memberships;
  const directTo = alert.directTo;

  let mailsData = [];

  if (membership) {
    const users = await Meteor.callAsync(
      "getMailDatabyMembershyp",
      membership
    ).catch(() =>
      console.log("error sending mails on alert: " + JSON.stringify(alert))
    );
    const mailsData_ = users.map((user) => {
      return { email: user.email, user: user.username };
    });
    mailsData = mailsData.concat(mailsData_);
  }
  const htmlTemplate = await Meteor.callAsync("get_template", alert.process);

  if (directTo) {
    const directUser = Meteor.users.findOne({
      "profile.bonitaUser": directTo.toString(),
    });
    if (!directUser)
      console.warn(`User with id ${directTo} not found. No mail sent`);
    else {
      if (directUser?.profile.email) {
        mailsData.push({
          email: directUser.profile.email,
          user: directUser.username,
        });
      } else console.warn(`${directUser.username} has no email`);
    }
  }
  // Eliminar duplicados
  const uniqueMailsData = Array.from(
    new Set(mailsData.map((data) => JSON.stringify(data)))
  ).map((str) => JSON.parse(str));

  uniqueMailsData.forEach((data) => {
    // console.log({
    //   to: `${data.user} <${data.email}>`,
    //   from: "bpm@discolsas.com",
    //   subject: alert.title,
    //   text: alert.message,
    // });
    const htmlContent = htmlTemplate
      .replace("[Nombre del destinatario]", data.user)
      .replace("[descripcion]", alert.message)
      .replace("[Asunto del Correo]", alert.title);

    Meteor.callAsync("sendEmail", {
      to: `${data.user} <${data.email}>`,
      from: "bpm@discolsas.com",
      subject: alert.title,
      html: htmlContent,
    }).catch((e) => console.log(e));
  });
}
