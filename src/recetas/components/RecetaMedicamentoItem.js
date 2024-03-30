import React, { useState, useContext } from 'react';


import Button from '../../shared/components/FormElements/Button';
import Modal from '../../shared/components/UIElements/Modal';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';
import './RecetaMedicamentoItem.css';
import { AiFillDelete  } from "react-icons/ai";
import { GiConfirmed } from "react-icons/gi";
import { MdOutlineCancel } from "react-icons/md";

const ServicioMedicamentoItem = props => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const showDeleteWarningHandler = event => {
    event.preventDefault();
    setShowConfirmModal(true);
  };

  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
  };

  const cancelDeleteHandlerButton =(e)=>{
    e.preventDefault();
    setShowConfirmModal(false);
  }

  const confirmDeleteHandler =  event => {
    event.preventDefault();
    
    try {
      props.onDelete(props.id);
    } catch (err) {}
    setShowConfirmModal(false);
    
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Modal
        show={showConfirmModal}
        onCancel={cancelDeleteHandler}
        header="¿Eliminar el mendicamento?"
        footerClass="ente-item__modal-actions"
        footer={
          <React.Fragment>
            <Button  onClick={cancelDeleteHandlerButton}>
              <span className='mostrar'>VOLVER </span><MdOutlineCancel/>
            </Button>
            <Button danger onClick={confirmDeleteHandler}>
              <span className='mostrar'>ELIMINAR </span><GiConfirmed/>              
            </Button>
          </React.Fragment>
        }
      >
        <p>
          ¿Eliminar el item de la receta?
        </p>
      </Modal>
      <li className="lista">
        <div className="lista_fila">
          {isLoading && <LoadingSpinner asOverlay />}
            <div className='lista_fila_descripcion'>
            {props.cantidad} - {props.descripcion}  
            </div>
            <div className="lista_fila_boton">
              
              {(
                <Button danger onClick={showDeleteWarningHandler}>
                  <AiFillDelete/>
                </Button>
              )}
            </div>                            
            
          </div>
      </li>
    </React.Fragment>
  );
};

export default ServicioMedicamentoItem;
