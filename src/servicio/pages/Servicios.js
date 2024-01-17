import React, { useEffect, useState, useContext } from 'react';
import ServicioList from '../components/ServicioList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
const Servicios = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedServicios, setloadedServicios] = useState();
  
  const auth = useContext(AuthContext);
  useEffect(() => {
    
    const fetchServicios = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + '/servicios','GET',null
          ,          
          {
          
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + auth.token
          }
        );
        setloadedServicios(responseData.servicios);
      } catch (err) {}
    };
    fetchServicios();
  }, [sendRequest]);


  const servicioDeletedHandler = deletedServicioId =>{
    setloadedServicios (prevServicios => prevServicios.filter (servicio=>servicio.id!== deletedServicioId));
  }
 

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedServicios && <ServicioList items={loadedServicios} 
      
        onDeleteServicio = {servicioDeletedHandler}
      />}
    </React.Fragment>
  );
};

export default Servicios;
