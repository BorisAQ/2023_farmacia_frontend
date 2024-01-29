import {useState, useCallback, useEffect} from 'react';
let logoutTimer;

export const useAuth =()=>{
    const [token, setToken] = useState(false);
    const [tokenExpirationDate, setTokenExpirationDate] = useState();
    const [userId, setUserId] = useState(false);
    const [servicio, setServicio] = useState(false);
    const [prestaciones, setPrestaciones] = useState(false);
  
    const login = useCallback((uid, token, servicio, prestaciones, expirationDate) => {
      setToken(token);
      setUserId(uid);
      setServicio(servicio);
      setPrestaciones (prestaciones);
      const tokenExpirationDate =
        expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
        
      setTokenExpirationDate(tokenExpirationDate);
      localStorage.setItem(
        'userData',
        JSON.stringify({
          userId: uid,
          token: token,
          expiration: tokenExpirationDate.toISOString(),
          servicio: servicio,
          prestaciones: prestaciones
        })
      );
    }, []);
  
    const logout = useCallback(() => {
      setToken(null);
      setTokenExpirationDate(null);
      setUserId(null);
      setServicio(null);
      setPrestaciones (null);
      localStorage.removeItem('userData');
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
      if (
        storedData &&
        storedData.token &&
        new Date(storedData.expiration) > new Date()
      ) {
        login(storedData.userId, storedData.token, storedData.servicio, storedData.prestaciones,  new Date(storedData.expiration));
      }
    }, [login]);
  
    return {token, login, logout, userId, servicio, prestaciones};
}