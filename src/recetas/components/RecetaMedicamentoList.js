import React, { useState ,useEffect,  useContext, useReducer} from 'react';

import './RecetaList.css'

import Button from "../../shared/components/FormElements/Button";
import Input from '../../shared/components/FormElements/Input';

import RecetaMedicamentoItem from "./RecetaMedicamentoItem"
import Modal from '../../shared/components/UIElements/Modal';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';

import { useHttpClient } from '../../shared/hooks/http-hook';
import { useForm } from '../../shared/hooks/form-hook';
import {
  VALIDATOR_REQUIRE
} from '../../shared/util/validators';
import { AuthContext } from '../../shared/context/auth-context';

const RecetaMedicamentoList = props=>{
  const auth = useContext(AuthContext);
  const [medicamentos, setMedicamentos] = useState();
  const [prestaciones, setPrestaciones] = useState();

  useEffect( 
    async =>{
      setMedicamentos (props.medicamentos);    
      setPrestaciones (auth.prestaciones);
            
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

    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    
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
        const x=  medicamentos.filter (medicamento=>medicamento.id!== id)
        let index = medicamentos.findIndex(medicamento => medicamento.id=== id);        
        props.medicamentos.splice(index, 1);

        setMedicamentos ([...props.medicamentos]);
        
      }

      
        

      const insertarMedicamentoHandler= async event =>{
        setShowConfirmModal(false);
        event.preventDefault();        
        
        
        const  x =prestaciones.filter(medicamento => medicamento.value === formState.inputs.idMedicamento.value)[0];
        
        
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
        
        props.medicamentos.push (medicamentoNuevo)
        
        
        const y =[...medicamentos	, medicamentoNuevo]        
        setMedicamentos( y);              
        //props.medicamentos.push (prestaciones.filter(medicamento => medicamento.id === formState.inputs.idMedicamento.value)[0])
        
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
              <form className="message-form" onSubmit={cancelarMedicamentoUpdateSubmitHandler}>

                
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

                <Input
                  id="idMedicamento"
                  element="selector"                  
                  label="Medicamento"
                  validators={[]}
                  errorText="Por favor introduce el medicamento."
                  onInput={inputHandler}
                  items = {prestaciones}                  
                  initialValue = {prestaciones ? prestaciones[0].value:''}                   
                  initialValid={true}
                  
                />
                <Button type="submit" onClick= {insertarMedicamentoHandler} disabled={!formState.isValid}>
                  ADICIONAR
                </Button>
                <Button danger onClick={cancelarMedicamentoUpdateSubmitHandler}>
                    CANCELAR
          </Button>

              </form> 

          </Modal>
          <React.Fragment>
            
            <Button   onClick={aparecerMedicamentoUpdateSubmitHandler}>+ MEDICAMENTO</Button>
            
             

                <ul className="ente-list">
                {
                    medicamentos && medicamentos.map (
                        medicamento => <RecetaMedicamentoItem 
                            costo={medicamento.medicamento.costo} 
                            descripcion = {medicamento.medicamento.descripcion}
                            cantidad = {medicamento.cantidad}
                            id = {medicamento.id}
                            key = {medicamento.id}
                            onDelete ={
                                onDeleteMedicamento
                            }
                            />)
                    
                }
            </ul>;


          </React.Fragment>
        </React.Fragment>
      );


};

export default RecetaMedicamentoList;
