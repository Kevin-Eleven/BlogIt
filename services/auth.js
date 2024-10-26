const jwt = require("jsonwebtoken");

const secret = "mysecretkeyisverysecret";

function createTokenForUser(user) {
  const payload = {
    id: user._id,
    fullName: user.fullName,
    profilePhoto: user.profilePhoto,
    role: user.role,
  };

  const token = jwt.sign(payload, secret);
  return token;
}

function verifyToken(token) {
  return jwt.verify(token, secret);
}

module.exports = { createTokenForUser, verifyToken };
