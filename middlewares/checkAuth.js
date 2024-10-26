const { verifyToken } = require("../services/auth");

function checkAuthenticationToken(userCookie) {
  return (req, res, next) => {
    const cookieTokenValue = req.cookies[userCookie];
    if (!cookieTokenValue) {
      return next();
    }

    try {
      const userPayload = verifyToken(cookieTokenValue);
      req.user = userPayload;
    } catch (error) {}
    return next();
  };
}

module.exports = { checkAuthenticationToken };
