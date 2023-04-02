const jwt = require("jsonwebtoken");
const { ERROR_AUTH } = require("../utils/constants");
const AuthErors = require("../erors/AuthErors");
const {  key } = require("../utils/constants");
module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return next(new AuthErors("Передан неверный логин или пароль"));
  }

  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    payload = jwt.verify(token, key);
  } catch (err) {
    console.log(err);
    return next(new AuthErors("Передан неверный логин или пароль"));
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
};

