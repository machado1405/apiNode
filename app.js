/**
 * Imports API
 * @return dados referentes ao pacote.
 */
require('dotenv').config();
const express = require('express');
const cors = require("cors");
const mongoose = require('mongoose');
const routes = require("./src/routes");
const app = express();
app.use(cors());
app.use(express.json());
app.use("/src/routes", routes);

/**
 * Credenciais de acesso
 * @return dados do env
 */
const dbUser =  process.env.DB_USER;
const dbPass =  process.env.DB_PASS;
const port = process.env.PORT;

/**
 * Conexão com o banco de dados
 * @return dados da conexao
 */
app.listen(port, () => {
  console.log("Servidor iniciado...");
  mongoose
  .connect(`mongodb+srv://${dbUser}:${dbPass}@apinode.1nc7xyp.mongodb.net/?retryWrites=true&w=majority`)
  .then(() => {
  console.log("Conectou ao banco");
  })
  .catch(err => console.log(err));
});
