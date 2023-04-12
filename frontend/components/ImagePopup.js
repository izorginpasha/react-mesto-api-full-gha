import React from 'react'

function ImagePopup(props) {
  return (
    <div
      className={`popup popup_image-background ${
        props.isOpen && 'popup_opened'
      }`}
      id="popupImage"
    >
      <div className="popup__overlay"></div>
      <div className="popup__container-image">
        <img
          className="popup__image"
          src={props.card.link}
          alt={props.card.name}
        />
        <p className="popup__image-title">{props.card.name}</p>
        <button
          className="popup__close"
          aria-label="close"
          onClick={props.onClose}
          type="button"
        ></button>
      </div>
    </div>
  )
}
export default ImagePopup
