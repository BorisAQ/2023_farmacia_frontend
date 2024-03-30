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
import ServicioPrestacionList from '../components/ServicioPrestacionList';
import ServicioUsuarioList from '../components/ServicioUsuarioList';



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
      },
      prestaciones:{
        value:[],
        isValid: true
      }
    },
    false
  );


  useEffect(() => {
    const fetchServicio = async () => {
      try {
        console.log (ServicioId)
        const responseServicio = await sendRequest(
          process.env.REACT_APP_BACKEND_URL +  `/servicios/${ServicioId}`
          ,'GET',null, 
          {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + auth.token
          }
        );        
        console.log (responseServicio.servicio);
        
        setloadedUsers (responseServicio.servicio.usuarios);
        setLoadedServicio (responseServicio.servicio);
        setFormData(
          {
            name: {
              value: responseServicio.servicio.name,
              isValid: true
            },
            codigoSistema: {
              value: responseServicio.servicio.codigoSistema,
              isValid: true
            },
            usuarios:{
              value: responseServicio.servicio.usuarios,
              isValid: true
            },
            prestaciones:{
              value: responseServicio.servicio.prestaciones,
              isValid: true
            }
          },
          true
        );
        
      } catch (err) {
        console.log (err);
      }
    };
    fetchServicio();        
  }, []);

  useEffect(()=>{
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
        console.log (responseData.users)
      } catch (err) {}
    };
    //fetchUsers();        
  },[]);

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
          <h2>Actualizar servicio</h2>

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
         <ServicioUsuarioList items = {loadedUsers}/>
          <ServicioPrestacionList
            id= 'ListaServicio'
            prestaciones = {loadedServicio.prestaciones}
            >

          </ServicioPrestacionList>
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
