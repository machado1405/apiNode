const express = require("express");
const SenhaController = require("./controller/SenhaController");
const UsuarioController = require("./controller/UsuarioController");
const routes = express.Router();
require("dotenv").config();

/**
 * Rota home da API
 * return @json
 */
routes.get("/", async (req, res) => {
  try {
    res.status(200).json({msg: "Bem vindo a API..."});
  }catch(error) {
    console.log(error);
    return res.status(500).send("Erro no servidor!");
  }
});

/**
 * Rotas de Usuário
 * return @json
 * rotas com nomes iguais, porem verbos diferentes
 * node aceita e diferencia
*/
routes.get("/usuario/:_id", UsuarioController.detail);
routes.post("/usuario", UsuarioController.store);
routes.put("/usuario", UsuarioController.checkToken, UsuarioController.update);
routes.post("/usuario/login", UsuarioController.checkToken, UsuarioController.login);
routes.delete("/usuario/:_id", UsuarioController.delete);
routes.put("/alterarSenha", SenhaController.alterarSenha);
routes.post("/recuperarSenha", SenhaController.passwordRecover);
routes.post("/resetarSenha", SenhaController.resetPassword);

module.exports = routes;