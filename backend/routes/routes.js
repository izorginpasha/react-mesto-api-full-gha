const router = require("express").Router();
const { celebrate, Joi, Segments } = require("celebrate");
const {
  getUserId,
  getUsers,
  getUser,
  createUser,
  patchUsers,
  patchAvatarUsers,
} = require("../controllers/users");
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards')
const shemaUser = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30).default("Жак-Ив Кусто"), // имя пользователя
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    about: Joi.string().min(2).max(30).default("Исследователь"), // информация о пользователе
    avatar: Joi.string()
      .pattern(new RegExp("(www|http:|https:)+S*"))
      .default(
        "https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png"
      ), // ссылка на аватарку
  }),
});
const shemaCards = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),// имя
    link: Joi.string().pattern (new RegExp('(www|http:|https:)+\S*')).required(),// ссылка
    likes:Joi.object().default([]),
    createdAt: Joi.date().default(Date.now),
  }),
})

// users

router.get("/users", getUsers); //Возвращаеть всех пользователей
router.get("/users/me", getUser); //возвращает текущего пользователя
router.get(
  "/users/:_id",
  // celebrate({
  //   [Segments.PARAMS]: Joi.object().keys({
  //     _id: Joi.string().length(24).hex(),
  //   }),
  // }),
  getUserId
); //возвращает  пользователя по id
router.post("/users", shemaUser, createUser); //создает пользователя
router.patch(
  "/users/me",
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      email: Joi.string().email(),
      password: Joi.string(),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().pattern(new RegExp("(www|http:|https:)+S*")),
    }),
  }),
  patchUsers
); //обновляет профиль
router.patch(
  "/users/me/avatar",
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      avatar: Joi.string()
        .pattern(new RegExp("(www|http:|https:)+S*")), // ссылка на аватарку
    }),
  }),
  patchAvatarUsers
); //обновляет аватар
// cards
router.get('/cards', getCards) //Возвращаеть все карточки
router.post('/cards',shemaCards, createCard) //создает карточку
router.delete('/cards/:cardId', celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    cardId: Joi.string().length(24).hex(),
  }),
}),deleteCard) //удаляет карточку
router.put('/cards/:cardId/likes', celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    cardId: Joi.string().length(24).hex(),
  }),
}), likeCard) // ставит лайк
router.delete('/cards/:cardId/likes', celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    cardId: Joi.string().length(24).hex(),
  }),
}), dislikeCard) //удаляет лайк
module.exports = router;
