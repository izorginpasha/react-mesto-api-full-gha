const mongoose = require("mongoose");
const validator = require('validator');
const { celebrate, Joi, Segments } = require('celebrate');
// Опишем схему:

const userSchema = new mongoose.Schema({
  name: {
    // имя пользователя
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто'
  },

  about: {
    // информация о пользователе
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь'
  },
  avatar: {
    // ссылка на аватарку
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (v) => validator.isURL(v),
      message: 'Некорректный URL',
    }
  },
  email: {
    type: String,
    required: true,
    index: {unique: true, dropDups: true}
  },
  password: {
    type: String,
    required: true,
    select: false
  },
});

// создаём модель и экспортируем её
const model = mongoose.model("user", userSchema);
module.exports = model;
