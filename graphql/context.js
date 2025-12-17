const jwt = require('jsonwebtoken');

module.exports = ({ req }) => {
  const auth = req.headers.authorization || '';
  if (auth.startsWith('Bearer ')) {
    try {
      const token = auth.replace('Bearer ', '');
      const user = jwt.verify(token, process.env.JWT_SECRET || 'secret');
      return { user };
    } catch (e) {
      return {};
    }
  }
  return {};
};
