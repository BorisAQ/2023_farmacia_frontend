import React, { useEffect, useState, useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import Card from '../../shared/components/UIElements/Card';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH
} from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import './MessageForm.css';

const UpdateMessage = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedMessage, setLoadedMessage] = useState();
  const messageId = useParams().messageId;
  const history = useHistory();

  const [formState, inputHandler, setFormData] = useForm(
    {
      title: {
        value: '',
        isValid: false
      },
      description: {
        value: '',
        isValid: false
      }
    },
    false
  );

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL +  `/messages/${messageId}`
        );
        setLoadedMessage(responseData.message);
        setFormData(
          {
            title: {
              value: responseData.message.title,
              isValid: true
            },
            description: {
              value: responseData.message.description,
              isValid: true
            }
          },
          true
        );

      } catch (err) {}
    };
    fetchMessage();
  }, [sendRequest, messageId, setFormData]);

  const messageUpdateSubmitHandler = async event => {
    event.preventDefault();
    try {
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + `/messages/${messageId}`,
        'PATCH',
        JSON.stringify({
          title: formState.inputs.title.value,
          description: formState.inputs.description.value
        }),
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + auth.token
        }
      );
      history.push('/' + auth.userId + '/messages');
    } catch (err) {}
  };

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!loadedMessage && !error) {
    return (
      <div className="center">
        <Card>
          <h2>Could not find message!</h2>
        </Card>
      </div>
    );
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {!isLoading && loadedMessage && (
        <form className="message-form" onSubmit={messageUpdateSubmitHandler}>
          <Input
            id="title"
            element="input"
            type="text"
            label="Title"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid title."
            onInput={inputHandler}
            initialValue={loadedMessage.title}
            initialValid={true}
          />
          <Input
            id="description"
            element="textarea"
            label="Description"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Please enter a valid description (min. 5 characters)."
            onInput={inputHandler}
            initialValue={loadedMessage.description}
            initialValid={true}
          />
          <Button type="submit" disabled={!formState.isValid}>
            UPDATE MESSAGE
          </Button>
        </form>
      )}
    </React.Fragment>
  );
};

export default UpdateMessage;
