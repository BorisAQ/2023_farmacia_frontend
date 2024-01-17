import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';

import { AuthContext } from '../../context/auth-context';
import './NavLinks.css';

const NavLinks = props => {
  const auth = useContext(AuthContext);
  const userId = auth.userId;
  return (
    <ul className="nav-links">
      <li>
        <NavLink to="/" exact>
          TODAS
        </NavLink>
      </li>
      {auth.isLoggedIn && (
        <li>
          <NavLink to={`/${userId}/messages`}>RECETAS</NavLink>
        </li>
      )}

      {auth.isLoggedIn && (
        <li>
          <NavLink to={`/servicios`} exact >SERVICIOS</NavLink>
        </li>
      )}

      {auth.isLoggedIn && (
        <li>
          <NavLink to={`/servicios/new`} exact >ADD SERVICIO</NavLink>
        </li>
      )}

      {auth.isLoggedIn && (
        <li>
          <NavLink to="/messages/new">NUEVA</NavLink>
        </li>
      )}
      {!auth.isLoggedIn && (
        <li>
          <NavLink to="/auth">INGRESAR</NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <button onClick={auth.logout}>LOGOUT</button>
        </li>
      )}
    </ul>
  );
};

export default NavLinks;
