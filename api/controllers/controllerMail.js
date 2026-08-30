import nodemailer from "nodemailer"
import { Usuario } from "../models/Usuario.js";
import md5 from 'md5'

// async..await is not allowed in global scope, must use a wrapper
async function main(nome, email, hash) {

  // console.log(nome, email, hash)

  // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const frontendUrl = (process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/$/, '');
  const link = `${frontendUrl}/trocasenha/${encodeURIComponent(hash)}`;
 
  let mensa = "<h5>Padaria Seu Pizza</h5>"
  mensa += `<h6>Estimado: ${nome}</h6>`
  mensa += "<h6>Você solicitou a troca de senha. "
  mensa += "Clique no link abaixo para alterar:</h6>"
  mensa += `<a href="${link}">Alterar sua senha</a>`

  // console.log(mensa)

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: process.env.MAIL_FROM || 'Padaria Seu Pizza <no-reply@example.com>',
    to: email, // list of receivers
    subject: "Solicitação Alteração de Senha", // Subject line
    text: `Copie e cole o endereço: ${link} para alterar`, // plain text body
    html: mensa, // html body
  });

  return info;
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
}

export const enviaEmail = async (req, res) => {
  const { email } = req.body
  try {
    const usuario = await Usuario.findOne({ where: { email } })

    if (usuario == null) {
      res.status(400).json({ erro: "Erro... E-mail inválido" })
      return
    }
    const hash = md5(usuario.nome + email + Date.now())
    main(usuario.nome, email, hash).catch(console.error);

    res.status(200).json({ msg: "Ok. E-mail para alteração enviado com sucesso" })
  } catch (error) {
    res.status(400).json(error)
  }
}  