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
import './RecetaForm.css';




const UpdateReceta = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedReceta, setloadedReceta] = useState();  
  const recetaId = useParams().recetaId;
  const history = useHistory();

  const [formState, inputHandler, setFormData] = useForm(
    {
      fecha: {
        value: '',
        isValid: false
      },
      usuario: {
        value: 0,
        isValid: false
      },
      medicamentos:{
        value:[],
        isValid: true
      },
      persona:{
        value:'',
        isValid: true
      }
    },
    false
  );


  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL +  `/recetas/${recetaId}`
          ,'GET',null, 
          {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + auth.token
          }
        );        
          
        setloadedReceta(responseData.receta);
        
        setFormData(
          {
            fecha: {
              value: responseData.receta.fecha,
              isValid: true
            },
            persona: {
              value: responseData.receta.persona,
              isValid: true
            },
            medicamentos:{
              value: responseData.receta.medicamentos,
              isValid: true
            },
            usuario:{
              value: responseData.receta.usuario,
              isValid: true
            }
          },
          true
        );

      } catch (err) {}
    };
    fetchMessage();
    
  }, [sendRequest, recetaId, setFormData]);


 const cancelarHandler = event=>{
  event.preventDefault();
  history.push('/recetas');
 }
  
  const recetaUpdateSubmitHandler = async event => {
    event.preventDefault();
    
    try {
      
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + `/recetas/${recetaId}`,
        'PATCH',
        JSON.stringify({
            fecha: formState.inputs.fecha.value,
            usuario: formState.inputs.usuario.value,
            persona: formState.inputs.persona.value,
            medicamentos: formState.inputs.medicamentos.value.map(medicamento => medicamento.id)
        }),
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + auth.token
        }
      );
      history.push('/recetas');
    } catch (err) {}
  };


  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!loadedReceta && !error) {
    return (
      <div className="center">
        <Card>
          <h2>No se pudo encontrar la receta</h2>
        </Card>
      </div>
    );
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />      
      {!isLoading && loadedReceta && (
        <form className="ente-form" onSubmit={recetaUpdateSubmitHandler}>
          <Input
            id="fecha"
            element="date"
            type="date"
            label="Fecha"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Por favor introduzca la fecha."
            onInput={inputHandler}
            initialValue={loadedReceta.fecha.substring(0,10)}
            initialValid={true}
          />
            
          <Input
            id="persona1"
            element="persona1"
            type="persona1"
            label="Paciente1"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Por favor introduzca el paciente."
            onInput={inputHandler}
            initialValue={loadedReceta.persona.apellidosNombres}
            initialValid={true}
            valoresSeleccion = {[{id:1,name:'hombre'}, {id:2,name:'mujer'}]}
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

export default UpdateReceta;
