import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
  VALIDATOR_NUMERO,
  VALIDATOR_MIN


} from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import './ServiceForm.css';

const NewServicio = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [formState, inputHandler] = useForm(
    {
      name: {
        value: '',
        isValid: false
      },
      codigoSistema: {
        value: 0,
        isValid: false
      }
    },
    false
  );

  const history = useHistory();

  const placeSubmitHandler = async event => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', formState.inputs.name.value);
      formData.append('codigoSistema', formState.inputs.codigoSistema.value);    
      await sendRequest( process.env.REACT_APP_BACKEND_URL + '/servicios', 
      'POST', 
      JSON.stringify({
        name: formState.inputs.name.value,
        codigoSistema: formState.inputs.codigoSistema.value,        
      }),
      {
        
        'Content-Type': 'application/json',  
        Authorization : 'Bearer ' + auth.token,
      }
      
      );
      history.push('/servicios');
    } catch (err) {}
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <form className="ente-form" onSubmit={placeSubmitHandler}>
        {isLoading && <LoadingSpinner asOverlay />}
        <div className="ente-titulo">ADICIONA SERVICIO</div>
        <Input
          id="name"
          element="input"
          type="text"
          label="Nombre del servicio"
          validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(5)]}
          errorText="Por favor introduzca un nombre para el servicio."
          onInput={inputHandler}
        />
        <Input
          id="codigoSistema"
          element="input"
          label="Codigo del sistema"
          validators={[VALIDATOR_REQUIRE(),  VALIDATOR_MIN(0),VALIDATOR_NUMERO()]}
          errorText="Por favor introduzca el código del Sistema"
          onInput={inputHandler}
        />
        <Button type="submit" disabled={!formState.isValid}>
          ADICIONAR
        </Button>
      </form>
    </React.Fragment>
  );
};

export default NewServicio;
