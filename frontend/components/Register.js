import React from 'react'
import {
  Link,
  NavLink,
  Route,
  Switch,
  BrowserRouter,
  useParams,
  useHistory,
} from 'react-router-dom'

function Register(props) {
  const [email, setEmail] = React.useState('') // email
  const [password, setPassword] = React.useState('') // хоби профиля
  const handleClick=(e)=>{
    e.preventDefault()
    props.handleRegister(password, email)
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
    <Switch>
      <Route exact path="/sign-up">
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
                <span className="register__button-title">
                  Зарегистрироавться
                </span>
              </button>
              <Link to="/sign-in" className="register__link">
                Уже зарегистрированны? Войти
              </Link>
            </form>
          </div>
        </div>
      </Route>
    </Switch>
  )
}
export default Register
