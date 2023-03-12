const Usuario = require("../models/Usuario");
const jwt = require("jsonwebtoken");
const encriptaSenha = require("../helpers/encriptaSenha");
const bcrypt = require("bcrypt");

module.exports = {
  /**
   * Valida o token
  */
  checkToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(" ")[1];
  
    if (!token) {
      return res.status(401).json({ msg: "Acesso negado!" });
    }
  
    try {
      const secret = process.env.SECRET;
      jwt.verify(token, secret);
      next();
    }catch(error) {
      res.status(400).json( {msg: "Token inválido!"} );
    }
  },

  async detail(req, res) {
    const { _id } = req.params

    const userExists = await Usuario.findById(_id);

    if(!userExists) {
      return res.status(422).json({msg: "Usuário não cadastrado!"});
    }

    const usuario = await Usuario.findById(_id, "-senha");
    return res.status(200).json(usuario);
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

    const senhaHash = await encriptaSenha(senha);

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

    try {
      await Usuario.findByIdAndUpdate(_id, dataCreate);
      return res.status(200).json({msg: "Dados atualizados com sucesso!"});
    } catch (error) {
      return res.status(422).json({msg: "Usuário não encontrato ou não existe!"});
    }  

  },

  async delete(req, res) {
    const { _id } = req.params;

    const userExists = await Usuario.findById(_id);

    if(!userExists) {
      return res.status(422).json({msg: "Usuário não cadastrado!"});
    }

    
    try {
      await Usuario.findByIdAndDelete(_id);
      return res.status(200).json({msg: "Usuário deletado com sucesso!"});
    } catch (error) {
      return res.status(422).json({msg: "Usuário não encontrato ou não existe!"});
    } 
  },

  async login(req, res) {
    const { email, senha } = req.body;

    if(!email) {
      return res.status(422).json({msg: "O email é um campo obrigatório"});
    }
  
    if(!senha) {
      return res.status(422).json({msg: "A senha é um campo obrigatório"});
    }

    /**
     * Verificar se o usuário existe
    */
    const user = await Usuario.findOne({ email: email });

    if(!user) {
      return res.status(404).json({msg: "Usuário não encontrado!"});
    }

    /**
     * Verificar senha
    */
    const checkPassword = await bcrypt.compare(senha, user.senha);

    if(!checkPassword) {
      return res.status(422).json({msg: "Senha incorreta!"});
    }

    /**
     * Logar usuário
    */
    try{
      const secret = process.env.SECRET;
      const token = jwt.sign({
        id: user._id,
      },
      secret,
    );
    const { id } = user ;
    res.status(200).json({ msg: "Logado com sucesso!", token, id});
    }catch(error) {
      console.log(error);
      res.status(500).json({msg: "Erro no servidor, tente novamente mais tarde!"});
    }
  },
}