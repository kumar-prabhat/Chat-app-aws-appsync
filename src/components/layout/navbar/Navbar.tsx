import React from 'react'
import { Link } from 'react-router-dom';

import './Navbar.css'

import { Auth } from 'aws-amplify'

const Navbar: React.FC = () => {
    const logout = async() => {
        try {
            await Auth.signOut();
            console.log("Signed out");
            
        } catch (err) {
            console.log('error signing out: ', err);
        }
    }
        return (
            <nav className="navbar">
                <h1>
                    <Link to="/"><span>LetsVenture</span></Link>
                </h1>
                <ul>
                    <li>
                        <Link to="/"><span>Chat</span></Link>
                    </li>
                    <li>
                        <Link to="/"><span onClick={logout}>SignOut</span> </Link>
                    </li>
                </ul>
            </nav>
        );
}

export default Navbar;