const bodyParser = require("body-parser");
const express = require("express"); //
const mongoose = require("mongoose"); //
const routerUsers = require("./routes/routerUsers"); //
const routerCards = require("./routes/routerCards"); //
const auth = require("./middlewares/auth");
const { Console } = require("console");
const { errors } = require("celebrate");
const { login, createUser } = require("./controllers/users");
const NotFoundError = require("./erors/NotFoundError");
const path = require("path");
const { requestLogger, errorLogger } = require('./middlewares/logger');
// Слушаем 3000 порт
const { celebrate, Joi, Segments } = require("celebrate");
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

const { PORT = 3000 } = process.env; //порт
const app = express(); //создаем сервер
// подключаем мидлвары, роуты и всё остальное...
app.use(bodyParser.json());
// подключаем главный роутер приложения на /api

// роуты, не требующие авторизации,
app.use(express.static(path.join(__dirname, "public")));
app.post("/signup", shemaUser, createUser);
app.post("/signin", shemaUser, login);
// раздаём папку с собранным фронтендом

// авторизация
app.use("/api/users", auth, routerUsers); //роуты на пути user
app.use("/api/cards", auth, routerCards); //роуты на пути Cards

app.get("*", function (req, res) {
  res.redirect("/");
});


try {
  app.all("*", function (req, res) {
    //обработка неправильных путей
    console.log("404 handler..");
    throw new NotFoundError("неверныи путь");

    // res.status(404).json({ message: "Произошла ошибка" });
  });
} catch {
  next(err);
}

try {
  mongoose.connect("mongodb://127.0.0.1:27017/mestodb", {}, () => {
    console.log("Connected MongoDB");
    app.listen(PORT, () => {
      //запуск сервера
      // Если всё работает, консоль покажет, какой порт приложение слушает
      console.log(`App listening on port ${PORT}`);
    });
  });
} catch {
  console.log("not connected MongoDB");
}
app.use(requestLogger); // подключаем логгер запросов
app.use(errors());// обработчик ошибок celebrate
app.use((err, req, res, next) => {// централизованный обработчик ошибок
  res.status(err.statusCode).send({ message: err.message });
});
