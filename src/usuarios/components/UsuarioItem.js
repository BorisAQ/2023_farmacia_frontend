import React from "react";
import './UsuarioItem.css'
import {  AiFillEdit  } from "react-icons/ai";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
const UsuarioItem= ({usuario})=>{
    return (        
    <li className="usuario_item">        
        <div className ="usuario_item__content">
            <div className="usuario_item__info">
                    <strong>{usuario.name}</strong>
                    <span>  {usuario.email}</span>                    
            </div>
            <div className="usuario_item_botones">
                <Link className="buttonUsuarioEditar" to={`/updateUsuario/${usuario.id}`} >
                    <AiFillEdit/>
                    EDITAR
                </Link>
 
            </div>

        </div>
        
    </li>	
    );
};

export default UsuarioItem;