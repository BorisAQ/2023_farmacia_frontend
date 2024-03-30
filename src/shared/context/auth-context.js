import { createContext } from 'react';

export const AuthContext = createContext({
  isLoggedIn: false,
  userId: null,
  token: null,
  servicio:null,
  prestaciones:null,  
  fechaActualizacionPoblacion:null, 
  rol: null,
  login: () => {},
  logout: () => {},
  
});
