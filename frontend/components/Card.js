import React from "react";
import { ContextCard, contextCard } from "../contexts/ContextCard.js";
import { CurrentUserContext } from "../contexts/CurrentUserContext.js";
function Card(props) {
  const contetentCard = React.useContext(ContextCard);
  const сurrentUsercontext = React.useContext(CurrentUserContext);
  // Определяем, являемся ли мы владельцем текущей карточки
console.log(contetentCard.owner);
console.log(сurrentUsercontext._id);

  const isOwn = contetentCard.owner.id === сurrentUsercontext._id

  // Создаём переменную, которую после зададим в `className` для кнопки удаления
  const cardDeleteButtonClassName = `element-item__basket ${
    isOwn ? "element-item__basket_open" : ""
  }`;
  // Определяем, есть ли у карточки лайк, поставленный текущим пользователем
  const isLiked = contetentCard.likes.some(
    (i) => i._id === сurrentUsercontext._id
  );

  // Создаём переменную, которую после зададим в `className` для кнопки лайка
  const cardLikeButtonClassName = `element-item__heart ${
    isLiked ? "element-item__heart_like" : ""
  }`;
  function handleClick() {
    props.onCardClick(contetentCard);
  }
  function handleLikeClick() {
    props.onCardLike(contetentCard);
  }
  function handleDeleteClick() {
    props.onCardDelete(contetentCard);
  }

  return (
    <>
      <button
        className={cardDeleteButtonClassName}
        aria-label="delete"
        type="button"
        onClick={handleDeleteClick}
      ></button>
      <div
        className="element-item__image"
        onClick={handleClick}
        src=""
        alt={contetentCard.name}
        style={{ backgroundImage: `url(${contetentCard.link})` }}
      ></div>
      <div className="element-item__content">
        <h2 className="element-item__title">{contetentCard.name}</h2>
        <div className="element-item__grop">
          <button
            className={cardLikeButtonClassName}
            type="button"
            onClick={handleLikeClick}
          ></button>
          <p className="element-item__number-like">
            {contetentCard.likes.length}
          </p>
        </div>
      </div>
    </>
  );
}
export default Card;
