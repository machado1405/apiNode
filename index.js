require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const routes = require("./api/routes");
const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/routes", routes);

/**
 * Credenciais do banco de dados
 */
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;

/**
 * Conexão com o banco de dados
 */
const port = process.env.PORT
mongoose
  .connect(`mongodb+srv://${dbUser}:${dbPassword}@apinode.gf9ioht.mongodb.net/?retryWrites=true&w=majority`)
  .then(() => {
  console.log("Conectado com sucesso ao banco de dados!");
  app.listen(port, () => {
    console.log("Servidor iniciado...");
  });
  })
  .catch(err => console.log(err));