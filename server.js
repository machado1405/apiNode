const express = require("express");
// const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");
const routes = require("./src/routes");
const app = express();
require("dotenv").config();
app.use(cors());
// app.use(cookieParser);
app.use(express.json());
app.use(routes);

/**
 * Credenciais do banco de dados
 */
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;

/**
 * Conexão com o banco de dados
 */
mongoose
  .connect(`mongodb+srv://${dbUser}:${dbPassword}@apinode.gf9ioht.mongodb.net/?retryWrites=true&w=majority`)
  .then(() => {
  console.log("Conectado com sucesso ao banco de dados!");
  app.listen(3000, () => {
    console.log("Servidor iniciado...");
  });
  })
  .catch(err => console.log(err));