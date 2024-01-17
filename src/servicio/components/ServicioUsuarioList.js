import React, { useState ,useEffect,  useContext, useReducer} from 'react';

import './ServicioList.css'

import Button from "../../shared/components/FormElements/Button";
import Input from '../../shared/components/FormElements/Input';
import ServicioUsuarioItem from "./ServicioUsuarioItem";
import Modal from '../../shared/components/UIElements/Modal';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';

import { useHttpClient } from '../../shared/hooks/http-hook';
import { useForm } from '../../shared/hooks/form-hook';
import {
  VALIDATOR_REQUIRE
} from '../../shared/util/validators';

const ServicioUsuarioList = props=>{
  const [usuariosProps, setUsuariosProps] = useState();


  useEffect( 
    async =>{
      setUsuariosProps (props.items)
      
    },  []
  );
  const [formState, inputHandler, setFormData] = useForm(
    {
      idusuarios: {
        value: '',
        isValid: false
      },      
    },
    false
  );

    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const showNuevoPersonalHandler = () => {
        setShowConfirmModal(true);
      };
    
      const cancelNuevoPersonalHandler = () => {
        setShowConfirmModal(false);
      };
    
      const cancelarservicioUpdateSubmitHandler = async event => {
        event.preventDefault();
        cancelNuevoPersonalHandler();
      }
      const aparecerservicioUpdateSubmitHandler = async event => {
        event.preventDefault();
        showNuevoPersonalHandler();
      }
      

  
      const onDeleteUsuario = async (id)=>{      
        const x=  usuariosProps.filter (usuario=>usuario.id!== id)
        let index = usuariosProps.findIndex(usuario => usuario.id=== id);        
        props.items.splice(index, 1);
        setUsuariosProps (x);                        
      }
        

      const insertarUsuarioHandler= async event =>{
        
        event.preventDefault();        
        setShowConfirmModal(false);
        
        const  x =props.todoslosUsuarios.filter(usuario => usuario.id === formState.inputs.idusuarios.value)[0];
        const y =[...usuariosProps	, x]        
        setUsuariosProps( y);              
        props.items.push (props.todoslosUsuarios.filter(usuario => usuario.id === formState.inputs.idusuarios.value)[0])

      }

    
    return (
        <React.Fragment>
          <ErrorModal error={error} onClear={clearError} />
          <Modal
            show={showConfirmModal}
            onCancel={cancelNuevoPersonalHandler}
            header="Usuarios"
            footerClass="ente-item__modal-actions"
            
          >
            <p>
              Selecciona el usuario para adicionar:
              <form className="message-form" >
                <Input element = "select" id= "idusuarios" valoresSeleccion= {props.todoslosUsuarios} 
                  onInput={inputHandler}
                  validators={[VALIDATOR_REQUIRE()]}
                  initialValid={false}
                  
                />
                <Button type="submit" onClick= {insertarUsuarioHandler} disabled={!formState.isValid}>
                  ACTUALIZAR
                </Button>
              </form> 
            </p>
          </Modal>
          <React.Fragment>
            
            <Button   onClick={aparecerservicioUpdateSubmitHandler}>+ USUARIO</Button>
            
             

                <ul className="ente-list">
                {
                    usuariosProps && usuariosProps.map (
                        usuario => <ServicioUsuarioItem 
                            key={usuario.id} 
                            id={usuario.id}                     
                            nombre = {usuario.name}                     
                            onDelete ={
                                onDeleteUsuario
                            }
                            />)
                    
                }
            </ul>;


          </React.Fragment>
        </React.Fragment>
      );


};

export default ServicioUsuarioList;
