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
        <Button to={`/recetas/new`}>+ RECETA</Button>
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
