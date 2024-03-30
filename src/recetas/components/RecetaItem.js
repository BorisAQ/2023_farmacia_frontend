import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';

import Button from '../../shared/components/FormElements/Button';
import Modal from '../../shared/components/UIElements/Modal';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';

import { AuthContext } from '../../shared/context/auth-context';
import { useHttpClient } from '../../shared/hooks/http-hook';
import './RecetaItem.css';
import { AiFillDelete, AiFillEdit  } from "react-icons/ai";
import { GiConfirmed } from "react-icons/gi";
import { MdOutlineCancel } from "react-icons/md";

const RecetaItem = props => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const suma=  (medicamentos)=>{
    let t = 0;
    
    medicamentos.forEach( medicamento =>{
      t = t+ medicamento.medicamento.cantidad *(medicamento.medicamento.costoSD + medicamento.medicamento.costoMSC)
      
    });
    return t;
  }
  const showDeleteWarningHandler = () => {
    setShowConfirmModal(true);
  };

  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
  };

  const confirmDeleteHandler = async () => {
    setShowConfirmModal(false);
    try {   
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + `/recetas/${props.id}`,
        'DELETE',
        null,{
          Authorization:'Bearer ' + auth.token
        }        
      );
      props.onDelete(props.id);
    } catch (err) {}
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Modal
        show={showConfirmModal}
        onCancel={cancelDeleteHandler}
        header="Are you sure?"
        footerClass="ente-item__modal-actions"
        footer={
          <React.Fragment>
            <Button inverse onClick={cancelDeleteHandler}>
            <span className='mostrar'>VOLVER </span><MdOutlineCancel/>
            </Button>
            <Button  onClick={confirmDeleteHandler}>
            <span className='mostrar'>ELIMINAR </span><GiConfirmed/> 
            </Button>
          </React.Fragment>
        }
      >
        <p>
          ¿Desea eliminar la receta?
        </p>
      </Modal>
      
        
        <div className='receta'>
          <div className='receta_contenedorA'>
            <div className='receta_fecha'> {props.fecha.substring(0,10)}</div>
            <div className='receta_nombre'> {props.persona.apellidosNombres}</div>
            <div className='receta_matricula'> {props.persona.matricula } </div>
          </div>
          {
                      props.medicamentos && props.medicamentos.map (
                          medicamento =><div key={medicamento.id} id={medicamento.id} className='receta_contenedorB'>
                            <div className='receta_contenedorB_medicamento'>({medicamento.medicamento.cantidad}) {medicamento.medicamento.descripcion} </div>            
                            <div className='receta_contenedorB_costo'>{((medicamento.medicamento.costoSD + medicamento.medicamento.costoMSC)* medicamento.medicamento.cantidad).toFixed(2)}</div>                                      
                        </div>                                                                               
                      )
                  }
          <div className='receta_contenedorB'>            
            <div className='receta_contenedorB_medicamento'>TOTAL:</div>            
            <div className='receta_contenedorB_costo'>{
              (props.costoSD +props.costoMSC).toFixed(2)
              
            }</div>            
          </div>
          <div className='receta_contenedorC'>
            <div className='receta_contenedorC_botones'> 
            
              { (
                <Link className='buttonRecetaEditar' to={`/recetas/${props.id}`}><span className='mostrar'>EDITAR</span> <AiFillEdit /></Link>                
              )}

              {(
                <button className='buttonRecetaEliminar'  onClick={showDeleteWarningHandler}>
                <span className='mostrar'>BORRAR </span>  <AiFillDelete/>
                </button>
              )}                          
          
            </div>
            <div className='receta_contenedorC_usuario'> Usuario:{props.usuario} </div>
          </div>
        </div>
        
      
    </React.Fragment>
  );
};

export default RecetaItem;

