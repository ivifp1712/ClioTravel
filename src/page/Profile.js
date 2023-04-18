import React, { useState, useEffect, useRef } from "react";
import { onAuthStateChanged, updateProfile } from "firebase/auth";
import { auth } from '../FirebaseConfig';
import { Header } from "./Header.js";
import './css/profile.css';
import { Button } from 'react-bootstrap';

export const Profile = () => {
    let [guser, setGuser] = useState(null);
    useEffect(()=>{
        onAuthStateChanged(auth, (user) => {
            if (user) {
              // User is signed in, see docs for a list of available properties
              // https://firebase.google.com/docs/reference/js/firebase.User
              setGuser(user)
              const uid = user.uid;
              const email = user.email;
                setCorreo(email)
                setNombre(user.displayName)
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
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");

  const manejarSubmit = async (evento) => {
    //console.log(auth)
    console.log(auth.currentUser.uid)
    await updateProfile(auth.currentUser, {
      displayName: nombre,
    });
  };

  return (
    <>
    {guser ? ( 
    <>
      <Header handleLogout={handleLogout} user={guser}/>
      <main>
        <form>
          <label htmlFor="nombre">Nombre:</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={nombre}
            onChange={(evento) => setNombre(evento.target.value)}
          />

          <label htmlFor="correo">Correo electrónico:</label>
          <input
            type="email"
            id="correo"
            name="correo"
            value={correo}
            onChange={(evento) => setCorreo(evento.target.value)}
          />
        <br />
          <Button onClick={manejarSubmit}>Guardar cambios</Button>
        </form>
      </main>
    </>) : ( <h1>Debes iniciar sesión para ver esta página</h1> )}</>
    );
};
