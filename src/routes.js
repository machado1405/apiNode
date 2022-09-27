const express = require("express");
const UsuarioController = require("./controller/UsuarioController");
const routes = express.Router();

/**
 * Rota home da API
 * return @json
 */
routes.get("/", (req, res) => {
  res.status(200).json({msg: "Bem vindo a API..."});
});

/**
 * Rotas de Usuário
 * return @json
 * rotas com nomes iguais, porem verbos diferentes
 * node aceita e diferencia
 */
routes.get("/usuario", UsuarioController.index);
routes.get("/usuario/:_id", UsuarioController.detail);
routes.post("/usuario", UsuarioController.store);
routes.put("/usuario", UsuarioController.update);
routes.delete("/usuario/:_id", UsuarioController.delete);

module.exports = routes;