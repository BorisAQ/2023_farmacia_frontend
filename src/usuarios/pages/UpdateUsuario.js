import React, {useContext,useState, useEffect} from "react";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
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

const UpdateUsuario = ()=>{
  const { error, sendRequest, clearError} = useHttpClient();
  const auth = useContext(AuthContext);
  const [isLoading , setisLoading]= useState (false);
  const history = useHistory();
  const [usuario, setUsuario] = useState(null);

  const [formState,inputHandler, setFormData] = useForm({
    emailU: {value:'', isValid: false},
    nameU: {value:'', isValid: false},
    passwordU: {value:'', isValid: false},
  }, false);

  const usuarioId = useParams().usuarioId;

  useEffect (()=>{
    const fetchUsuario = async ()=> {
        setisLoading(true);        
        try {
            const responseData = await sendRequest(
                process.env.REACT_APP_BACKEND_URL +  `/users/${usuarioId}`,
                'GET',
                null,
                {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + auth.token,            
                }
            );
            setFormData({
                emailU: responseData.email,
                nameU: responseData.name,
                passwordU: responseData.password
            }, true);
            
            setUsuario({name: responseData.usuario.name, email:responseData.usuario.email});
            setisLoading(false);            
        } catch (error) {
            setisLoading(false);
        }
        
    };
    fetchUsuario();    
},[]);

  const modificarUsuarioHandler = async event =>{
    event.preventDefault ();
    console.log (formState.inputs);
    try {
      const responseData = await sendRequest (
          process.env.REACT_APP_BACKEND_URL + `/users/${usuarioId}`,
          'PATCH',
          JSON.stringify ({
            email: formState.inputs.emailU.value, 
            password: formState.inputs.passwordU.value,
            name: formState.inputs.nameU.value
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
            {
            usuario && <Card className= 'authentication'>
              {isLoading && <LoadingSpinner asOverlay/>  }
              <h2>Actualizar usuario {usuario.name}</h2>
              <hr/>
              <form onSubmit = {modificarUsuarioHandler}>
                <Input
                  element = 'input'
                  id ='nameU'
                  type = 'text'
                  label = 'Nombre de usuario'
                  onInput = {inputHandler}
                  validators = {[VALIDATOR_MINLENGTH(5)]}
                  error = 'Introduce el usuario'
                  initialValue = {usuario.name}
                  initialValid = {true}
                />
                <Input
                  id ='emailU'
                  type= 'text'
                  element = 'input'
                  label = 'Email'
                  onInput ={inputHandler}
                  validators={[VALIDATOR_MINLENGTH(5), VALIDATOR_EMAIL]}
                  error = 'Introduce el email'
                  initialValue = {usuario.email}
                  initialValid = {true}
                />
                <Input
                  id = 'passwordU'
                  type= 'password'
                  element = 'input'
                  label = 'Nueva contraseña'
                  onInput ={inputHandler}
                  validators={[VALIDATOR_MINLENGTH(6)]}
                  error = 'Introduce la contraseña con al menos 6 caracteres'                
                />        
                <Button type='Submit' disabled = {!formState.isValid}>
                  ACTUALIZAR
                </Button>                                          
              </form>
            </Card>
            }
            
            
          </React.Fragment>
}

export default UpdateUsuario;