const jwt = require("jsonwebtoken");
const privateKey = process.env.JWT_KEY;

const generateAuthToken = function (id) {
  const token = jwt.sign(
    {
      id: id,
    },
    privateKey,
    { expiresIn: "24h" }
  );

  return token;
};

module.exports = generateAuthToken;
