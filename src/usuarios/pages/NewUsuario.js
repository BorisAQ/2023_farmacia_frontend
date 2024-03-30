import React, {useContext} from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import { useHttpClient } from "../../shared/hooks/http-hook";
import Card from "../../shared/components/UIElements/Card";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import { VALIDATOR_MINLENGTH , VALIDATOR_EMAIL } from '../../shared/util/validators'
import { useForm } from "../../shared/hooks/form-hook";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { AuthContext } from "../../shared/context/auth-context";
const NewUsuario = ()=>{
  const {isLoading, error, sendRequest, clearError} = useHttpClient();
  const auth = useContext(AuthContext);
  const history = useHistory();
  const [formState,inputHandler, setFormData] = useForm({
    emailC: {value:'', isValid: false},
    nameC: {value:'', isValid: false},
    passwordC: {value:'', isValid: false},
  }, false);

  const adicionarUsuarioHandler = async event =>{
    event.preventDefault ();
    console.log (formState.inputs);
    try {
      const responseData = await sendRequest (
          process.env.REACT_APP_BACKEND_URL + '/users/signup',
          'POST',
          JSON.stringify ({
            email: formState.inputs.emailC.value, 
            password: formState.inputs.passwordC.value,
            name: formState.inputs.nameC.value
          }),
          {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + auth.token
          }          
      )
      history.push (`/usuarios`);
    } catch (error) {         }
  };

  
  return  <React.Fragment>
            <ErrorModal error= {error} onClear = {clearError} ></ErrorModal>
            <Card className= 'authentication'>
              {isLoading && <LoadingSpinner asOverlay/>  }
              <h2>Crear usuario</h2>
              <hr/>
              <form onSubmit = {adicionarUsuarioHandler}>
                <Input
                  element = 'input'
                  id ='nameC'
                  type = 'text'
                  label = 'Nombre de usuario'
                  onInput = {inputHandler}
                  validators = {[VALIDATOR_MINLENGTH(5)]}
                  error = 'Introduce el usuario'
                />
                <Input
                  id ='emailC'
                  type= 'text'
                  element = 'input'
                  label = 'Email'
                  onInput ={inputHandler}
                  validators={[VALIDATOR_MINLENGTH(5), VALIDATOR_EMAIL]}
                  error = 'Introduce el email'
                />
                <Input
                  id = 'passwordC'
                  type= 'password'
                  element = 'input'
                  label = 'Contraseña'
                  onInput ={inputHandler}
                  validators={[VALIDATOR_MINLENGTH(6)]}
                  error = 'Introduce la contraseña con al menos 6 caracteres.'                
                />        
                <Button type='Submit' disabled = {!formState.isValid}>
                  ADICIONAR  
                </Button>                                          
              </form>
            </Card>
            
          </React.Fragment>
}

export default NewUsuario;