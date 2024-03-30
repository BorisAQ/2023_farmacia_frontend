import React from 'react';
import UsuarioItem from './UsuarioItem';
import './UsuarioList.css';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';
import { AiFillPlusSquare  } from "react-icons/ai";
const UsuarioList = ({usuarios} )=> {
  if (usuarios.length === 0) {
    return (
      
      <div className="center">
        <div>
          <h2>No se encontraron usuarios</h2>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className='usuario_cabecera'>
        <Link className= 'usuarioRecetaNuevo' to = {`/newUsuario`}>
          <AiFillPlusSquare/> ADICIONAR
        </Link>          
      </div>
      <ul className="usuario-list">
        {usuarios.map(usuario => (
          <UsuarioItem
            usuario = {usuario}          
          />
        ))}
      </ul>
    </div>
    
  );
};

export default UsuarioList;
