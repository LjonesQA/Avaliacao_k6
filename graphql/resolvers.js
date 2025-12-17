const userService = require('../service/userService');
const transferService = require('../service/transferService');
const jwt = require('jsonwebtoken');

const resolvers = {
  Query: {
    users: () => userService.getUsers(), //Vai trazer a lista de usuários
    user: (_, { username }) => userService.getUser(username), //Vai trazer um usuário específico
    transfers: () => transferService.getTransfers(), //Vai trazer a lista de transferências
  },
  Mutation: {
    login: async (_, { username, password }) => {
      try {
        const user = userService.loginUser({ username, password });
        const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
        return { token, user };
      } catch (e) {
        throw new Error('Login ou senha inválidos');
      }
    },
    createTransfer: (_, { from, to, value }, context) => {
      if (!context.user) throw new Error('Token não fornecido');
      try {
        return transferService.transferValue({ from, to, value });
      } catch (e) {
        // Retorna erro GraphQL amigável
        throw new Error(e.message);
      }
    },
  },
};

module.exports = resolvers;
