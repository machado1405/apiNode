const encriptaSenha = require("../helpers/encriptaSenha");
const Usuario = require("../model/Usuario");

module.exports = {
  async alterarSenha(req, res) {
    const { _id, senha } = req.body;
    const userExists = await Usuario.findOne({_id});

    if (!senha) {
      return res.status(422).json({msg: "Digite uma senha válida!"});
    }

    if(!userExists) {
      return res.status(422).json({msg: "Usuário não cadastrado!"});
    }

    const senhaHash = await encriptaSenha(senha);

    const usuario = await Usuario.findByIdAndUpdate({_id}, senhaHash);
    return res.status(200).json({message: "Senha alterada com sucesso!"});
  }
 };