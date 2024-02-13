import React, { useState, useContext } from 'react';

import Card from '../../shared/components/UIElements/Card';
import Button from '../../shared/components/FormElements/Button';
import Modal from '../../shared/components/UIElements/Modal';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { AuthContext } from '../../shared/context/auth-context';
import { useHttpClient } from '../../shared/hooks/http-hook';
import './RecetaMedicamentoItem.css';
import { AiFillDelete  } from "react-icons/ai";
import { GiConfirmed } from "react-icons/gi";
import { MdOutlineCancel } from "react-icons/md";

const ServicioMedicamentoItem = props => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);
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
              VOLVER <MdOutlineCancel/>
            </Button>
            <Button danger onClick={confirmDeleteHandler}>
              ELIMINAR <GiConfirmed/>
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
          <div className="">
            
            {(
              <Button danger onClick={showDeleteWarningHandler}>
                <AiFillDelete/>
              </Button>
            )}
            {props.cantidad} - {props.descripcion} -( {props.costo}) 
            
          </div>
        </div>
      </li>
    </React.Fragment>
  );
};

export default ServicioMedicamentoItem;
