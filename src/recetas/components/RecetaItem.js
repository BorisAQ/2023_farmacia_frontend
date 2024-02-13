import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';

import Button from '../../shared/components/FormElements/Button';
import Modal from '../../shared/components/UIElements/Modal';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';

import { AuthContext } from '../../shared/context/auth-context';
import { useHttpClient } from '../../shared/hooks/http-hook';
import './RecetaItem.css';
import { AiFillDelete, AiFillEdit  } from "react-icons/ai";

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
            <Button  onClick={confirmDeleteHandler}>
              d
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
            <div className='receta_nombre'> {props.persona}</div>
            <div className='receta_matricula'> 86-2209-AQB </div>
          </div>
          {
                      props.medicamentos && props.medicamentos.map (
                          medicamento =><div key={medicamento.id} id={medicamento.id} className='receta_contenedorB'>
                            <div className='receta_contenedorB_medicamento'>({medicamento.cantidad}) {medicamento.medicamento.descripcion} </div>            
                            <div className='receta_contenedorB_costo'>{medicamento.medicamento.costo}</div>                                      
                        </div>                                                                               
                      )
                  }
          <div className='receta_contenedorB'>            
            <div className='receta_contenedorB_medicamento'>TOTAL:</div>            
            <div className='receta_contenedorB_costo'>154.00</div>            
          </div>
          <div className='receta_contenedorC'>
            <div className='receta_contenedorC_botones'> 
            
              { (
                <Link className='buttonRecetaEditar' to={`/recetas/${props.id}`}>EDITAR <AiFillEdit /></Link>
                
              )}

              {(
                <button className='buttonRecetaEliminar'  onClick={showDeleteWarningHandler}>
                  BORRAR <AiFillDelete/>
                </button>
              )}                          
          
            </div>
            <div className='receta_contenedorC_usuario'> Usuario:Serral </div>
          </div>
        </div>
        
      
    </React.Fragment>
  );
};

export default RecetaItem;

