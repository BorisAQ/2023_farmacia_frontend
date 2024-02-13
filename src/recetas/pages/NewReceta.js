import React, { useEffect, useState, useContext } from 'react';
import {  useHistory } from 'react-router-dom';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import {
  VALIDATOR_REQUIRE,
} from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import './RecetaForm.css';
import { GiConfirmed } from "react-icons/gi";
import { MdOutlineCancel } from "react-icons/md";
import RecetaMedicamentoList from '../components/RecetaMedicamentoList';


const NewReceta = () => {
  const auth = useContext(AuthContext);
  const { error, sendRequest, clearError } = useHttpClient();
  const [personas, setPersonas]= useState();
  const [personaBusqueda, setPersonaBusqueda] = useState();
  const [cargandoPersona, setCargandoPersona] = useState(false); 
  const [recetaValida, setRecetaValida] = useState(false); 
  const servicioId =auth.servicio._id;

  const history = useHistory();
  const [nuevosMedicamentos, setNuevosMedicamentos]= useState([]);
  const [formState, inputHandler] = useForm(
    {
      fecha: {
        value: new Date().toISOString().substring (0,10),
        isValid: true
      },
      usuario: {
        value: 0,
        isValid: true
      },
      medicamentos:{
        value:[],
        isValid: false
      },
      persona:{
        value:'',
        isValid: false
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

  useEffect(() => {    
    setNuevosMedicamentos([]);
  }, []);



 const cancelarHandler = async event=>{
  event.preventDefault();  
  history.push(`/recetas/:${servicioId}/recetas`);
 }

 const obtieneCambio = async(nombre) =>{    
  if (nombre && nombre.indexOf (' ')>-1)
     setPersonaBusqueda (nombre.substring(0,nombre.length-1));    
}

  const actualizaMedicamentos = (medicamentos)=>{    
    setNuevosMedicamentos(medicamentos);
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
      <ErrorModal error={error} onClear={clearError} header = 'Error al registrar la receta.'/>      
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
            initialValue ={new Date().toLocaleDateString('en-CA').substring (0,10)}           
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
            >
          </Input>       
          {
            cargandoPersona && <div className='mensaje_cargando_personas'>Obteniendo personas...</div>
          }
          {
            !cargandoPersona &&<Input
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
          }

          <RecetaMedicamentoList
            
             medicamentos = {nuevosMedicamentos  } 
             actualizaMedicamentos = {actualizaMedicamentos}
          />
         
          <Button type="submit" disabled={!recetaValida}>
              CONFIRMAR <GiConfirmed/>
          </Button>
          <Button danger onClick={cancelarHandler}>
              CANCELAR  <MdOutlineCancel/>
          </Button>
        </form>
      )}
    </React.Fragment>
  );
};

export default NewReceta;
