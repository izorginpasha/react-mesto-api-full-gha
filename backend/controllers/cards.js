const Card = require("../models/card");
const User = require("../models/user");
const NotFoundError = require("../erors/NotFoundError");
const NecorrectDataError = require("../erors/NecorrectDataError");
const ErorsDelCard = require("../erors/ErorsDelCard");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { GOOD, CREATE_GOOD, key } = require("../utils/constants");
const getCards = async (req, res, next) => {
  //получить список карточек

  try {
    const cards = await Card.find({}).populate(["owner", "likes"]);
    return res.status(GOOD.code).json(cards);
  } catch (e) {
    console.error(e);
    return next(e);
  }
};
const createCard = async (req, res, next) => {
  //создать карточку
  try {
    const card = await Card.create({
      name: req.body.name,
      link: req.body.link,
      owner: req.user,
    });
    return res.status(CREATE_GOOD.code).json(card);
  } catch (e) {
    console.error(e);
    if (e.name === "ValidationError") {
      return next(new NecorrectDataError("Переданы некорректные данные"));
    }
    return next(e);
  }
};
const deleteCard = async (req, res, next) => {
  //удалить карточку
  try {
    const { cardId } = req.params;
    const cardOne = await Card.findById(cardId);
    if (cardOne === null) {
      throw new NotFoundError("Нет такои карточки");
    }
    const userOne = await User.findById(req.user._id);
    if (cardOne.owner.equals(userOne.id)) {
      const card = await Card.findByIdAndRemove(cardId);

      return res.status(GOOD.code).json(GOOD.message);
    }
    throw new ErorsDelCard("Попытка удалить чужую карточку");
  } catch (e) {
    console.error(e);
    if (e.name === "CastError") {
      return next(new NecorrectDataError("Переданы некорректные данные"));
    }
    return next(e);
  }
};
const likeCard = async (req, res, next) => {
  //лайк карточки
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user } }, // добавить User в массив, если его там нет
      { new: true }
    );
    if (card === null) {
      throw new NotFoundError("Нет такои карточки");
    }
    const newCard = await Card.findOne({ _id: req.params.cardId }).populate([
      "owner",
      "likes",
    ]);


    return res.status(GOOD.code).json(newCard);
  } catch (e) {
    console.error(e);
    if (e.name === "CastError") {
      return next(new NecorrectDataError("Переданы некорректные данные"));
    }
    return next(e);
  }
};
const dislikeCard = async (req, res, next) => {
  //дизлайк карточки
  if (req.params.cardId === null) {
    throw new NotFoundError("Нет такои карточки");
  }
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } }, // убрать _id из массива
      { new: true }
    );
    if (card === null) {
      throw new NotFoundError("Нет такои карточки");
    }
    const newCard = await Card.findOne({ _id: req.params.cardId }).populate([
      "owner",
      "likes",
    ]);
    return res.status(GOOD.code).json(newCard);
  } catch (e) {
    console.error(e);
    if (e.name === "CastError") {
      return next(new NecorrectDataError("Переданы некорректные данные"));
    }
    return next(e);
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
