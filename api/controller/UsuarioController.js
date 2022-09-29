const Usuario = require("../model/Usuario");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const usuario = require("../model/Usuario");

module.exports = {
  async index(req, res) {
    const usuario = await Usuario.find();
    res.status(200).json(usuario);
  },

  async detail(req, res) {
    const {_id} = req.params

    const userExists = await Usuario.findOne({_id});

    if(!userExists) {
      return res.status(422).json({msg: "Usuário não cadastrado!"});
    }
    
    const usuario = await Usuario.findOne({_id});
    res.status(200).json(usuario);
  },

  async store(req, res) {
    const { nome, email, senha, confirmarSenha } = req.body;

    /**
     * Validações dos dados
    */
    if(!nome) {
      return res.status(422).json({msg: "O nome é um campo obrigatório!"});
    }

    if(!email) {
      return res.status(422).json({msg: "O email é um campo obrigatório!"});
    }

    if(!senha) {
      return res.status(422).json({msg: "A senha é um campo obrigatório!"});
    }

    if(!confirmarSenha) {
      return res.status(422).json({msg: "A confirmação de senha é um campo obrigatório!"});
    }

    if (confirmarSenha !== senha) {
      return res.status(422).json({msg: "As senhas devem ser iguais!"});
    }

    /**
     * Verificar se o usuário ja existe
    */
    const userExists = await Usuario.findOne({ email: email });

    if(userExists) {
      return res.status(422).json({msg: "Usuário já cadastrado!"});
    }

    const salt = await bcrypt.genSalt(12);
    const senhaHash = await bcrypt.hash(senha, salt);

    let dataCreate = {};
    dataCreate = {
      nome, email, senha: senhaHash
    }

    try {
      Usuario.create(dataCreate);
      res.status(201).json({message: "Usuário criado com sucesso!"});;
    } catch (error) {
      console.log(error);
    }
  },

  async update(req, res) {
    const { nome, senha, confirmarSenha, email, _id } = req.body;

    /**
     * Validações dos dados
    */
      if(!nome) {
      return res.status(422).json({msg: "O nome é um campo obrigatório!"});
    }

    if(!email) {
      return res.status(422).json({msg: "O email é um campo obrigatório!"});
    }

    if(!senha) {
      return res.status(422).json({msg: "A senha é um campo obrigatório!"});
    }

    if(!confirmarSenha) {
      return res.status(422).json({msg: "A confirmação de senha é um campo obrigatório!"});
    }

    if(!_id) {
      return res.status(422).json({msg: "Id não encontrado ou não existe!"});
    }

    const salt = await bcrypt.genSalt(12);
    const senhaHash = await bcrypt.hash(senha, salt);

    let dataCreate = {
      nome, senha: senhaHash, email
    }

    const usuario = await Usuario.findByIdAndUpdate({_id}, dataCreate);
    return res.status(200).json({msg: "Dados atualizados com sucesso!"});
  },

  async delete(req, res) {
    const {_id} = req.params;

    const userExists = await Usuario.findOne({_id});

    if(!userExists) {
      return res.status(422).json({msg: "Usuário não cadastrado!"});
    }

    const usuario = await Usuario.findByIdAndDelete({_id});
    res.status(200).json({message: "Usuário deletado com sucesso!"});
  },
}