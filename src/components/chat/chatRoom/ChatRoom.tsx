import React, { useState, useEffect} from 'react'
import ChatRoomItem from '../chatRoomItem/ChatRoomItem'

import {
    API,
    Auth,
    graphqlOperation
} from 'aws-amplify'

import { getUser } from './queries'

import './ChatRoom.css'

interface Props {
    getChatId : (id: string) => void
}
const ChatRoom: React.FC<Props> = ({getChatId}) => {

    const [chatRooms, setChatRooms] = useState<any[]>([])
    const [myId, setMyId] = useState('')

    useEffect(() => {
       const fetchChatRooms = async () => {
            const userInfo = await Auth.currentAuthenticatedUser();
            setMyId(userInfo.attributes.sub)
            const userData: any = await API.graphql(graphqlOperation(getUser,{
                id: userInfo.attributes.sub
            }))

            setChatRooms(userData.data?.getUser?.chatRoomUser.items)
            
       }
       fetchChatRooms();
    }, [])

        return (
        <div>
            <p className='sub-header'>Messages</p>
            <input className='search' type='text' placeholder='Search...'/>
            <div className="chat-room-list">
                {chatRooms?.length > 0 ? chatRooms.map(item => <ChatRoomItem  myId={myId} key={item.id} getChatId={getChatId} chatRoom={item.chatRoom}/>) : <span className='sub-header'>No recent chats</span>}
            </div>
        </div>
        );
}

export default ChatRoom;