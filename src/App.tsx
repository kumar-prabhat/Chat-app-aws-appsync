import React, {useEffect, useCallback, useMemo} from 'react'
import { BrowserRouter as Router } from 'react-router-dom'

import Navbar from './components/layout/navbar/Navbar';
import Chat from './components/chat/Chat'

import './App.css'


import { Auth, API, graphqlOperation } from 'aws-amplify'
import { getUser } from './graphql/queries'
import { createUser } from './graphql/mutations'

import Amplify from 'aws-amplify';
import awsconfig from './aws-exports';
import { AmplifySignOut, withAuthenticator } from '@aws-amplify/ui-react';

Amplify.configure(awsconfig);


interface Props {

}

const App: React.FC<Props> = () => {
  const randomImages = useMemo(() => {
      return [
        "https://filmfare.wwmindia.com/content/2020/aug/akshay-kumar-income-11597304007.jpg",
        "https://www.gstatic.com/tv/thumb/persons/238324/238324_v9_ba.jpg",
        "https://filmfare.wwmindia.com/content/2020/aug/ajaydevgnannualincome41597836187.jpg",
        "https://pbs.twimg.com/profile_images/1318788393787031552/OBdvT5tK.jpg"
      ];
  },[]) 

  const getRandomImage = useCallback(
    () => {
      return randomImages[Math.floor(Math.random() * randomImages.length)]
    },
    [randomImages]
  )

  useEffect(() => {
    const fetchUser = async () => {
      try {
        
        const userInfo = await Auth.currentAuthenticatedUser({bypassCache: true});

        if(userInfo){
          const userData: any = await API.graphql(graphqlOperation(getUser, {id: userInfo.attributes.sub}))
          
          if(userData.data.getUser){
            console.log("User is already registered in database");
            return;
          }

          const newUser = {
            id: userInfo.attributes.sub,
            name: userInfo.username,
            imageUri: getRandomImage(),
            status: "Hey there! I am using chat app"
          }

          await API.graphql(graphqlOperation(createUser, {input: newUser}))
        }
          
      } catch (err) {
        console.log(err);
      }
    }
    fetchUser()

  }, [getRandomImage])
    return (
      <Router>
        <AmplifySignOut />
        <Navbar/>
        <Chat/>
      </Router>
    );
}

export default withAuthenticator(App); 