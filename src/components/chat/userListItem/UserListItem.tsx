import React, {useState, useEffect} from 'react'
import { User } from '../../../types';

import { Auth, API, graphqlOperation} from 'aws-amplify'
import { createChatRoom, createChatRoomUser} from '../../../graphql/mutations'

import './UserListItem.css'

interface Props {
    user: User,
    handleMessageScreen: (chatRoomId: string) => void
}

const UserListItem: React.FC<Props> = ({handleMessageScreen, user: {id, name, imageUri}}) => {
    const [authenticatedId, setAuthenticatedId] = useState()

    useEffect(() => {
        const setAuthenticatedUser = async () => {
            const userInfo: any = await Auth.currentAuthenticatedUser();
            setAuthenticatedId(userInfo.attributes.sub)
        }
        setAuthenticatedUser();
    }, [])
    const handleClick = async (e: any) => {
        try {
            //Create chat room
            const newChatRoomData: any = await API.graphql(graphqlOperation(createChatRoom, {
                input: {
                    //Adding dummy data while creating
                    lastMessageID: 'zzzz8b6b-7556-4b11-9d28-5f001341c5ba'
                }
            }))

            if(!newChatRoomData.data){
                console.log("Failed to create a chat room");
                return;
            }

            const newChatRoom = newChatRoomData.data.createChatRoom;

            //Add user to chat room
            await API.graphql(graphqlOperation(createChatRoomUser,{
                input:{
                    userID: id,
                    chatRoomID: newChatRoom.id
                }
            }))

            //Add authenticated user to chat room
            await API.graphql(graphqlOperation(createChatRoomUser,{
                input:{
                    userID: authenticatedId,
                    chatRoomID: newChatRoom.id
                }
            }))

            handleMessageScreen(newChatRoom.id)
            
        } catch (err) {
            console.log(err);
            
        }
    }

        return ( <>
                { authenticatedId !== id && 
                    <div className="user-container" onClick={handleClick}>
                    <img src={`${imageUri}`} className="user-avatar" alt={`${name}`}/>
                    <span className="user-name">{`${name}`}</span>
                </div>
                }
            </>
        );
}

export default UserListItem;