const routerCards = require('express').Router()
const { celebrate, Joi, Segments } = require('celebrate');
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards')
const shemaCards = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),// имя
    link: Joi.string().pattern (new RegExp('(www|http:|https:)+\S*')).required(),// ссылка
    likes:Joi.object().default([]),
    createdAt: Joi.date().default(Date.now),
  }),
})
routerCards.get('/', getCards) //Возвращаеть все карточки
routerCards.post('/',shemaCards, createCard) //создает карточку
routerCards.delete('/:cardId', celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    cardId: Joi.string().length(24).hex(),
  }),
}),deleteCard) //удаляет карточку
routerCards.put('/:cardId/likes', celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    cardId: Joi.string().length(24).hex(),
  }),
}), likeCard) // ставит лайк
routerCards.delete('/:cardId/likes', celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    cardId: Joi.string().length(24).hex(),
  }),
}), dislikeCard) //удаляет лайк

module.exports = routerCards
