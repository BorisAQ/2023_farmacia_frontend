import React, { useEffect, useState, useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import Card from '../../shared/components/UIElements/Card';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
  VALIDATOR_MIN,
  VALIDATOR_NUMERO
} from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import './ServiceForm.css';



const UpdateService = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedServicio, setLoadedServicio] = useState();
  const [loadedUsers, setloadedUsers] = useState();
  const ServicioId = useParams().servicioId;
  const history = useHistory();

  const [formState, inputHandler, setFormData] = useForm(
    {
      name: {
        value: '',
        isValid: false
      },
      codigoSistema: {
        value: 0,
        isValid: false
      },
      usuarios:{
        value:[],
        isValid: true
      }
    },
    false
  );


  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL +  `/servicios/${ServicioId}`
          ,'GET',null, 
          {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + auth.token
          }
        );        
        setLoadedServicio(responseData.servicio);
        setFormData(
          {
            name: {
              value: responseData.service.name,
              isValid: true
            },
            codigoSistema: {
              value: responseData.service.codigoSistema,
              isValid: true
            },
            usuarios:{
              value: responseData.service.usuarios,
              isValid: true
            }
          },
          true
        );

      } catch (err) {}
    };
    fetchMessage();

    const fetchUsers = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + '/users/lista','GET',null
          ,          
          {
        
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + auth.token
          }
        );
                
        setloadedUsers(responseData.users);
        /*setloadedUsers(responseData.users.filter (item=>!loadedServicio.usuarios.includes(item)));*/
        
        
        
      } catch (err) {}
    };
    fetchUsers();        
  }, [sendRequest, ServicioId, setFormData]);


 const cancelarHandler = event=>{
  event.preventDefault();
  history.push('/servicios');
 }
  
  const servicioUpdateSubmitHandler = async event => {
    event.preventDefault();
    
    try {
      
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + `/servicios/${ServicioId}`,
        'PATCH',
        JSON.stringify({
          name: formState.inputs.name.value,
          codigoSistema: formState.inputs.codigoSistema.value,
          usuarios: formState.inputs.usuarios.value.map(usuario => usuario.id)
        }),
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + auth.token
        }
      );
      history.push('/servicios');
    } catch (err) {}
  };


  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!loadedServicio && !error) {
    return (
      <div className="center">
        <Card>
          <h2>No se pudo encontrar el servicio</h2>
        </Card>
      </div>
    );
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />      
      {!isLoading && loadedServicio && (
        <form className="ente-form" onSubmit={servicioUpdateSubmitHandler}>
          <Input
            id="name"
            element="input"
            type="text"
            label="Nombre del servicio"
            validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(5)]}
            errorText="Por favor introduzca un nombre para el servicio."
            onInput={inputHandler}
            initialValue={loadedServicio.name}
            initialValid={true}
          />
          <Input
            id="codigoSistema"
            element="input"
            label="Codigo Servicio"
            validators={[VALIDATOR_REQUIRE(),  VALIDATOR_MIN(0),VALIDATOR_NUMERO()]}
            errorText="Por favor introduzca el código del Sistema"
            onInput={inputHandler}
            initialValue={loadedServicio.codigoSistema}
            initialValid={true}
          />
           <Input
            id="usuarios"
            element="usuarios"
            label="Usuarios"
            validators={[]}
            errorText="Por favor introduzca el código del Sistema"
            onInput={inputHandler}
            initialValue={loadedServicio.usuarios}
            usuarios = {loadedServicio.usuarios}
            todoslosUsuarios = {loadedUsers}
            initialValid={true}
          />
          
          

          <Button type="submit" disabled={!formState.isValid}>
            CONFIRMAR
          </Button>
          <Button danger onClick={cancelarHandler}>
                    CANCELAR
          </Button>
        </form>
      )}
    </React.Fragment>
  );
};

export default UpdateService;
