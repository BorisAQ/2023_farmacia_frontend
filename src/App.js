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

const Users = React.lazy(()=> import('./user/pages/Users'));
const NewMessage = React.lazy(()=> import('./message/pages/NewMessage'));
const UserMessages = React.lazy(()=> import('./message/pages/UserMessages'));
const UpdateMessage = React.lazy(()=> import('./message/pages/UpdateMessage'));
const Servicios = React.lazy(()=> import('./servicio/pages/Servicios'));
const NewServicio = React.lazy(()=> import('./servicio/pages/newService'));
const UpdateServicio = React.lazy(()=> import('./servicio/pages/updateService'));
const Recetas = React.lazy(()=> import('./recetas/pages/Recetas'));
const UpdateReceta = React.lazy(()=> import('./recetas/pages/UpdateReceta'));
const NewReceta = React.lazy(()=> import('./recetas/pages/NewReceta'));
const Auth = React.lazy(()=> import('./user/pages/Auth'));

const App = () => {
  const {token, login, logout, userId, servicio, prestaciones} = useAuth()
  let routes;

  if (token) {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Users />
        </Route>
        <Route path="/:userId/messages" exact>
          <UserMessages />
        </Route>
        <Route path="/messages/new" exact>
          <NewMessage />
        </Route>
        <Route path="/servicios" exact>
          <Servicios />
        </Route>
        <Route path="/servicios/new" exact>
          <NewServicio />
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
          <Users />
        </Route>
        <Route path="/:userId/messages" exact>
          <UserMessages />
        
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
        prestaciones: prestaciones
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
