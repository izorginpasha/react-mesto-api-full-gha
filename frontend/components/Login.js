import React from 'react'
import { Route, Switch, BrowserRouter } from 'react-router-dom'

function Login(props) {
  const [email, setEmail] = React.useState('') // email
  const [password, setPassword] = React.useState('') // хоби профиля
  function handleClick(e) {
    e.preventDefault()
    props.handleLogin(password, email)
    setEmail('')
    setPassword('')
  }
  function emailName(e) {
    setEmail(e.target.value)
  }
  function passwordDescription(e) {
    setPassword(e.target.value)
  }
  return (
    <Route exact path="/sign-in">
      <div className="content">
        <div className="register">
          <form
            className="register__form"
            id="registerForm"
            name="register-form"
            onSubmit={handleClick}
          >
            <h3 className="register__title">{props.title}</h3>
            <input
              className="register__input"
              type="email"
              id="registerEmail"
              name="register-email"
              required
              minLength={2}
              maxLength={40}
              placeholder="email"
              onChange={emailName}
              value={email || ''}
            />
            <span className="popup__error" id="span-register-email"></span>
            <input
              className="register__input"
              type="text"
              id="registerPassword"
              name="register-password"
              required
              minLength={2}
              maxLength={200}
              placeholder="Пароль"
              onChange={passwordDescription}
              value={password || ''}
            />
            <span className="popup__error" id="span-register-password"></span>
            <button
              className="register__button"
              //disabled
              type="submit"
              id="registerButton"
              
            >
              <span className="register__button-title">Войти</span>
            </button>
          </form>
        </div>
      </div>
    </Route>
  )
}
export default Login
