import React, {useEffect, useState} from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {  createUserWithEmailAndPassword, updateProfile  } from 'firebase/auth';
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';
import { collection, addDoc, doc, setDoc } from "firebase/firestore";
import {db } from '../FirebaseConfig';

const auth = getAuth();
const Signup = () => {
    const firestore = getFirestore();
    const navigate = useNavigate();
 
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [username, setUsername] = useState('');
    const [errorMessage, setErrorMessage] = useState(null);
    const [errorCode, setErrorCode] = useState(null);

    useEffect(() => {
        if (errorMessage) {
            switch (errorCode) {
                case "auth/email-already-in-use":
                    setErrorMessage("El email ya está en uso");
                  break;
                case "auth/weak-password":
                    setErrorMessage("La contraseña es muy débil");
                  break;
                case "auth/invalid-email":
                    setErrorMessage("El email no es válido");
                  break;
                default:
                    setErrorMessage("Hubo un error inesperado al crear la cuenta.");
                  break;
              }
            setTimeout(() => {
                setErrorMessage(null);
            }, 3000);
        }
    }, [errorMessage]);

 
    const onSubmit = async (e) => {
        e.preventDefault();
        
        try {
          // Create user with email and password
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            console.log("uid", userCredential.user.uid)
            //   userCredential.user.uid
            // const docuRef = doc(firestore, `usuarios/${userCredential.user.uid}`);
            // setDoc(docuRef, { 
            //     nombre: displayName,
            //     email: email,
            //     uid: userCredential.user.uid,
            //     rol: 'cliente'
            // });

            // const docRef = await addDoc(collection(firestore, "usuarios"), {
            //     nombreCompleto: displayName,
            //     email: email,
            //     uid: userCredential.user.uid,
            //     username: username,
            //     rol: "user"
            // }); 

            const colecRef = collection(firestore, "users");
            const docRef = doc(colecRef, userCredential.user.uid);
            await setDoc(docRef, {
                  nombreCompleto: displayName,
                  email: email,
                  uid: userCredential.user.uid,
                  username: username,
                  rol: "user"
            });

          // Update user display name
          await updateProfile(userCredential.user, {
            displayName: displayName
          });

      
          // Navigate to login page
          navigate("/   ");
        } catch (error) {
          setErrorCode(error.code);
          setErrorMessage(error.message);
          console.log(errorCode, errorMessage);
        }
      };
      
    const centrar = {
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        flexDirection: 'column',
    };
 
  return (
    <main >    

<div className='contenidoLogin'>   
        <div className="container" style={centrar}>
        <div className="tab-content">
          <div className="tab-pane fade show active" id="pills-login" role="tabpanel" aria-labelledby="tab-login">
            <form>
              <div className="text-center mb-3">
              {
                  errorMessage && (
                    <div className="alert alert-danger" role="alert">
                      {errorMessage}
                    </div>
                  )
                }
                <h1>Signup</h1>

              </div>
              <div className="form-outline mb-4">
                <input 
                    id="display-name"
                    name="displayName"
                    type="text"                            
                    required  
                    value={displayName}                              
                    className='form-control'                 
                    placeholder="Nombre completo"
                    onChange={(e)=>setDisplayName(e.target.value)} 
                />
                </div>
                <div className="form-outline mb-4">
                <input 
                    id="display-name"
                    name="username"
                    type="text"                            
                    required  
                    value={username}                              
                    className='form-control'                 
                    placeholder="Nombre de usuario"
                    onChange={(e)=>setUsername(e.target.value)} 
                />
                </div>
              <div className="form-outline mb-4">
                <input 
                                id="email-address"
                                            name="email"
                                            type="email"                            
                                            required  
                                            value={email}                              
                                            className='form-control'                 
                                            placeholder="Email"
                                            onChange={(e)=>setEmail(e.target.value)} />
              </div>
        
              
              <div className="form-outline mb-4">
                <input type="password" className="form-control"  id="password"
                                             name="password"                         value={password}
                                             required      
                                             placeholder="Contraseña"
                                             onChange={(e)=>setPassword(e.target.value)}/>
              </div>
              

              <button className="btn btn-primary btn-block mb-4" onClick={onSubmit}>Registrase</button>
    
            </form>
          </div>
        </div>
        </div>
        </div>
    </main>


  )
}
 
export default Signup