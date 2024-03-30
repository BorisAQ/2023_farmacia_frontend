import React from 'react';
import './ServicioPrestacionItem.css';
import { AiFillDelete, AiFillEdit  } from "react-icons/ai";
const ServicioPrestacionItem = props => {
  
  return (
    <React.Fragment>     
      <li className="itemServicio">        
        <div>
          <button className='buttonPrestacionEditar'><AiFillEdit/></button>
          <button className='buttonPrestacionEliminar'><AiFillDelete/></button>
        </div>
        <div className="itemServicio__content">                           
          {props.descripcion}  -  {props.costo} - <strong>{props.codigoSistema}</strong>                      
        </div>
      </li>
    </React.Fragment>
  );
};

export default ServicioPrestacionItem;
