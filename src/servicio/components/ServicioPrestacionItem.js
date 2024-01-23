import React, { useState, useContext } from 'react';

import Card from '../../shared/components/UIElements/Card';
import './ServicioItem.css';

const ServicioPrestacionItem = props => {
  
  
  

  
  
  return (
    <React.Fragment>
     
      <li className="ente-item">
        <Card className="ente-item__content">
     
          <div className="ente-item__actions">
            
            {props.descripcion}  -  {props.costo} - {props.codigoSistema}
            
          </div>
        </Card>
      </li>
    </React.Fragment>
  );
};

export default ServicioPrestacionItem;
