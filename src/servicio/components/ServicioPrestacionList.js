import React, { useEffect} from 'react';

import './ServicioList.css'
import ServicioPrestacionItem from './ServicioPrestacionItem';

const ServicioPrestacionList = props=>{
    
    return (
      <React.Fragment>
      
      <ul className="ente-list">
    {
        props.prestaciones && props.prestaciones.map (
            prestacion => <ServicioPrestacionItem 
                key={prestacion._id} 
                id={prestacion._id}                     
                descripcion = {prestacion.descripcion}
                costo = {prestacion.costo}
                codigoSistema = {prestacion.codigoSistema}
                
                />)
        
    
    }
    </ul>
    </React.Fragment>
        
      );


};

export default ServicioPrestacionList;
