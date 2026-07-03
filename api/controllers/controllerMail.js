import nodemailer from "nodemailer"
import { Usuario } from "../models/Usuario.js";
import md5 from 'md5'

// async..await is not allowed in global scope, must use a wrapper
async function main(nome, email, hash) {

  // console.log(nome, email, hash)

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "b4666ac149ef20", // generated ethereal user
      pass: "44a3e6bb56501b", // generated ethereal password
    },
  });

  const link = "http://localhost:3001/trocasenha/"+hash
 
  let mensa = "<h5>Padaria Seu Pizza</h5>"
  mensa += `<h6>Estimado: ${nome}</h6>`
  mensa += "<h6>Você solicitou a troca de senha. "
  mensa += "Clique no link abaixo para alterar:</h6>"
  mensa += `<a href="${link}">Alterar sua senha</a>`

  // console.log(mensa)

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Padaria Seu Pizza" <avalrest@email.com>', // sender address
    to: email, // list of receivers
    subject: "Solicitação Alteração de Senha", // Subject line
    text: `Copie e cole o endereço: ${link} para alterar`, // plain text body
    html: mensa, // html body
  });

  console.log("Message sent: %s", info.messageId);
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