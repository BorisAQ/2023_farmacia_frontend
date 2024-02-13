import React, { useEffect, useState, useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import RecetaMedicamentoList from '../components/RecetaMedicamentoList';
import {
  VALIDATOR_REQUIRE
} from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import './RecetaForm.css';




const UpdateReceta = () => {
  const auth = useContext(AuthContext);
  const {  error, sendRequest, clearError } = useHttpClient();
  const [loadedReceta, setloadedReceta] = useState(null);  
  const [personaBusqueda, setPersonaBusqueda] = useState();
  const [personas, setPersonas]= useState([]);
  const [recetaValida, setRecetaValida] = useState(false); 
  const [nuevosMedicamentos, setNuevosMedicamentos]= useState([]);
  const [cargandoPersona, setCargandoPersona] = useState(false); 
  const [isLoading , setisLoading]= useState (false);
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

  useEffect( ()=> {
    if (formState.inputs.persona.value && formState.inputs.fecha && nuevosMedicamentos.length>0)
      setRecetaValida(true);
    else
      setRecetaValida(false);
   }
  ,[formState, nuevosMedicamentos]);

  useEffect(() => {
    const fetchReceta = async () => {  
      setisLoading (true);    
      try {
        
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL +  `/recetas/${recetaId}`
          ,'GET',null, 
          {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + auth.token,            
          }
        );                  
        setloadedReceta(responseData.receta); 
        setNuevosMedicamentos(responseData.receta.medicamentos);
        setPersonas([...personas, {value: responseData.receta.persona.id, label:responseData.receta.persona.apellidosNombres}])
        setisLoading (false);
        setFormData(
          {
            fecha: {
              value: responseData.receta.fecha,
              isValid: true
            },
            persona: {
              value: responseData.receta.persona.id,
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
  }, []);

  const actualizaMedicamentos = (medicamentos)=>{    
    setNuevosMedicamentos(medicamentos);
  }

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
      medicamentos: nuevosMedicamentos.map(med =>({'cantidad': med.cantidad, 'medicamento': med.medicamento._id}))
    }

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
    setCargandoPersona(true);
    if (personaBusqueda || personaBusqueda!==''){          
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
          setCargandoPersona(false);
          } catch (err) {}          
        }
        fetchPersonas();              
    };
  },[personaBusqueda]);

  const obtieneCambio = async(nombre) =>{    
    if (nombre && nombre.indexOf (' ')>-1){      
      setPersonaBusqueda (nombre.substring(0,nombre.length-1));
    }        
  }
  

  if (isLoading) {
    return (
      <div className="center">
        Cargando la receta...
      </div>
    );
  }


  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />      

      { loadedReceta && (
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
            label="Buscar:"
            validators={[]}
            errorText=""
            onInput={inputHandler}
            onCambio={obtieneCambio}
            initialValue={''}
            initialValid={true}
            placeholder = {'Nombres o apellidos seguido de espacio'}
            />      
          {
            cargandoPersona && <div className='mensaje_cargando_personas'>Obteniendo personas...</div>
          }
          {
            !cargandoPersona && <Input
                                      id="persona"
                                      element="selector"            
                                      label="Paciente"
                                      items = {personas}
                                      validators={[VALIDATOR_REQUIRE()]}
                                      errorText="Por favor introduzca el paciente."
                                      onInput={inputHandler}
                                      initialValue={personas.length>0 ? personas[0].value:''}
                                      initialValid={true}
                                      
                                    />
          }

          <RecetaMedicamentoList            
            medicamentos = {nuevosMedicamentos  } 
            actualizaMedicamentos = {actualizaMedicamentos}
         />
         
          <Button type="submit" disabled={!recetaValida}>
              CONFIRMAR
          </Button>
          <Button  onClick={cancelarHandler}>
                    CANCELAR
          </Button>
        </form>
      )}
    </React.Fragment>
  );

};

export default UpdateReceta;
