import React, {useState, useEffect} from 'react'
import './UserLists.css'

import { API, graphqlOperation } from 'aws-amplify'
import { listUsers } from '../../../graphql/queries'
import UserListItem from '../userListItem/UserListItem'

interface Props {
    handleMessageScreen: (chatRoomid: string) => void
}

const UserLists: React.FC<Props> = ({handleMessageScreen}) => {
    const [users, setUsers] = useState<any[]>([]);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const usersData: any = await API.graphql(graphqlOperation(listUsers))
                setUsers(usersData.data.listUsers.items);
            } catch (err) {
                console.log(err);
            }
        }
        fetchUser()
    }, [])

        return ( <>
            {
                users.map(user => ( <UserListItem key={user.id} user={user} handleMessageScreen={handleMessageScreen}/> ))
            }
        </>);
}

export default UserLists;