import React, { useState, useEffect, useRef } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '../FirebaseConfig';
import { Header } from "./Header.js";
// import './css/amigos.css';

export const Amigos = () => {

    let [guser, setGuser] = useState(null);
    useEffect(()=>{
        onAuthStateChanged(auth, (user) => {
            if (user) {
              // User is signed in, see docs for a list of available properties
              // https://firebase.google.com/docs/reference/js/firebase.User
              setGuser(user)
              const uid = user.uid;
              const email = user.email;
                // setCorreo(email)
                // setNombre(user.displayName)
                //setFoto(user.photoURL)

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
        <>
        { guser ? (
            <>
            <Header handleLogout={handleLogout} user={guser}/>
            <h2> Coming soon...</h2>

            </>
        ) : (
          <div> No hay usuario autenticado </div>
          )
        }
        
        </>
    )
}
