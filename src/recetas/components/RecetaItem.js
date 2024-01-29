import React, { useState, useContext } from 'react';

import Card from '../../shared/components/UIElements/Card';
import Button from '../../shared/components/FormElements/Button';
import Modal from '../../shared/components/UIElements/Modal';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { AuthContext } from '../../shared/context/auth-context';
import { useHttpClient } from '../../shared/hooks/http-hook';
import './RecetaItem.css';

const RecetaItem = props => {
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
              CANCEL
            </Button>
            <Button danger onClick={confirmDeleteHandler}>
              DELETE
            </Button>
          </React.Fragment>
        }
      >
        <p>
          ¿Desea eliminar la receta?
        </p>
      </Modal>
      <li className="ente-item">
        <Card className="ente-item__content">
          {isLoading && <LoadingSpinner asOverlay />}
          <div className="ente-item__actions">

          <div className="ente-item__info">
                <p>{new Date(new Date(props.fecha)).toUTCString()}                            
                
                {props.persona} 
                </p>
                <ul className="ente-list">
                  {
                      props.medicamentos && props.medicamentos.map (
                          medicamento => <div key = {medicamento.id} id= {medicamento.id} className='medicamento'>({medicamento.cantidad}) {medicamento.medicamento.descripcion} [{medicamento.medicamento.costo}]</div> 
                      )
                  }
              </ul>
              {(
                <div className='creadoPor'>Usuario: {props.usuario} </div>
              )}
          </div>
            
            
            <div className="ente-item__actions center">
              { (
                <Button to={`/recetas/${props.id}`}>E</Button>
              )}

              {(
                <Button danger onClick={showDeleteWarningHandler}>
                  D
                </Button>
              )}
              
            </div>
            
          </div>
        </Card>
      </li>
    </React.Fragment>
  );
};

export default RecetaItem;

