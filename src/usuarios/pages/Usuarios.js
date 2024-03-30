import React, { useEffect, useState, useContext } from 'react';

import UsuarioList from '../components/UsuarioList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
const Usuarios = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedUsers, setLoadedUsers] = useState();
  const auth = useContext(AuthContext);
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + '/users', 'GET',null,
          {
            'Content-Type':'application/json',
            Authorization: 'bearer ' + auth.token
          }
        );// adicionar token.
        console.log (responseData.users);
        setLoadedUsers(responseData.users);
      } catch (err) {}
    };
    fetchUsers();
  }, [sendRequest]);

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedUsers && <UsuarioList usuarios={loadedUsers} />}
    </React.Fragment>
  );
};

export default Usuarios;
