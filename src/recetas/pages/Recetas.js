import React, { useEffect, useState, useContext } from 'react';
import RecetaList from '../components/RecetaList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import Button from '../../shared/components/FormElements/Button';
const Recetas = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedRecetas, setloadedRecetas] = useState();
  
  const auth = useContext(AuthContext);
  
  useEffect(() => {  
    
    const fetchRecetas = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + `/recetas/${auth.servicio._id}/recetas`,
            'GET',null
          ,          
          {          
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + auth.token
          }
        );

          
        setloadedRecetas(responseData.recetas);
      } catch (err) {}
    };
    fetchRecetas();
console.log ('RECUPERANDO');

//personas
    let personas;
    if (localStorage.getItem("fechaActualizacion")===null){          
      const fetchPersonas = async () => {
        try {
          const responseData = await sendRequest(
            process.env.REACT_APP_BACKEND_URL +  `/personas/`
            ,'GET',null, 
            {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + auth.token
            }
          );                                              
          personas = responseData.personas.map ( persona => ({ 'value': persona._id, 'label':persona.apellidosNombres}));                                 
          localStorage.setItem("fechaActualizacion",JSON.stringify(auth.fechaActualizacionPoblacion))
          localStorage.setItem("personas",JSON.stringify(personas))
          console.log ('iniciar poblacion')  
          console.log (personas);      
        } catch (err) {}
      };
      fetchPersonas();                    
    }else{
      const fechaActualizacionAlmacenada = new Date(JSON.parse(localStorage.getItem("fechaActualizacion")) ) ;
      const fechaServidor = new Date(auth.fechaActualizacionPoblacion);
      console.log (`Fecha almacenada: ${fechaActualizacionAlmacenada} , fechaServidor ${fechaServidor}`)        ;
      if (fechaServidor> fechaActualizacionAlmacenada){
          console.log ('llamar al procedimiento y actualizar poblacion')              
          const fetchPersonas1 = async () => {
            try {
              const responseData = await sendRequest(
                process.env.REACT_APP_BACKEND_URL +  `/personas/`
                ,'GET',null, 
                {
                  'Content-Type': 'application/json',
                  Authorization: 'Bearer ' + auth.token
                }
              );                                              
              personas = responseData.personas.map ( persona => ({ 'value': persona._id, 'label':persona.apellidosNombres}));                                 
              localStorage.setItem("personas",JSON.stringify(personas));
              localStorage.setItem("fechaActualizacion",JSON.stringify(auth.fechaActualizacionPoblacion))
              console.log (personas);
            } catch (err) {}
          };
          fetchPersonas1();              
          
      }else{
          console.log ('conservar población')
          personas = JSON.parse(localStorage.getItem("personas"));
          console.log (personas);
      }
      
      
    }

  }, [sendRequest]);


  const recetaDeletedHandler = deletedRecetaId =>{
    setloadedRecetas (recetas => recetas.filter (receta=>receta.id!== deletedRecetaId));
  }
 
  const nuevaReceta = ()=>{
    console.log ('Nueva Receta')
  }
  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      
        <div className="center">        
        <Button  disabled={isLoading} to={`/recetas/new`}>+ RECETA</Button>
        </div>
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedRecetas && <RecetaList recetas={loadedRecetas} 
      
        onDeleteReceta = {recetaDeletedHandler}
      />}
    </React.Fragment>
  );
};

export default Recetas;
