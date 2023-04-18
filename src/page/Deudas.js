import { Header } from "./Header"
import { getFirestore } from 'firebase/firestore';
import { collection, getDocs, doc, setDoc ,getDoc } from "firebase/firestore";
import React, { useState, useEffect, useRef } from "react";
import { auth } from '../FirebaseConfig';
import {Button, Table } from 'react-bootstrap';import { Link } from "react-router-dom";

const Deudas = ({user}) => {

    const firestore = getFirestore();
    let [guser, setGuser] = useState(null);
    useEffect(()=>{
        setGuser(user)
         
    }, [])

    const handleLogout =() => {
        auth.signOut()
    }

    const [deudasUser, setDeudasUser] = useState(null);
    async function fetchDeudasUser() {
            const querySnapshot = await getDocs(collection(firestore, "deudas"));
            const docs = querySnapshot.docs;
            const deudas = docs.map((doc) => ({ ...doc.data(), id: doc.id }));
            // filtrar por idUsuario

            const deudasFiltradas = deudas.filter((deuda) => deuda.idUsuario == user.uid);
            setDeudasUser(deudasFiltradas);
            console.log(deudasFiltradas)
            setDeudas(deudas)
            console.log(deudas)
            }

    useEffect(() => {
        fetchDeudasUser();
    }, []);

    const [deudas, setDeudas] = useState(null);

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

    const pagarDeuda = (deuda) => {
        const docRef = doc(collection(firestore, "deudas"), `${deuda.idViaje}_${deuda.idUsuario}`);
        setDoc(docRef, { 
            idViaje: deuda.idViaje,
            idUsuario: deuda.idUsuario,
            viaje: deuda.viaje,
            importe: deuda.importe,
            pagada: true
        });
        fetchDeudasUser();
    }

    const despagarDeuda = (deuda) => {
        const docRef = doc(collection(firestore, "deudas"), `${deuda.idViaje}_${deuda.idUsuario}`);
        setDoc(docRef, {
            idViaje: deuda.idViaje,
            idUsuario: deuda.idUsuario,
            viaje: deuda.viaje,
            importe: deuda.importe,
            pagada: false
        });
        fetchDeudasUser();
    }

    return(
        <>
        { guser ? (
            <>
            <Header handleLogout={handleLogout} user={guser}/>
            <div className="container">
                <h1>Deudas</h1>

                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>idViaje</th>
                            <th>Viaje</th>
                            <th>importe</th>
                            <th>Pagada</th>
                        </tr>
                    </thead>
                    <tbody>
                        {deudasUser && deudasUser.map((deuda) => (
                            <tr key={deuda.id}>
                                {/* <td>{deuda.idViaje}</td> */}
                                <td> <Link to={`/viaje/${deuda.idViaje}`}>{deuda.idViaje}</Link>
                                 </td>
                                {/* <td>{deuda.idUsuario}</td> */}
                                <td>{deuda.viaje}</td>
                                <td>{deuda.importe}</td>
                                {/* <td>{deuda.pagada.toString() }</td> */}
                                {/* si es false mostrar cruz */}
                                {deuda.pagada ? <td>✅</td> : <td>❌</td>}
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
            </>
        ) : (
            <div> No hay usuario autenticado </div>
        )
        }

        {
            admin ? (
                <>
                <div className="container">
                    <h1>Deudas de todos los usuarios</h1>
                    <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>idViaje</th>
                            <th>idUsuario</th>
                            <th>importe</th>
                            <th>Pagada</th>
                            <th> Marcar como pagada</th>
                        </tr>
                    </thead>
                    <tbody>
                        {deudas && deudas.map((deuda) => (
                            <tr key={deuda.id}>
                                <td> <Link to={`/viaje/${deuda.idViaje}`}>{deuda.idViaje}</Link>
                                 </td>
                                <td>{deuda.idUsuario}</td>
                                <td>{deuda.importe}</td>
                                {/* <td>{deuda.pagada.toString() }</td> */}
                                {/* si es false mostrar cruz */}
                                {deuda.pagada ? <td>✅</td> : <td>❌</td>}
                                <td>

                                {
                                     deuda.pagada ? <Button variant="danger" onClick={() => {
                                        despagarDeuda(deuda);
                                        fetchDeudasUser();
                                    }}>Marcar como despagada</Button> : <Button variant="success" onClick={() => {
                                        pagarDeuda(deuda);
                                        fetchDeudasUser();
                                    }}>Marcar como pagada</Button>
                                }
                                    
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                </div>
                </>
            ) : (
                <div> Si has pagado a Ivi diselo para que te borre la deuda </div>
            )
        }
        </>
    )
}

export default Deudas