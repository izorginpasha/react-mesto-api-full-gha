const User = require("../models/user");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const NotFoundError = require("../erors/NotFoundError");
const NecorrectDataError = require("../erors/NecorrectDataError");
const EmailErors = require("../erors/EmailErors");
const AuthErors = require("../erors/AuthErors");
const { GOOD, CREATE_GOOD, key } = require("../utils/constants");

const getUsers = async (req, res, next) => {
  //получить список пользователеи
  try {
    const users = await User.find({});
    return res.status(GOOD.code).json(users);
  } catch (e) {
    console.error(e);
    return next(e);
  }
};
const login = async (req, res, next) => {
  //авторизация получение токена
  try {
    const body = { ...req.body };
    const { password, email } = body;
    if (validator.isEmail(email)) {
      const user = await User.findOne({ email }).select("+password");
      if (!user) {
        return next(new AuthErors("Передан неверный логин или пароль"));
      }
      return bcrypt.compare(password, user.password).then((result) => {
        if (result) {
          const token = jwt.sign({ _id: user._id }, key, {
            expiresIn: "7d",
          });
          return res.status(GOOD.code).json({ token });
        }
        return next(new AuthErors("Передан неверный логин или пароль"));
      });
    }
    return next(new NecorrectDataError("Переданы некорректные данные"));
  } catch (e) {
    console.error(e);
    if (e.name === "ValidationError") {
      return next(new NecorrectDataError("Переданы некорректные данные"));
    }
    return next(e);
  }
};

const createUser = async (req, res, next) => {
  //создать пользователя
  try {
    const body = { ...req.body };
    const { password, email } = body;
    if (validator.isEmail(email)) {
      // хешируем пароль
      body.password = await bcrypt.hash(password, 10);
      // передаем базе
      const user = await User.create(body);
      return res.status(CREATE_GOOD.code).json({
        name: user.name,
        about: user.about,
        email: user.email,
        avatar: user.avatar,
        _id: user._id,
      });
    }
    return next(new NecorrectDataError("Переданы некорректные данные"));
  } catch (e) {
    console.error(e);
    if (e.code === 11000) {
      return next(new EmailErors("Такой Email или пароль, уже есть"));
    }
    if (e.name === "ValidationError") {
      return next(new NecorrectDataError("Переданы некорректные данные"));
    }
    return next(e);
  }
};
const getUser = async (req, res, next) => {
  //получить отдельного пользователя

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
  try {
    if (req.user._id === null) {
      throw new NotFoundError("Нет пользователя c таким id");
    }
    return res.status(GOOD.code).json(req.user._id);
  } catch (e) {
    console.error(e);
    return next(e);
  }
};
const patchUsers = async (req, res, next) => {
  //обновить данные пользователя

  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name: req.body.name, about: req.body.about },
      {
        new: true, // обработчик then получит на вход обновлённую запись
        runValidators: true, // данные будут валидированы перед изменением
      }
    );

    return res.status(GOOD.code).json(user);
  } catch (e) {
    console.error(e);
    if (e.name === "ValidationError") {
      return next(new NecorrectDataError("Переданы некорректные данные"));
    }
    return next(e);
  }
};
const patchAvatarUsers = async (req, res, next) => {
  //обновить данные аватарки
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar: req.body.avatar },
      {
        new: true, // обработчик then получит на вход обновлённую запись
        runValidators: true, // данные будут валидированы перед изменением
      }
    );

    return res.status(GOOD.code).json(user);
  } catch (e) {
    if (e.name === "ValidationError") {
      return next(new NecorrectDataError("Переданы некорректные данные"));
    }
    return next(e);
  }
};
const getUserId = async (req, res, next) => {
  //получить отдельного пользователя

  try {
    const { _id } = req.params;
    const user = await User.findById(_id);

    if (user === null) {
      throw new NotFoundError("Нет пользователя c таким id");
    }
    return res.status(GOOD.code).json({
      name: user.name,
      about: user.about,
      email: user.email,
      avatar: user.avatar,
      _id: user._id,
    });
  } catch (e) {
    console.error(e);
    if (e.name === "CastError") {
      return next(new NecorrectDataError("Переданы некорректные данные"));
    }
    return next(e);
  }
};
module.exports = {
  getUsers,
  getUser,
  createUser,
  patchUsers,
  patchAvatarUsers,
  login,
  getUserId,
};
