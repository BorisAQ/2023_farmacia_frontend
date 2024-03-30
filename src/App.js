import React,{Suspense} from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from 'react-router-dom';

import MainNavigation from './shared/components/Navigation/MainNavigation';
import { AuthContext } from './shared/context/auth-context';
import { useAuth } from './shared/hooks/auth-hook';
import LoadingSpinner from './shared/components/UIElements/LoadingSpinner';


const Usuarios = React.lazy(()=> import('./usuarios/pages/Usuarios'));
const NewUsuario = React.lazy ( ()=>import ('./usuarios/pages/NewUsuario'));
const UpdateUsuario = React.lazy (()=>import ('./usuarios/pages/UpdateUsuario'));
const UpdateMessage = React.lazy(()=> import('./message/pages/UpdateMessage'));
const Servicios = React.lazy(()=> import('./servicio/pages/Servicios'));
const NewServicio = React.lazy(()=> import('./servicio/pages/newService'));
const UpdateServicio = React.lazy(()=> import('./servicio/pages/updateService'));
const Recetas = React.lazy(()=> import('./recetas/pages/Recetas'));
const UpdateReceta = React.lazy(()=> import('./recetas/pages/UpdateReceta'));
const NewReceta = React.lazy(()=> import('./recetas/pages/NewReceta'));
const Auth = React.lazy(()=> import('./user/pages/Auth'));

const App = () => {
  const {token, login, logout, userId, servicio, prestaciones,fechaActualizacionPoblacion, rol} = useAuth()
  let routes;

  if (token) {
    routes = (
      <Switch>
        <Route path="/" exact>
          
        </Route>
        <Route path = "/usuarios" exact>
          { rol ===1 && <Usuarios/>} 
        </Route>
        <Route path = "/newUsuario" exact>
          { rol ===1 && <NewUsuario/>} 
        </Route>
        <Route path = "/updateUsuario/:usuarioId" exact>
          { rol ===1 && <UpdateUsuario/>} 
        </Route>
        <Route path="/servicios" exact>
          { rol === 1  && <Servicios/>}
        </Route>
        <Route path="/servicios/new" exact>
          {rol ===1 ? <NewServicio />: <></>}
          
        </Route>
        <Route path="/servicios/:servicioId" exact>
          <UpdateServicio />
        </Route>
        <Route path="/messages/:messageId">
          <UpdateMessage/>
        </Route>
        <Route path="/recetas/:servicioId/recetas" exact>
          <Recetas/>
        </Route>
        <Route path="/recetas/new" exact>
          <NewReceta/>
        </Route>
        
        <Route path="/recetas/:recetaId" exact>
          <UpdateReceta/>
        </Route>
        
        <Redirect to="/" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/" exact>
          
        </Route>
        
        <Route path="/auth">
          <Auth />
        </Route>
        
        <Redirect to="/auth" />
      </Switch>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        servicio: servicio,
        login: login,
        logout: logout,
        prestaciones: prestaciones  ,
        fechaActualizacionPoblacion: fechaActualizacionPoblacion      ,
        rol: rol
      }}
    >
      <Router>
        <MainNavigation />
        <main>
          <Suspense fallback={<div className="center"><LoadingSpinner/> </div>}>
            {routes}
          </Suspense>
        </main>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
