import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '../FirebaseConfig';
import { Button } from 'antd';
import { Link } from 'react-router-dom';
import { Hero } from '../Hero';
import fire from '../FirebaseConfig';
import "./css/home.css";


const Home = () => {
    let [guser, setGuser] = useState(null);
    useEffect(()=>{
        onAuthStateChanged(auth, (user) => {
            if (user) {
              // User is signed in, see docs for a list of available properties
              // https://firebase.google.com/docs/reference/js/firebase.User
              setGuser(user)
              const uid = user.uid;
              const email = user.email;
              // ...
              console.log("uid", uid)
              console.log(guser)
            } else {
              // User is signed out
              // ...
              setGuser(null)
              console.log("user is logged out")
            }
          });
         
    }, [])

    const handleLogout =() => {
        auth.signOut()
    }
        
  return (
    <section>        
        {guser ? (
        <Hero handleLogout={handleLogout} user={guser}/>
        ): (
            <div className='contenidoHome'>
            <h1 className='titulo'>Clio Travel</h1>

            <Link to="/login">
                <button className='btn btn-primary botonLogin'> Login </button>
            </Link>
            </div>
        )
        }
    </section>
  )
}
 
export default Home