const mongoose = require("mongoose");

/**
 * Define a estrutura da tabela
 * quais campos serão criados
 */
const Schema = new mongoose.Schema({
  nome: String,
  email: String,
  senha: String,
  senhaToken: String,
  senhaTokenExpires: Date
});

/**
 * Cria a tabela no banco usando 
 * o primeiro parâmetro como nome
 * e o segundo para estruturar
 */
const usuario = mongoose.model("Usuario", Schema);
module.exports = usuario;