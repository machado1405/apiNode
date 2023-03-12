require('dotenv').config();
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const mailHost = process.env.MAIL_HOST;
const mailPort = process.env.MAIL_PORT;
const mailUser = process.env.MAIL_USER;
const mailPass = process.env.MAIL_PASS;

async function sendMail(token, email) {
  let transporter = nodemailer.createTransport({
    host: mailHost,
    port: mailPort,
    auth: {
      user: mailUser,
      pass: mailPass
    }
  });
  
  const message = {
    from: "noreplay@devmatheus.com",
    to: email,
    subject: "Token para recuperação de senha.",
    text: "Olá, aqui está seu token para recuperar sua senha.",
    html: `<p>Olá, aqui está seu token para recuperar sua senha. ${token}</p>`
  }
  
  transporter.sendMail(message, (err) => {
    if(err) {
      return "Não foi possível enviar o e-mail!";
    }
  });
  
  return "Um token de seis dígitos foi enviado para o e-mail cadastrado!";
}

module.exports = sendMail;