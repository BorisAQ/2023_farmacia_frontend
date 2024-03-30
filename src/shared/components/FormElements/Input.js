import React, { useReducer, useEffect } from 'react';
import ServicioUsuarioList from '../../../servicio/components/ServicioUsuarioList';
import ServicioPrestacionList from '../../../servicio/components/ServicioPrestacionList';
import RecetaMedicamentosItem from '../../../recetas/components/RecetaMedicamentoList'
import { validate } from '../../util/validators';
import './Input.css';
import Select from 'react-select'
import RecetaMedicamentoList from '../../../recetas/components/RecetaMedicamentoList';

const inputReducer = (state, action) => {
  switch (action.type) {
    case 'CHANGE':
      return {
        ...state,
        value: action.val,
        isValid: validate(action.val, action.validators)        
      };
    case 'TOUCH': {
      return {
        ...state,
        isTouched: true
      }
    }
    default:
      return state;
  }
};

const Input = props => {
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: props.initialValue || '',
    isTouched: false,
    isValid: props.initialValid || false
  });

  const { id, onInput } = props;
  const { value, isValid } = inputState;

  useEffect(() => {
    onInput(id, value, isValid)
  }, [id, value, isValid, onInput]);

  const {onCambio}= props;
  const changeHandler = event => {
    dispatch({
      type: 'CHANGE',
      val: event.target.value,
      validators: props.validators      
    });
    if (onCambio){
      event.preventDefault();
      onCambio(event.target.value);
    }
    
  };

  const changeHandlerSelector= event => {
    dispatch({
      type: 'CHANGE',
      val: event.value,
      validators: props.validators      
    });
    
  };

  const touchHandler = () => {
    dispatch({
      type: 'TOUCH'
    });
  };

  let element;
  
  if (props.element === 'input'){
    element = <input
        id={props.id}
        type={props.type}
        placeholder={props.placeholder}
        onChange={changeHandler}
        onBlur={touchHandler}
        value={inputState.value}
      />
  }
  if (props.element === 'textarea'){
    element = <textarea
    id={props.id}
    rows={props.rows || 3}
    onChange={changeHandler}
    onBlur={touchHandler}
    value={inputState.value}
    />
  }
  if (props.element === 'date'){
    element = <input
    id={props.id}
    type={props.type}
    placeholder={props.placeholder}
    onChange={changeHandler}
    onBlur={touchHandler}
    value={inputState.value}
  />
  }
  
  if (props.element === 'select'){
    element = <select
    id={props.id}
    
    onChange={changeHandler}
    onBlur={touchHandler}
    
    value={inputState.value}  
    >
      {
        props.valoresSeleccion.map(
          item => <option value={item.id}>{item.name}</option>    
        )
      }      
    </select>
  }

  if (props.element === 'usuarios'){
    element = <ServicioUsuarioList
    id={props.id}
    items= {props.usuarios}//referencia
    todoslosUsuarios = {props.todoslosUsuarios  } 
    value={inputState.value}  
    onChange={changeHandler}
    onBlur={touchHandler}
    
    />   
  }

  if (props.element === 'medicamentos'){
    element = <RecetaMedicamentoList
    id={props.id}
    
    medicamentos = {props.medicamentos  } 
    value={inputState.value}  
    onChange={changeHandler}
    onBlur={touchHandler}
    
    />   
  }


  if (props.element === 'selector'){
    element = <Select   id = {props.id} options= {props.items} 
    
    defaultValue={ props.items? props.items.filter (item => item.value === props.initialValue):null}
    onChange={changeHandlerSelector}
    theme={(theme) => ({
      ...theme,
      borderRadius: 0,
      colors: {
        ...theme.colors,
        
    
    danger: 'red',
    dangerLight: 'purple',
    
    neutral0: 'gray',
    neutral5: "orange",
    neutral10: 'red',
    neutral20:'white',
    neutral30: 'red',
    neutral40: 'red',
    neutral50: '0E6BA8',//black
    neutral60: '#0E6BA8',
    neutral70: '0E6BA8',//
    neutral80: '0E6BA8',//
    primary: 'white',
    primary25: '0E6BA8',//
    primary50: '0E6BA8',//
    primary75: '0E6BA8',  //
      }
      
    })}
    />
  }


  return (
    <div
      className={`form-control ${!inputState.isValid && inputState.isTouched &&
        'form-control--invalid'}`}
    >
      <label htmlFor={props.id}>{props.label}</label>
      {element}
      {!inputState.isValid && inputState.isTouched && <p>{props.errorText}</p>}
    </div>
  );
};

export default Input;
