import React, { useState, useContext } from 'react';

import Card from '../../shared/components/UIElements/Card';
import Button from '../../shared/components/FormElements/Button';
import Modal from '../../shared/components/UIElements/Modal';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { AuthContext } from '../../shared/context/auth-context';
import { useHttpClient } from '../../shared/hooks/http-hook';
import './ServicioItem.css';

const ServicioItem = props => {
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
        header="Are you sure?"
        footerClass="ente-item__modal-actions"
        footer={
          <React.Fragment>
            <Button inverse onClick={cancelDeleteHandler}>
              CANCEL
            </Button>
            <Button danger onClick={confirmDeleteHandler}>
              DELETE 1
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
        <Card className="ente-item__content">
          {isLoading && <LoadingSpinner asOverlay />}
          <div className="ente-item__actions">
            
            {(
              <Button danger onClick={showDeleteWarningHandler}>
                -
              </Button>
            )}
            {props.nombre} 
            
          </div>
        </Card>
      </li>
    </React.Fragment>
  );
};

export default ServicioItem;
