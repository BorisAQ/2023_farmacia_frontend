import React from "react";
import './MessageList.css'
import Card from "../../shared/components/UIElements/Card";

import MessageItem from "./MessageItem";

const MessageList = props=>{
    if (props.items.length ===0 ){
        return <div className="message-list center">
            <Card>
                <h2>No message found, maybe create one?</h2>
                <button>Create Message</button>
            </Card>

        </div>
    }
    return <ul className="message-list">
        {
            props.items.map (
                message => <MessageItem 
                    key={message.id} 
                    id={message.id}                     
                    title = {message.title} 
                    description = {message.description}                     
                    creatorId = {message.creator}                      
                    onDelete ={
                        props.onDeletePlace
                    }
                    />)
        }
    </ul>;
};

export default MessageList;
