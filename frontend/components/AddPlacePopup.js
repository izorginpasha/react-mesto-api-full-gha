import React from 'react'
import PopupWithForm from './PopupWithForm.js'
function AddPlacePopup(props) {
  const [name, setName] = React.useState('') // название картинки
  const [link, setLink] = React.useState('') // ссылка
  function handleSubmit(e) {
    e.preventDefault()
    props.onAddPlaceSubmit({
      popupName: name,
      popupLink: link,
    })
  }
  function getName(e) {
    setName(e.target.value)
  }
  function getlink(e) {
    setLink(e.target.value)
  }
  React.useEffect(() => {
    //обнуление полей
    function zeroing() {
      setName('')
      setLink('')
    }
    zeroing()
  }, [props.isOpen])
  return (
    <PopupWithForm
      name="#popupNewMesto"
      title="Новое место"
      children={
        <>
          <input
            onChange={getName}
            value={name || ''}
            className="popup__text "
            type="text"
            id="popupName"
            name="popup-name"
            placeholder="Название"
            required
            minLength={2}
            maxLength={30}
          />
          <span className="popup__error" id="span-popup-name"></span>
          <input
            onChange={getlink}
            value={link || ''}
            className="popup__text"
            type="url"
            id="popupLink"
            name="popup-Link"
            placeholder="Ссылка на картинку"
            required
          />
          <span className="popup__error" id="span-popup-Link"></span>
        </>
      }
      isOpen={props.isOpen}
      onClose={props.onClose}
      onSubmit={handleSubmit}
      buttonText={props.buttonText}
    />
  )
}
export default AddPlacePopup
