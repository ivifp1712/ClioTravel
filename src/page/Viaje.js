import { getFirestore } from 'firebase/firestore';
import { collection, addDoc, getDocs, deleteDoc, doc, setDoc ,getDoc } from "firebase/firestore";
import React, { useState, useEffect, useRef } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '../FirebaseConfig';
import { Header } from "./Header.js";
import { Modal, Button, Form, FloatingLabel, Table } from 'react-bootstrap';
import { useParams } from "react-router-dom";


const Viaje = ({user}) => {
    const firestore = getFirestore();
    const { id } = useParams();
    const [viaje, setViaje] = useState(null);
    async function fetchViaje() {
          const docRef = doc(collection(firestore, "viajes"), id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setViaje(docSnap.data());
          } else {
            console.log("El documento no existe!");
          }
        }
    useEffect(() => {
      fetchViaje();
    }, [id]);

    
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

    const [dentro, setDentro] = useState(false);
    async function fetchDentro() {
            const querySnapshot = await getDocs(collection(firestore, "deudas"));
                const deudas = querySnapshot.docs.map(doc => doc.data());
                console.log(deudas);
                //console.log(user)
                deudas.forEach(deuda => {
                  if (deuda.idViaje == id && deuda.idUsuario == user.uid) {
                    console.log("dentro")
                    setDentro(true);
                  }
                });
          }
    useEffect(() => {
        fetchDentro();
      }, [id]);

    const handleAdd = async () => {
      cambiarPasajeros(viaje.pasajeros + 1)
      fetchViaje();
      const colecRef2 = collection(firestore, "deudas");
        const docRef2 = doc(colecRef2, `${id}_${guser.uid}`);
        await setDoc(docRef2, {
          idViaje: id.toString(),
          idUsuario: guser.uid,
          viaje: viaje.nombre,
          importe: ((((viaje.distancia * viaje.consumo) / 100 ) * viaje.precio) / (viaje.pasajeros + 1)).toFixed(2),
          pagada: false
        });
        
        const querySnapshot = await getDocs(collection(firestore, "deudas"));
        const deudas = querySnapshot.docs.map(doc => doc.data());
        deudas.forEach(deuda => {
          if (deuda.idViaje == id && deuda.idUsuario != guser.uid) {
            const colecRef2 = collection(firestore, "deudas");
            const docRef2 = doc(colecRef2, `${id}_${deuda.idUsuario}`);
            setDoc(docRef2, {
              idViaje: id.toString(),
              idUsuario: deuda.idUsuario,
              viaje: viaje.nombre,
              importe: ((((viaje.distancia * viaje.consumo) / 100 ) * viaje.precio) / (viaje.pasajeros + 1)).toFixed(2),
              pagada: false
            });
          }
        });
        fetchDentro();
    }

    const handleDelete = async () => {
     
      const colecRef2 = collection(firestore, "deudas");
        const docRef2 = doc(colecRef2, `${id}_${guser.uid}`);
        await deleteDoc(docRef2);
        cambiarPasajeros(viaje.pasajeros - 1)
        setDentro(false);
        fetchViaje();
        cambiarImporte(((((viaje.distancia * viaje.consumo) / 100 ) * viaje.precio) / viaje.pasajeros).toFixed(2))
    }

    const cambiarPasajeros = async (pasajeros) => {
      const colecRef2 = collection(firestore, "viajes");
        const docRef2 = doc(colecRef2, id);
        await setDoc(docRef2, {
          idViaje: id.toString(),
          nombre: viaje.nombre,
          distancia: viaje.distancia,
          consumo: viaje.consumo,
          precio: viaje.precio,
          pasajeros: pasajeros
        });
    }

    const cambiarImporte = async (importe) => {

        console.log(importe)
        const colecRef2 = collection(firestore, "deudas");
        const docRef2 = doc(colecRef2, `${id}_${guser.uid}`);
        await setDoc(docRef2, {
          idViaje: id.toString(),
          idUsuario: guser.uid,
          viaje: viaje.nombre,
          importe: importe,
          pagada: false
        });

        const querySnapshot = await getDocs(collection(firestore, "deudas"));
        const deudas = querySnapshot.docs.map(doc => doc.data());
        deudas.forEach(deuda => {
          if (deuda.idViaje == id && deuda.idUsuario != guser.uid) {
            const colecRef2 = collection(firestore, "deudas");
            const docRef2 = doc(colecRef2, `${id}_${deuda.idUsuario}`);
            setDoc(docRef2, {
              idViaje: id.toString(),
              idUsuario: deuda.idUsuario,
              viaje: viaje.nombre,
              importe: importe,
              pagada: false
            });
          }
        });
    }
  
    // Renderizar el contenido de la página una vez que se han obtenido los datos del viaje
    return (
      <div>
        {viaje ? ( 
          <>
            <Header handleLogout={handleLogout} user={guser}/>
            <h1>Detalle del viaje</h1>
            <h2>{viaje.nombre}</h2>
            <p>{viaje.distancia} km</p>
            <p>{viaje.consumo} l/100km</p>
            <p>{viaje.precio} €/l</p>
            <p>{viaje.pasajeros} pasajeros</p>
            <p>{(((viaje.distancia * viaje.consumo) / 100 ) * viaje.precio).toFixed(2)} €</p>
            <p>{((((viaje.distancia * viaje.consumo) / 100 ) * viaje.precio) / viaje.pasajeros).toFixed(2)} € por persona</p>
          </>
        ) : (
          <p>Cargando...</p>
        )}

        {
          dentro ? (
            <div>
              <h2>Estás dentro</h2>
              <Button variant="danger" onClick={handleDelete}>
                  Bajarme del clio
              </Button>
            </div>
          ) : (
            <div>
              <h2>No estas en este viaje</h2>
              <Button variant="success" onClick={handleAdd}>
                  Subirme al clio
              </Button>
            </div>
          )
        }
      </div>
    );
  }

export default Viaje;