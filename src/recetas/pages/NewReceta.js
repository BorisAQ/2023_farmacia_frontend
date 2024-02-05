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




const NewReceta = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [personas, setPersonas]= useState();
  const recetaId = useParams().recetaId;
  const servicioId =auth.servicio._id;

  const history = useHistory();
  const [nuevosMedicamentos, setNuevosMedicamentos]= useState([]);
  const [formState, inputHandler, setFormData] = useForm(
    {
      fecha: {
        value: '',
        isValid: false
      },
      usuario: {
        value: 0,
        isValid: true
      },
      medicamentos:{
        value:[],
        isValid: true
      },
      persona:{
        value:'',
        isValid: true
      },
      servicio:{
        value:'',
        isValid: true
      }
    },
    false
  );


  useEffect(() => {    

    /*const fetchPersonas = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL +  `/personas/`
          ,'GET',null, 
          {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + auth.token
          }
        );        
          
        
        setPersonas (responseData.personas.map ( persona => ({ 'value': persona._id, 'label':persona.apellidosNombres})));
        
        
      } catch (err) {}
    };
    fetchPersonas();*/
  
    setNuevosMedicamentos([]);
  }, [sendRequest, recetaId, setFormData,setPersonas]);

  useEffect(()=>{
    console.log ("carga personas");
    try {
      setPersonas (JSON.parse( localStorage.getItem("personas")));
    }catch(e){
      console.log (e)
    }
    
  },[]);
  


 const cancelarHandler = async event=>{
  event.preventDefault();  
  history.push(`/recetas/:${servicioId}/recetas`);
 }
  
  const recetaUpdateSubmitHandler = async event => {
    event.preventDefault();

    const recetaNueva = {
      servicio: servicioId,
      usuario: auth.userId,
      persona: formState.inputs.persona.value,
      fecha: formState.inputs.fecha.value,
      medicamentos: nuevosMedicamentos.map(med =>({'cantidad': med.cantidad, 'medicamento': med.medicamento._id}))
    }

    try {
      
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + `/recetas/`,
        'POST',
        JSON.stringify(recetaNueva),
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + auth.token
        }
      );
      history.push(`${servicioId}/recetas/`);
    } catch (err) {}

  };

  

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />      
      {  (
        <form className="ente-form" onSubmit={recetaUpdateSubmitHandler}>
          <Input
            id="fecha"
            element="date"
            type="date"
            label="Fecha"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Por favor introduzca la fecha."
            onInput={inputHandler}
            
            initialValid={true}
          />
            
          <Input
            id="persona"
            element="selector"            
            label="Paciente"
            items = {personas}
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Por favor introduzca el paciente."
            onInput={inputHandler}
            initialValue={null}
            initialValid={true}
            
          />

          <Input
            id="medicamentos"
            element="medicamentos"
            type="medicamentos"
            label="Medicamentos"
            medicamentos = {nuevosMedicamentos}
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Por favor registre por lo menos un medicamento"
            onInput={inputHandler}            
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

export default NewReceta;
