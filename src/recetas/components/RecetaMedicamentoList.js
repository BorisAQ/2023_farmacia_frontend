import React, { useState ,useEffect,  useContext, useReducer} from 'react';
import Button from "../../shared/components/FormElements/Button";
import Input from '../../shared/components/FormElements/Input';
import RecetaMedicamentoItem from "./RecetaMedicamentoItem"
import Modal from '../../shared/components/UIElements/Modal';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { useForm } from '../../shared/hooks/form-hook';
import { FaPills } from "react-icons/fa";
import {
  VALIDATOR_REQUIRE
} from '../../shared/util/validators';
import { AuthContext } from '../../shared/context/auth-context';
import './RecetaList.css'
import { GiConfirmed } from "react-icons/gi";
import { MdOutlineCancel } from "react-icons/md";

const RecetaMedicamentoList = props =>{
  
  
  const auth = useContext(AuthContext);
  const [medicamentos, setMedicamentos] = useState();
  const [prestaciones, setPrestaciones] = useState([]);
  
  useEffect( 
    async =>{

      let x = [...auth.prestaciones]
      props.medicamentos.forEach((medicamento) => {
        for (let index in x) {
          if (x[index].value == medicamento.medicamento.id) {
            x.splice(index, 1);
          }
        }
      });
      setMedicamentos (props.medicamentos);    
      setPrestaciones (x);
      
    },  []
  );



  const [formState, inputHandler, setFormData] = useForm(
    {
      cantidad: {
        value: 1,
        isValid: false
      },      
      idMedicamento: {
        value: '',
        isValid: false
      },      
      
    },
    false
  );

    const {  error, sendRequest, clearError } = useHttpClient();
    
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const showNuevoMedicamentoHandler = () => {
        setShowConfirmModal(true);
      };
    
      const cancelNuevoMedicamentoHandler = () => {
        setShowConfirmModal(false);
      };
    
      const cancelarMedicamentoUpdateSubmitHandler = async event => {
        event.preventDefault();
        cancelNuevoMedicamentoHandler();
      }
      const aparecerMedicamentoUpdateSubmitHandler = async event => {
        event.preventDefault();
        showNuevoMedicamentoHandler();
      }
      

  
      const onDeleteMedicamento= async (id)=>{      
        
        let index = medicamentos.findIndex(medicamento => medicamento.id=== id);        
        const x  =medicamentos.splice(index, 1)[0];        
        setMedicamentos ([...medicamentos]);        
        props.actualizaMedicamentos([...medicamentos])        
        const p1 =[...prestaciones	, {value: x.medicamento.id, label: x.medicamento.descripcion}]       
        setPrestaciones(p1)
        
      }

      
        

    const insertarMedicamentoHandler= async event =>{
        setShowConfirmModal(false);
        event.preventDefault();                
        const  x =prestaciones.filter(medicamento =>
           medicamento.value === formState.inputs.idMedicamento.value)[0];
        var medicamentoNuevo = {
          _id:x.value,
          cantidad: parseInt(formState.inputs.cantidad.value) ,           
           medicamento:{
              id: x.value,
              descripcion: x.label,
              _id: x.value,
              costo: x.costo
           },
           id:x.value
        }                
        const y =[...medicamentos	, medicamentoNuevo]           
        props.actualizaMedicamentos(y)
        setMedicamentos( y);                              

        let index = prestaciones.findIndex(prestacion => prestacion.value=== medicamentoNuevo.id);  
        
        //Prestaciones
        prestaciones.splice(index, 1);
        setPrestaciones ([...prestaciones]);    
        
      }


    
    return (
        <React.Fragment>
          <ErrorModal error={error} onClear={clearError} />
          <Modal
            show={showConfirmModal}
            onCancel={cancelNuevoMedicamentoHandler}
            header="Medicamentos"
            footerClass="ente-item__modal-actions"            
          >
            <p>
              Selecciona el medicamento a para adicionar:
            </p>
              
                  <Input
                    id="idMedicamento"
                    element="selector"                  
                    label="Medicamento"
                    validators={[]}
                    errorText="Por favor introduce el medicamento."
                    onInput={inputHandler}
                    items = {prestaciones}                  
                    initialValue = {prestaciones.length>0 ? prestaciones[0].value:''}                   
                    initialValid={true}
                    
                  />
                  
                <Input
                    id="cantidad"
                    element="input"
                    type="number"
                    label="Cantidad"
                    validators={[VALIDATOR_REQUIRE()]}
                    errorText="Por favor introduce la cantidad"
                    onInput={inputHandler}
                    initialValue={'1'}
                    initialValid={true}
                  />
                  <Button type="submit" onClick= {insertarMedicamentoHandler} disabled={!formState.isValid}>
                    <span className='mostrarBusqueda'>ADICIONAR </span><GiConfirmed/>
                  </Button>
                  <Button danger onClick={cancelarMedicamentoUpdateSubmitHandler}>
                  <span className='mostrarBusqueda'>CANCELAR </span><MdOutlineCancel/>
            </Button>

              

          </Modal>
       
            
            <Button   onClick={aparecerMedicamentoUpdateSubmitHandler} 
              disabled={prestaciones.length===0}>MEDICAMENTO <FaPills/> </Button>
            
             

                <ul className="ente-list">
                {
                    medicamentos && medicamentos.map (
                        medicamento => <RecetaMedicamentoItem 
                            costo={medicamento.medicamento.costoMSC + medicamento.medicamento.costoSD} 
                            descripcion = {medicamento.medicamento.descripcion}
                            cantidad = {medicamento.cantidad}
                            id = {medicamento.codigoSistema}
                            key = {medicamento.codigoSistema}                            
                            onDelete ={
                                onDeleteMedicamento
                            }
                            />)
                    
                }
            </ul>;


      
        </React.Fragment>
      );


};

export default RecetaMedicamentoList;
