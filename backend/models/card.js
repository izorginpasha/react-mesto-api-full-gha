const mongoose = require('mongoose')
const validator = require('validator');
const userSchema = new mongoose.Schema({
  name: {
    // имя
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    //
    type: String,
    required: true,
    validate: {
      validator: (v) => validator.isURL(v),
      message: 'Некорректный URL',
    }
  },
  owner: {
    //
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      default: [],
    },
  ],

  createdAt: {
    //
    type: Date,
    default: Date.now,
  },
})

// создаём модель и экспортируем её
const model = mongoose.model('card', userSchema)
module.exports = model
