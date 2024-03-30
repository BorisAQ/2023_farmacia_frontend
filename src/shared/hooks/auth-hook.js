import {useState, useCallback, useEffect} from 'react';
//import { useDispatch , useSelector} from 'react-redux';
//import { loginUser, logoutUser} from '../../redux/userSlice';


let logoutTimer;



export const useAuth =()=>{
    //const user= useSelector((state)=>state.user);
  //  const dispatch = useDispatch();
    const [token, setToken] = useState(false);
    const [tokenExpirationDate, setTokenExpirationDate] = useState();
    const [userId, setUserId] = useState(false);
    const [servicio, setServicio] = useState(false);
    const [prestaciones, setPrestaciones] = useState(false);
    const [fechaActualizacionPoblacion, setFechaActualizacionPoblacion] = useState(false);
    const [rol, setRol] = useState(0);      
    
    const login = useCallback((uid, token, servicio, prestaciones, fechaActualizacionPoblacion, rol, expirationDate) => {
      setToken(token);
      setUserId(uid);
      setServicio(servicio);
      setPrestaciones (prestaciones);
      setFechaActualizacionPoblacion (fechaActualizacionPoblacion);
      setRol(rol);
      const tokenExpirationDate =
        expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
        
      setTokenExpirationDate(tokenExpirationDate);
      /*dispatch(loginUser  ({
          userId: uid,
          token: token,
          expiration: tokenExpirationDate.toISOString(),
          servicio: servicio,
          prestaciones: prestaciones
        }))  ;*/
 
       localStorage.setItem(
        'userData',
        JSON.stringify({
          userId: uid,
          token: token,
          expiration: tokenExpirationDate.toISOString(),
          servicio: servicio,
          prestaciones: prestaciones,
          fechaActualizacionPoblacion: fechaActualizacionPoblacion,
          rol: rol
        })
      );
    }, []);
  
    const logout = useCallback(() => {
      setToken(null);
      setTokenExpirationDate(null);
      setUserId(null);
      setServicio(null);
      setPrestaciones (null);
      setFechaActualizacionPoblacion (null);
      setRol(null);
      localStorage.removeItem('userData');      
      //dispatch(logoutUser  ({    }))  ;
    }, []);
  
    useEffect(() => {
      if (token && tokenExpirationDate) {
        const remainingTime = tokenExpirationDate.getTime() - new Date().getTime();
        logoutTimer = setTimeout(logout, remainingTime);
      } else {
        clearTimeout(logoutTimer);
      }
    }, [token, logout, tokenExpirationDate]);
  
    useEffect(() => {
      const storedData = JSON.parse(localStorage.getItem('userData'));
      //const storedData = user;
      
      if (
        storedData &&
        storedData.token &&
        new Date(storedData.expiration) > new Date()
      ) {        
        login(storedData.userId, storedData.token, storedData.servicio, storedData.prestaciones, storedData.fechaActualizacionPoblacion, storedData.rol,new Date(storedData.expiration));
      }
    }, [login]);
  
    return {token, login, logout, userId, servicio, fechaActualizacionPoblacion, prestaciones, rol};
}