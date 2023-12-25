import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import MessageList from '../components/MessageList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';

const UserMessages = () => {
  const [loadedMessages, setLoadedMessages] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const userId = useParams().userId;

  useEffect(() => {
    const fetchPlaces = async () => {
      try {

        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL  +`/messages/user/${userId}`
        );
        setLoadedMessages(responseData.messages);
      } catch (err) {
      }
    };
    fetchPlaces();
  }, [sendRequest, userId]);

  const messageDeletedHandler = deletedMessageId =>{
    setLoadedMessages (prevMessages => prevMessages.filter (message=>message.id!== deletedMessageId));
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedMessages && <MessageList items={loadedMessages} onDeletePlace = {messageDeletedHandler} />}
    </React.Fragment>
  );
};

export default UserMessages;
