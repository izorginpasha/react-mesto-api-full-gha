import React from 'react'
import { api } from '../utils/Api.js'
import Card from './Card.js'
import { CurrentUserContext } from '../contexts/CurrentUserContext.js'
import { ContextCard, contextCard } from '../contexts/ContextCard.js'
import Header from './Header.js' // прошу любить и жаловать компонент header
function Main(props) {
  const сurrentUser = React.useContext(CurrentUserContext)

  return (
    <>
      <Header
        root="/sign-in"
        title="Выйти"
        email={props.email}
        outClick={props.outClick}
      />
      <main className="content">
        <section className="profile">
          <div className="profile__block">
            <img
              alt={сurrentUser.name}
              className="profile__avatar"
              style={{ backgroundImage: `url(${сurrentUser.avatar})` }}
            />
            <div
              onClick={props.isEditAvatarPopupOpen}
              className="profile__overlay"
            ></div>
          </div>
          <div className="profile__info">
            <div className="profile__container">
              <h1 className="profile__fio">{сurrentUser.name}</h1>
              <button
                onClick={props.isEditProfilePopupOpen}
                className="profile__edit-button"
                type="button"
              ></button>
            </div>
            <p className="profile__hobby">{сurrentUser.about}</p>
          </div>
          <button
            onClick={props.isAddPlacePopupOpen}
            className="profile__add-button"
            type="button"
          ></button>
        </section>
        <section className="element">
          <ul className="element__container">
            {props.cards.map((card) => (
              <li className="element-item" key={card._id}>
                <ContextCard.Provider value={card}>
                  <Card
                    card={card}
                    onCardClick={props.onCardClick}
                    onCardLike={props.onCardLike}
                    onCardDelete={props.onCardDelete}
                  />
                </ContextCard.Provider>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </>
  )
}
export default Main
