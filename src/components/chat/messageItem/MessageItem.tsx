import React from 'react'
import moment from 'moment'

import {Message} from '../../../types'

import './MessageItem.css'

interface Props {
    message: Message,
    myId: string
}

const MessageItem: React.FC<Props> = ({message, myId}) => {

  const isMyMessage = () => {
    return message.user.id === myId;
  }
    
    return (
        <div className="chat-view">
            <div className="chat-message-box" style={{
                backgroundColor: isMyMessage() ? 'rgb(204 254 255)' : 'white',
                marginLeft: isMyMessage() ? '100px' : '0px',
                marginRight: isMyMessage() ? '0px' : '100px',
            }}>
                {!isMyMessage() && <span className="name">{message.user.name}</span>}
                <span className="message">{message.content}</span>
                <span className="chat-time">{moment(message.createdAt).fromNow()}</span>
            </div>
           
        </div>
    );
}

export default MessageItem;