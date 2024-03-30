import React, { useState, useContext } from 'react';


import Button from '../../shared/components/FormElements/Button';
import Modal from '../../shared/components/UIElements/Modal';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { AuthContext } from '../../shared/context/auth-context';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AiFillDelete, AiFillEdit  } from "react-icons/ai";
import './ServicioItem.css';

const ServicioItem = props => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

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
        process.env.REACT_APP_BACKEND_URL + `/servicios/${props.id}`,
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
              CANCEL
            </Button>
            <Button danger onClick={confirmDeleteHandler}>
              DELETE
            </Button>
          </React.Fragment>
        }
      >
        <p>
          Do you want to proceed and delete this servicio? Please note that it
          can't be undone thereafter.
        </p>
      </Modal>
      <li className="ente-item">
        <div className="ente-item__content">

          {isLoading && <LoadingSpinner asOverlay />}
          <div className='ente-item__info'><strong>{props.name}</strong> {props.codigoSistema}</div>
          <div className="ente-item__actions">
            { (
              <Button to={`/servicios/${props.id}`}><AiFillEdit/> EDITAR</Button>
            )}

            {(
              <Button danger onClick={showDeleteWarningHandler}>
                <AiFillDelete/> BORRAR
              </Button>
            )}
            
          </div>
        </div>
      </li>
    </React.Fragment>
  );
};

export default ServicioItem;
