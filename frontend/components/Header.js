import React from 'react'
import logo from '../images/logo.svg'
import Login from './Login.js'
import Register from './Register.js'
import { Link, NavLink, Switch, Route, useRouteMatch } from 'react-router-dom'

function Header(props) {
  return (
    <header className={`header ${props.mobil ? 'header_mobil' : ''}`}>
      <img className="header__logo" src={logo} alt="логотип" />
      <div
        className={`header__conteiner ${
          props.mobil ? 'header__conteiner_mobil' : ''
        }`}
      >
        <h2 className="header__email">{props.email}</h2>
        <Link
          to={props.root}
          onClick={props.outClick}
          className={`header__title ${
            props.mobil ? 'header__title_mobil' : ''
          }`}
        >
          {props.title}
        </Link>
      </div>
    </header>
  )
}
export default Header
