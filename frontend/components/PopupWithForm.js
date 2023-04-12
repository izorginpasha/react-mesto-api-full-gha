import React from 'react'

function PopupWithForm(props) {
  return (
    <div className={`popup ${props.isOpen && 'popup_opened'}`} id={props.name}>
      <div className="popup__overlay"></div>
      <div className="popup__container">
        <form
          className="popup__form"
          id={`popupForm${props.name}`}
          name={`popup-form-${props.name}`}
          onSubmit={props.onSubmit}
        >
          <h3 className="popup__title">{props.title}</h3>
          {props.children}
          <button
            className="popup__button"
            //disabled
            type="submit"
            id="button"
          >
            <span className="popup__button-title">{props.buttonText}</span>
          </button>
        </form>
        <button
          className="popup__close"
          aria-label="close"
          type="button"
          onClick={props.onClose}
        ></button>
      </div>
    </div>
  )
}
export default PopupWithForm
