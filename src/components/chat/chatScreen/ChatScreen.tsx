import React, {useState, useEffect} from 'react';
import { Observable } from 'rxjs';

import Chats from '../../../data/Chats';
import { Message, User } from '../../../types'
import MessageItem from '../messageItem/MessageItem'
import UserLists from '../userLists/UserLists'

import {
    Auth,
    API,
    graphqlOperation
} from 'aws-amplify'

import { createMessage, updateChatRoom } from '../../../graphql/mutations'
import { messagesByChatRoom } from '../../../graphql/queries'
import { onCreateMessage } from '../../../graphql/subscriptions'

import './ChatScreen.css'

interface Props {
    chatRoomID: string   
}

type ChatData = {
    id: String,
    users: User[],
    messages: Message[]
}

const ChatScreen: React.FC<Props> = ({chatRoomID}) => {

    const [chatData, setChatData] = useState<ChatData>()
    const [message, setMessage] = useState('');
    const [showUsers, setShowUsers] = useState(false);
    const [showMessages, setShowMessages] = useState(true);
    const [heading, setHeading] = useState('Start new chat');
    const [myId, setMyID] = useState('');
    const [chatMessages, setChatMessages] = useState<any[]>([]);
    const [chatRoomIDFromUserList, setChatRoomIDFromUserList] = useState('');

    const getChatData = async () => {
        setChatData(Chats);
    }

    const fetchMessages = async () => {
        const chatRoomId = chatRoomID || chatRoomIDFromUserList;
        const messageData: any = await API.graphql(graphqlOperation(messagesByChatRoom,{
            chatRoomID: chatRoomId,
            sortDirection: "DESC"
        }))

        setChatMessages(messageData?.data?.messagesByChatRoom?.items)
    }

    useEffect(() => {
        getChatData();

        const fetchUser = async () => {
            const userInfo = await Auth.currentAuthenticatedUser()
            setMyID(userInfo.attributes.sub)
        }
        fetchUser();
    },[])
    
    useEffect(() => {
        fetchMessages()
    }, [fetchMessages])

    useEffect(() => {
        const chatRoomId = chatRoomID || chatRoomIDFromUserList;
        const subscription = (API.graphql(
            graphqlOperation(onCreateMessage)
          ) as unknown as Observable<any>).subscribe({
            next: (data: any) => {
                const newMessage = data.value.data.onCreateMessage;
                
                if(newMessage.chatRoomID !== chatRoomId){
                    console.log("Message for different chat room");
                    return;
                }

                fetchMessages()
            }
        })
        return () => subscription.unsubscribe();
    }, [])

    const updateChatRoomLastMessage = async (messageId: string) => {
        try {
            const chatRoomId = chatRoomID || chatRoomIDFromUserList;
            await API.graphql(graphqlOperation(updateChatRoom,{
                input: {
                    id: chatRoomId,
                    lastMessageID: messageId
                }
            }))
        } catch (err) {
            console.log(err);
        }
    }

    const sendMessage = async () => {

        const selectedChatRoomID = chatRoomID || chatRoomIDFromUserList;

        if(message){
            const newMessageData: any = await API.graphql(graphqlOperation(createMessage,{
                input: {
                    content: message,
                    userID: myId,
                    chatRoomID: selectedChatRoomID
                }
            }))

            setMessage('')

            await updateChatRoomLastMessage(newMessageData.data.createMessage.id)
        }
    }

    const handleChange = (e: any) => {
        setMessage(e.target.value)
    }

    const startNewChat = () => {
        setShowUsers(prev => !prev);
        setShowMessages(prev => !prev);
        setHeading(prev => prev === 'Start new chat' ? 'Go back' : 'Start new chat')
    }

    const handleMessageScreen = (chatRoomID: string) => {
        setChatRoomIDFromUserList(chatRoomID)
        setShowMessages(true);
        setShowUsers(false);
        setHeading('Start new chat')
    } 
        
    return (
    <div className="chat-screen-container">
        <div className="chat-header">
            {
                showUsers ? <span className="chat-header-name">Users</span> : 
                <div className="d-flex">
                    <img src={`${chatData?.users[0].imageUri}`} alt={`${chatData?.users[0].name}`} className="header-avatar"/>
                    <span className="chat-header-name">
                        {chatData?.users[0].name}
                    </span>
                </div>
            }
            <span className="start-new-chat" onClick={startNewChat}>{heading}</span>
        </div>
        <div className="main-chat-screen">
            {
                !showUsers && showMessages ? 
                chatMessages.map(message => <MessageItem key={`${message.id}`} message={message} myId={myId}/>)
                : <UserLists handleMessageScreen={handleMessageScreen} />
            }
        </div>
        <div className="type-message">
            <span>Emoji</span>
            <span>Image</span>
            <textarea placeholder="Type a message..." rows={3} className="message-box" value={message} onChange={handleChange}/>
            <span style={{cursor: 'pointer'}} onClick={sendMessage}>Send</span>
        </div>
    </div>);
}

export default ChatScreen;