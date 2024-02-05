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
  const [personaBusqueda, setPersonaBusqueda] = useState();
  const [personas, setPersonas]= useState('');
  const recetaId = useParams().recetaId;
  const servicioId = useParams().servicioId;
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
      },
      servicio:{
        value:'',
        isValid: true
      },
      nombreDescriptivo:{
        value:'',
        isValid: true
      }

    },
    false
  );


  useEffect(() => {
    const fetchReceta = async () => {


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
            },
            servicio: {
              value:responseData.receta.servicio,
              isValid : true
            },
            nombreDescriptivo:{
              value:'',
              isValid: true
            }
      
          },
          true
        );

      } catch (err) {}
    };
    fetchReceta();
/*    const fetchPersonas = async () => {
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
    
    
  }, [sendRequest, recetaId, setFormData,setPersonas]);

  useEffect(()=>{
    console.log ("carga personas");
    /*try {
      setPersonas (JSON.parse( localStorage.getItem("personas")));
    }catch(e){
      console.log (e)
    }*/
    
  },[]);
   
 const cancelarHandler = event=>{
  event.preventDefault();  
  history.push(`/recetas/:${servicioId}/recetas`);
 }
  
  const recetaUpdateSubmitHandler = async event => {
    event.preventDefault();
    const recetaActualizada = {
      servicio: formState.inputs.servicio.value,
      usuario: auth.userId,
      persona: formState.inputs.persona.value,
      fecha: formState.inputs.fecha.value,
      medicamentos: loadedReceta.medicamentos.map(med =>({'cantidad': med.cantidad, 'medicamento': med.medicamento._id}))
    }
    console.log(recetaActualizada);
    console.log ('Actualiza');
    
    console.log(loadedReceta.medicamentos)
    console.log (recetaId)
    try {
      
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + `/recetas/${recetaId}`,
        'PATCH',
        JSON.stringify(recetaActualizada),
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + auth.token
        }
      );
      history.push(`${servicioId}/recetas/`);
    } catch (err) {}

  };

  useEffect(()=>{
    console.log ('--------------------------');
    console.log (personas);
    if (!personaBusqueda && personaBusqueda===''){
      console.log ('Blanco no se puede buscar');
    }else{
        const fetchPersonas = async () => {      
        try {
          const responseData = await sendRequest(
            process.env.REACT_APP_BACKEND_URL +  `/personas/busqueda/${personaBusqueda}`
            ,'GET',null, 
            {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + auth.token
            }
          );                              
          setPersonas (responseData.personas.map ( persona => ({ 'value': persona._id, 'label':persona.apellidosNombres})));                    
          } catch (err) {}

          
        }
        fetchPersonas(); 
       /* try{
          const personas = JSON.parse(localStorage.getItem("personas"));
          if (personas){
            console.log (personas[0])
            console.log (`personaBusqueda: ${personaBusqueda}`);
            const filtroPersonas = personas.filter (item => item.label.indexOf(personaBusqueda) > -1);
            console.log (filtroPersonas);
            setPersonaBusqueda(filtroPersonas);
          }                    
        }catch(e){
          console.log (e);
        }
        console.log (`SE ha cargao los valores para ${personaBusqueda}`);  */                    
    };
  },[personaBusqueda, setPersonaBusqueda]);

  const obtieneCambio = async(nombre) =>{
    
    if (nombre && nombre.indexOf ('*')>-1){
      //console.log ('buscar: ' + nombre);
      setPersonaBusqueda (nombre.substring(0,nombre.length-1));
    }    
    //else  
      //console.log ('no buscar' + nombre);
  }
  
  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />      
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
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
            id="nombreDescriptivo"
            element="input"
            type="input"
            label="Nombre"
            validators={[]}
            errorText=""
            onInput={inputHandler}
            onCambio={obtieneCambio}
            initialValue={''}
            initialValid={true}
            >
          </Input>            
          <Input
            id="persona"
            element="selector"            
            label="Paciente"
            items = {personas}
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Por favor introduzca el paciente."
            onInput={inputHandler}
            initialValue={loadedReceta.persona._id}
            initialValid={true}
            
          />

          <Input
            id="medicamentos"
            element="medicamentos"
            type="medicamentos"
            label="Medicamentos"
            medicamentos = {loadedReceta.medicamentos}
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

export default UpdateReceta;
