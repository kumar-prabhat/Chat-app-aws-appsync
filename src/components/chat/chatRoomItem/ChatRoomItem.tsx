import React from 'react'
import moment from 'moment'
import { ChatRoomData } from '../../../types';

import './ChatRoomItem.css'

export type Props = {
    chatRoom: any;
    getChatId : (id: string) => void;
    myId: string;
}

const ChatRoomItem: React.FC<Props> = ({chatRoom, getChatId, myId}) => {

    const handleClick = (e: any) => {
        getChatId(e.currentTarget.id)
        console.log("Clicked",e.currentTarget.id);
        
    }

    const user = chatRoom.chatRoomUsers.items.find((el: any) => el.user.id !== myId).user;

        return (
            <div className="container" onClick={handleClick} id={`${chatRoom.id}`}>
                <div className="left-container">
                    <img src={`${user.imageUri}`} alt={`${user.name}`} className="avatar"/>
                    <div className="mid-container">
                        <span className="username">{user.name}</span>
                        <span className="last-message">
                            {chatRoom.lastMessage ? `${chatRoom.lastMessage.user.name}: ${chatRoom.lastMessage.content.length > 20 ? `${chatRoom.lastMessage.content.slice(0,20)}...` : chatRoom.lastMessage.content}` : ""}
                        </span>
                    </div>
                </div>
                <span className="time">
                     {chatRoom.lastMessage && moment(chatRoom.lastMessage.createdAt).format("DD/MM/YYYY")}
                </span>
            </div>
        );
}

export default ChatRoomItem;