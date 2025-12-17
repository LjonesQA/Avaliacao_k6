
const users = require('../model/userModel'); 

function registerUser({ username, password, favorecidos = [] }) {
  if (users.find(u => u.username === username)) {
    throw new Error('Usuário já existe');
  }
  const user = { username, password, favorecidos };
  users.push(user);
  return user;
}

function loginUser({ username, password }) {
  const user = users.find(u => u.username === username);
  if (!user) {
    throw new Error('Login ou senha inválidos');
  }
  const bcrypt = require('bcryptjs');
  const passwordMatch = bcrypt.compareSync(password, user.password);
  if (!passwordMatch) {
    throw new Error('Login ou senha inválidos');
  }
  return user;
}



function getUsers() {
  return users;
}

function getUser(username) {
  return users.find(u => u.username === username);
}

module.exports = {
  registerUser,
  loginUser,
  getUsers,
  getUser,
};
