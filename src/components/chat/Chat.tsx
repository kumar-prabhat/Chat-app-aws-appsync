import React, {useState} from 'react'

import './Chat.css'
import ChatRoom from './chatRoom/ChatRoom'
import ChatScreen from './chatScreen/ChatScreen'

interface Props {

}

const Chat: React.FC<Props> = () => {

    const [chatId, setChatId] = useState('')

    const getChatId = (id: string) => {
        setChatId(id)
        
    }
        return (
           <section className="chat-container">
               <aside>
                   <ChatRoom getChatId={getChatId}/>
               </aside>
               <section className="chat-screen">
                   <ChatScreen chatRoomID={chatId} />
               </section>
           </section>
        );
}

export default Chat;