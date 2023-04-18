import { getFirestore } from 'firebase/firestore';
import { collection, addDoc, getDocs, deleteDoc, doc, setDoc, getDoc } from "firebase/firestore";
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '../FirebaseConfig';
import { Header } from "./Header.js";
import { Modal, Button, Form, FloatingLabel, Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
// import './page/css/Viajes.css';

export const Viajes = () => {
    const firestore = getFirestore();
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

    const [showModal, setShowModal] = useState(false); // estado para manejar la visibilidad de la ventana flotante

    const handleClose = () => setShowModal(false); // función para cerrar la ventana flotante
    const handleShow = () => {
        setShowModal(true); 
        console.log("abrir")
    }// función para abrir la ventana flotante

    const [nombreViaje, setNombreViaje] = useState('');
    const [consumo, setConsumo] = useState(7.5);
    const [precioGasolina, setPrecioGasolina] = useState(1.6);
    const [distancia, setDistancia] = useState('');
    const [validated, setValidated] = useState(false);

  const handleSubmit = async (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
        let id = Math.floor(100000 + Math.random() * 900000);
        console.log(id);

        const colecRef = collection(firestore, "viajes");
        const docRef = doc(colecRef, id.toString());
        await setDoc(docRef, {
            idViaje: id,
            nombre: nombreViaje,
            consumo: parseFloat(consumo),
            precio: parseFloat(precioGasolina),
            distancia: parseFloat(distancia),
            pasajeros: 0
        });

        // const colecRef2 = collection(firestore, "deudas");
        // const docRef2 = doc(colecRef2, id.toString());
        // await setDoc(docRef2, {
        //     idViaje: id,
        //     nombre: nombreViaje,
        //     consumo: parseFloat(consumo),
        //     precio: parseFloat(precioGasolina),
        //     distancia: parseFloat(distancia),
        //     pasajeros: 1
        // });


            // actualizar la tabla después de agregar el nuevo viaje
            getViajes();
    }
    setValidated(true);
    handleClose();
  };
        const getViajes = async () => {
            const querySnapshot = await getDocs(collection(firestore, "viajes"));
            const viajes = querySnapshot.docs.map(doc => doc.data());
            setViajes(viajes);
        }

        const getDeudas = async () => {
            const querySnapshot = await getDocs(collection(firestore, "deudas"));
            const deudas = querySnapshot.docs.map(doc => doc.data());
            setDeudas(viajes);
        }

    const [deudas, setDeudas] = useState([]); 
    useEffect(() => {
        getDeudas();
    }, []);

    const [viajes, setViajes] = useState([]);

    useEffect(() => {
        getViajes();
    }, []);

    const [viajesUser, setViajesUser] = useState([]);
    useEffect(() => {
        if (viajes != []){
            
        }
    }, [viajes]);

    const handleDelete = async (id) => {
        console.log(id);
        //await deleteDoc(doc(firestore, "viajes", id));
        //await deleteDoc(doc(firestore, "viajes", id));
        console.log(id.id);
        //const docRef = doc(firestore, "viajes", id.idViaje);
        //obtener el doc con el id
        const docRef = doc(firestore, "viajes", id.idViaje.toString());
        console.log(docRef);
        await deleteDoc(docRef);
        // actualizar la tabla después de eliminar el viaje
        getViajes();
        //setViajes(viajes.filter(viaje => viaje.id !== id));
    }

    async function isAdmin(uid) {
        const docRef = doc(collection(firestore, "users"), uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {        
            if (docSnap.data().rol == "admin") {
                console.log("Es admin")
                setAdmin(true);
            }else{
                console.log(docSnap.data().rol)
                setAdmin(false);
                console.log(admin)
            }
           
        } else {
            console.error("Error no esperado!")
        }
      }


    let [admin, setAdmin] = useState(false);
    useEffect(()=>{
        if(guser){
            console.log("iniciando comprobacion de admin")
            isAdmin(guser.uid);
        } 
    }, [guser])

    return (
        <>
        { guser ? (
            <div>
                <Header handleLogout={handleLogout} user={guser}/>
                <div className="container">
                    {/* solo aparece el boton si es admin */}
                    {admin ? (
                        <>
                        <Button variant="primary" onClick={handleShow}>
                            Agregar viaje
                        </Button>

                        <Modal show={showModal} onHide={handleClose}> {/* Ventana flotante */}
                        <Modal.Header closeButton>
                            <Modal.Title>Agregar viaje</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                        <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        <Form.Group controlId="nombreViaje">
                            <Form.Label>Nombre del viaje</Form.Label>
                            <Form.Control required type="text" value={nombreViaje} onChange={(e) => setNombreViaje(e.target.value)} />
                            <Form.Control.Feedback type="invalid">
                            Por favor, introduzca el nombre del viaje.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="consumo">
                            <Form.Label>Consumo L/100 km</Form.Label>
                            <Form.Control type="number" step="0.1" min="0" value={consumo} onChange={(e) => setConsumo(e.target.value)} />
                        </Form.Group>
                        <Form.Group controlId="precioGasolina">
                            <Form.Label>Precio de la gasolina</Form.Label>
                            <Form.Control type="number" step="0.01" min="0" value={precioGasolina} onChange={(e) => setPrecioGasolina(e.target.value)} />
                        </Form.Group>
                        <Form.Group controlId="distancia">
                            <Form.Label>Distancia</Form.Label>
                            <Form.Control required type="number" step="0.1" min="0" value={distancia} onChange={(e) => setDistancia(e.target.value)} />
                            <Form.Control.Feedback type="invalid">
                            Por favor, introduzca la distancia del viaje.
                            </Form.Control.Feedback>
                        </Form.Group>

                            <Button variant="primary" type="submit">
                                Crear viaje
                            </Button>
                            </Form>
                        </Modal.Body>
                        </Modal>
                        </>
                    ) 
                    : () => { return null; } }
                        <>

                        <br />

                    <Table striped bordered hover>
                        <thead>
                            <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Distancia</th>
                            <th>Pasajeros</th>
                            <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {viajes.map((viaje) => (
                            <tr key={viaje.idViaje}>
                                <td> <Link to={`/viaje/${viaje.idViaje}`}>{viaje.idViaje}</Link>
                                 </td>
                                <td>{viaje.nombre}</td>
                                <td>{viaje.distancia}</td>
                                <td>{viaje.pasajeros}</td>
                                <td>
                                    {
                                        admin ? (
                                            <Button variant="danger" onClick={() => handleDelete(viaje)}>Borrar</Button>
                                        ) : (
                                            <Button variant="danger" disabled>Borrar</Button>
                                        )
                                    }
                                
                                </td>
                            </tr>
                            ))}
                        </tbody>
                    </Table> </>
                </div>
            </div>        
        ) : (
            <div> No hay usuario autenticado </div>
        )
        }  
        </>
    )
}
