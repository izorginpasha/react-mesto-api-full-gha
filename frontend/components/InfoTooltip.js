import React from 'react'

function InfoTooltip(props) {
  return (
    <div className={`popup ${props.isOpen && 'popup_opened'}`} id={props.name}>
      <div className="popup__overlay"></div>
      <div className="popup__container">
        {props.regIn ? (
          <>
            {' '}
            <div className="popup__icon popup__icon_good"></div>
            <h3 className="popup__title popup__title_info">
              {props.title}
            </h3>
          </>
        ) : (
          <>
            {' '}
            <div className="popup__icon "></div>
            <h3 className="popup__title popup__title_info">
            {props.title}
            </h3>
          </>
        )}

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
export default InfoTooltip
