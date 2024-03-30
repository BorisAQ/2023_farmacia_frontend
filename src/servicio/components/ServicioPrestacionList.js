import React, {useState} from 'react';

import './ServicioPrestacionList.css'
import ServicioPrestacionItem from './ServicioPrestacionItem';
import Modal from '../../shared/components/UIElements/Modal'
import { AiFillPlusSquare  } from "react-icons/ai";
const ServicioPrestacionList = ({prestaciones})=>{
    
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const showNuevoMedicamentoHandler = () =>setShowConfirmModal(true);
    const cancelNuevoMedicamentoHandler = () => setShowConfirmModal(false);
    const aparecerMedicamentoUpdateSubmitHandler = async event => {
      event.preventDefault();
      showNuevoMedicamentoHandler();
    }

    return (
      <React.Fragment>
      <Modal
        show = {showConfirmModal}
        onCancel = {cancelNuevoMedicamentoHandler}
        header = 'Medicamento'

        footerClass="ente-item__modal-actions"
        >
        <p>
          Medicamento
        </p>
            
      </Modal>
      
      <button className='buttonPrestacionAdicionar' onClick={aparecerMedicamentoUpdateSubmitHandler}> 
        <AiFillPlusSquare/>  ADD PRESTACION
      </button>
      
      <ul className="ente-list">
      {
        prestaciones && prestaciones.map (
            prestacion => <ServicioPrestacionItem 
                key={prestacion._id} 
                id={prestacion._id}                     
                descripcion = {prestacion.descripcion}
                costo = {prestacion.costo}
                codigoSistema = {prestacion.codigoSistema}
                
                />)
        
    
      } 
      </ul>
    </React.Fragment>
        
      );


};

export default ServicioPrestacionList;
