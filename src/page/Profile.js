import React, { useState, useEffect, useRef } from "react";
import { onAuthStateChanged, updateProfile } from "firebase/auth";
import { auth } from '../FirebaseConfig';
import { Header } from "./Header.js";
import './css/profile.css';

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
    try {
        await updateProfile(auth.currentUser, {
          displayName: nombre,
          email: correo,
          password: password
        });
        
        console.log("Cambios guardados");
      } catch (error) {
        console.error(error);
      }
  };

  return (
    <>
    {guser ? ( 
    <>
      <Header handleLogout={handleLogout} user={guser}/>
      <main>
        <form onSubmit={manejarSubmit}>
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

        <label htmlFor="password">Correo electrónico:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(evento) => setPassword(evento.target.value)}
          />

          <button type="submit">Guardar cambios</button>
        </form>
      </main>
    </>) : ( <h1>Debes iniciar sesión para ver esta página</h1> )}</>
    );
};
