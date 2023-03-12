const bcrypt = require("bcrypt");

/**
 * @param senha 
 * @returns senha encriptada
 */
async function encriptaSenha(senha) {
  const salt = await bcrypt.genSalt(12);
  const senhaHash = await bcrypt.hash(senha.toString(), salt);
  return senhaHash;
}

module.exports = encriptaSenha;