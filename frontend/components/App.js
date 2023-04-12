import React from "react";
import { Route, Redirect, useHistory } from "react-router-dom";
import Main from "./Main.js";
import Footer from "./Footer.js";
import PopupWithForm from "./PopupWithForm.js";
import ImagePopup from "./ImagePopup.js";
import EditProfilePopup from "./EditProfilePopup.js";
import InfoTooltip from "./InfoTooltip.js";
import EditAvatarPopup from "./EditAvatarPopup.js";
import AddPlacePopup from "./AddPlacePopup.js";
import ProtectedRoute from "./ProtectedRoute.js";
import Header from "./Header.js"; // прошу любить и жаловать компонент header
import Login from "./Login.js";
import Register from "./Register.js";
import { api } from "../utils/Api.js";
import * as Auth from "../utils/Auth.js";

import {
  CurrentUserContext
} from "../contexts/CurrentUserContext.js";
function App(props) {
  const history = useHistory();
  const [currentUsercontext, setCurrentUser] = React.useState({}); // стеит данных пользователя
  const [isEditProfilePopupOpen, setEditProfilePopupOpen] = React.useState(
    // стеит открытия попап профиль
    false
  );
  const jwt = localStorage.getItem("jwt");
  const [regIn, setRegIn] = React.useState(false);
  const [regTitle, setRegTegIn] = React.useState("");
  const [isAddPlacePopupOpen, setAddPlacePopupOpen] = React.useState(false); // стеит открытия попап карточки создания
  const [isEditAvatarPopupOpen, setEditAvatarPopupOpen] = React.useState(false); // стеит открытия попап смена аватара
  const [isinfoPopupOpen, setInfoPopupOpen] = React.useState(false); // стеит открытия попап инфо
  const [selectedCard, setSelectedCard] = React.useState(false); // стеит открытия попап картинки

  const [card, setCard] = React.useState({}); // стеит открытия попап картинки
  const [cards, setCards] = React.useState([]); //массив карточек

  //const сurrentUser = React.useContext(CurrentUserContext) // данные пользователя
  const [loggedIn, setLoggedIn] = React.useState(false); //статус пользователя
  //const [userData, setUserData] = React.useState({}); // данные пользователя
  function handleCardLike(card) {
    // обрабочик лаика
    // Снова проверяем, есть ли уже лайк на этой карточке
    const isLiked = card.likes.some((i) => i._id === currentUsercontext._id);
    // Отправляем запрос в API и получаем обновлённые данные карточки
    if (!isLiked) {
      api
        .like(card._id)
        .then((newCard) => {
          setCards((cards) =>
            cards.map((c) => (c._id === card._id ? newCard : c))
          );
        })
        .catch((err) => {
          console.log(err); // выведем ошибку в консоль
        });
    } else {
      api
        .delLike(card._id, isLiked)
        .then((newCard) => {
          setCards((cards) =>
            cards.map((c) => (c._id === card._id ? newCard : c))
          );
        })
        .catch((err) => {
          console.log(err); // выведем ошибку в консоль
        });
    }
  }
  function handleCardDelete(card) {
    // удаление карточки
    api
      .delCard(card._id)
      .then((result) => {
        setCards((cards) =>
          cards.filter((n) => (n._id === card._id ? false : true))
        );
      })
      .catch((err) => {
        console.log(err); // выведем ошибку в консоль
      });
  }

  React.useEffect(() => {
    //проверка  jwt токена
    function tokenCheck() {
      if (jwt) {
        const jwt = localStorage.getItem("jwt");
        Auth.getContent(jwt)
          .then((res) => {
            if (res) {
              // setUserData(res);
              setLoggedIn(true);
              Object.assign(currentUsercontext, res);
            }
          })
          .catch((err) => {
            console.log(err); // выведем ошибку в консоль
          });
      }
    }
    tokenCheck();
  }, [jwt]);
  
  React.useEffect(() => {
    function userCards() {
      // полуление массива карточек
      if (loggedIn) {
        api
          .getInitialCards()
          .then((result) => {
            setCards(result);
          })
          .catch((err) => {
            console.log(err); // выведем ошибку в консоль
          });
      }
    }
    userCards();
  }, [loggedIn]);
  function handleRegister(password, email) {
    //запрос регистрации

    Auth.register(password, email)
      .then((res) => {
        if (res) {
          setRegIn(true);
          setRegTegIn("Вы успешно зарегистрировались!");
          setInfoPopupOpen(true);
          history.push("/sign-in");
        }
      })
      .catch((err) => {
        setRegIn(false);
        setRegTegIn("Что-то пошло не так! Попробуйте ещё раз.");
        setInfoPopupOpen(true);
        console.log(err); // выведем ошибку в консоль
      });
  }
  function handleLogin(password, email) {
    //запрос авторизации
    Auth.authorize(password, email)
      .then((res) => {
        if (res) {
          localStorage.setItem("jwt", res.token);
          setLoggedIn(true);
          // window.location.reload()// не подключать
        }
      })
      .catch((err) => {
        setRegIn(false);
        setRegTegIn("Что-то пошло не так! Попробуйте ещё раз.");
        setInfoPopupOpen(true);
        console.log(err); // выведем ошибку в консоль
      });
  }
  function outClick() {
    //выход из профиля
    localStorage.removeItem("jwt");
    setLoggedIn(false);
  }

  function handleCardClick(card) {
    // обрабочик клика клика по каринке

    setCard(() => card);
    setSelectedCard(true);
  }
  function handleEditAvatarClick() {
    // обрабочик смены аватара
    setEditAvatarPopupOpen(true);
  }
  function handleEditProfileClick() {
    // обрабочик смены данных профиля
    setEditProfilePopupOpen(true);
  }
  function handleAddPlaceClick() {
    // обрабочик добавления карточки
    setAddPlacePopupOpen(true);
  }
  function closeAllPopups() {
    // обрабочик закрытия попап

    setEditProfilePopupOpen(false);
    setAddPlacePopupOpen(false);
    setEditAvatarPopupOpen(false);
    setInfoPopupOpen(false);
    setSelectedCard(false);
  }
  function handleUpdateUser({ name, about }) {
    // обрабочик добавления данных профиля

    api
      .setUserProfile(name, about)
      .then((result) => {
        setCurrentUser(result);
        Object.assign(currentUsercontext, result); // добавляем результат запроса на страницу
        setEditProfilePopupOpen(false); //закрываем окно
      })
      .catch((err) => {
        console.log(err); // выведем ошибку в консоль
      })
      .finally(() => {
        // popupProfile.buttonSpan.textContent = "Сохранить";
      });
  }
  function handleUpdateAvatar({ avatar }) {
    // обновление аватара
    api
      .setUserAvatar(avatar)
      .then((result) => {
        Object.assign(currentUsercontext, result); // добавляем результат запроса на страницу
        setEditAvatarPopupOpen(false); //закрываем окно
      })
      .catch((err) => {
        console.log(err); // выведем ошибку в консоль
      })
      .finally(() => {
        //popupNewAvatar.buttonSpan.textContent="Сохранить";
      });
  }
  function handleAddPlaceSubmit({ popupName, popupLink }) {
    // функция обрабочик кнопки создать карточку

    api
      .setCard(popupName, popupLink)
      .then((result) => {
        console.log(result)
        setCards(() => [result, ...cards]);
        setAddPlacePopupOpen(false);
  
      })
      .catch((err) => {
        console.log(err); // выведем ошибку в консоль
      })
      .finally(() => {
        // popupNewMesto.buttonSpan.textContent = "Сохранить";
      });
  }
  return (
    <CurrentUserContext.Provider value={currentUsercontext}>
      <div className="page">
        <div className="page__container">
          <ProtectedRoute
            path="/"
            loggedIn={loggedIn}
            isEditProfilePopupOpen={handleEditProfileClick}
            isAddPlacePopupOpen={handleAddPlaceClick}
            isEditAvatarPopupOpen={handleEditAvatarClick}
            onCardClick={handleCardClick}
            cards={cards}
            onCardLike={handleCardLike}
            onCardDelete={handleCardDelete}
            component={Main}
            outClick={outClick}
            email={currentUsercontext.email}
          />

          <Route exact path="/sign-in">
            <>
              <Header
                root="/sign-up"
                title="Регистрация"
                email=""
                mobil={true}
              />
              <Login title="Вход" handleLogin={handleLogin} />
            </>
          </Route>
          <Route exact path="/sign-up">
            <>
              <Header root="/sign-in" title="Войти" email="" mobil={true} />
              <Register title="Регистрация" handleRegister={handleRegister} />
            </>
          </Route>
          <ProtectedRoute path="/" loggedIn={loggedIn} component={Footer} />
          <Route>
            {loggedIn ? <Redirect to="/" /> : <Redirect to="/sign-in" />}
          </Route>

          <EditProfilePopup
            isOpen={isEditProfilePopupOpen}
            onClose={closeAllPopups}
            onUpdateUser={handleUpdateUser}
            buttonText="Сохранить"
          />
          <EditAvatarPopup
            isOpen={isEditAvatarPopupOpen}
            onClose={closeAllPopups}
            onUpdateAvatar={handleUpdateAvatar}
            buttonText="Сохранить"
          />
          <AddPlacePopup
            isOpen={isAddPlacePopupOpen}
            onClose={closeAllPopups}
            onAddPlaceSubmit={handleAddPlaceSubmit}
            buttonText="Создать"
          />
          <PopupWithForm
            name="#popupDelCard"
            title="Вы уверены?"
            children={""}
            isOpen={false}
            onClose={closeAllPopups}
          />
          <InfoTooltip
            name="#popupInfo"
            title={regTitle}
            regIn={regIn}
            isOpen={isinfoPopupOpen}
            onClose={closeAllPopups}
          />
          <ImagePopup
            isOpen={selectedCard}
            onClose={closeAllPopups}
            card={card}
          />
        </div>
      </div>
    </CurrentUserContext.Provider>
  );
}
export default App;
