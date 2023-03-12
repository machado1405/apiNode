const encriptaSenha = require("../helpers/encriptaSenha");
const Usuario = require("../models/Usuario");
const sendMail = require("../modules/mailer");

module.exports = {
  async alterarSenha(req, res) {
    const { _id, senha } = req.body;
    const userExists = await Usuario.findById(_id);

    if (!senha) {
      return res.status(422).json({msg: "Digite uma senha válida!"});
    }

    if(!userExists) {
      return res.status(422).json({msg: "Usuário não cadastrado!"});
    }

    const senhaHash = await encriptaSenha(senha);

    try {
      await Usuario.findByIdAndUpdate(_id, senhaHash);
      return res.status(200).json({msg: "Senha alterada com sucesso!"});
    } catch (error) {
      return res.status(422).json({msg: "Usuário não encontrato ou não existe!"});
    }  
  },

  async passwordRecover(req, res) {
    const { email } = req.body;
    try {
      
      const user = await Usuario.findOne({email});
      if(!user) {
        return res.status(422).json({msg: "Usuário não encontrado ou não existe!"});
      }

      const token = Math.round(Math.random() * 100000);
      const now = new Date();
      now.setHours(now.getHours() + 1);

      await Usuario.findByIdAndUpdate(user.id, {
        '$set': {
          senhaToken: token,
          senhaTokenExpires: now,
        }
      });

      const response = await sendMail(token, email);
      return res.status(200).json({msg: response});
    } catch (error) {
      console.log(error);
      res.status(400).json({msg: "Não foi possível recuperar a senha, tente novamente!"});
    }
  },

  async resetPassword(req, res) {
    const { token, password, email } = req.body;

    if(!token) {
      return res.status(422).json({msg: "Insira um token para alterar a senha!"});
    }

    if(!email) {
      return res.status(422).json({msg: "Insira o e-mail cadastrado"});
    }

    if(!password) {
      return res.status(422).json({msg: "Digite uma senha válida!"});
    }

    const user = await Usuario.findOne({email});

    if(!user) {
      return res.status(422).json({msg: "Usuário não encontrado ou não cadastrado!"});
    }
    const now = new Date();

    if(user.senhaTokenExpires < now) {
      return res.status(422).json({msg: "Token expirado, solicite um novo token e tente novamente!"});
    }

    if(user.senhaToken === token){
      const senhaHash = await encriptaSenha(password);
      try {
        await Usuario.findByIdAndUpdate(user.id, {
          '$set': {
            senha: senhaHash,
          }
        });

        res.status(200).json({msg: "Senha alterada com sucesso!"});
      } catch (error) {
        console.log(error);
        res.status(400).json({msg: "Não foi possível recuperar a senha, tente novamente!"});
      }
    } 
  }
};