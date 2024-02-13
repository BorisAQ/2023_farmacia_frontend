import React, { useEffect, useState, useContext } from 'react';
import RecetaList from '../components/RecetaList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';


const Recetas = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedRecetas, setloadedRecetas] = useState();
  
  const auth = useContext(AuthContext);
  
  useEffect(() => {  
    
 const fetchRecetas = async () => {
      try {
        const responseData = await sendRequest(          
          process.env.REACT_APP_BACKEND_URL + `/recetas/${auth.servicio._id}/recetas?fechainicial=${new Date().toISOString()}&fechafinal=${new Date().toISOString()}`,
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
 

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />        
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedRecetas && <RecetaList  
      
        onDeleteReceta = {recetaDeletedHandler}
      />}
    </React.Fragment>
  );
};

export default Recetas;
