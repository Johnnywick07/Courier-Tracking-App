const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'courier-secret-key', {
    expiresIn: '7d',
  });
};

module.exports = generateToken;
