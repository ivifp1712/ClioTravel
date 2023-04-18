import React, {useEffect, useState} from 'react';
import {  signInWithEmailAndPassword   } from 'firebase/auth';
//import { auth } from '../FirebaseConfig';
import { NavLink, useNavigate } from 'react-router-dom'
import { getAuth, signInWithRedirect, GoogleAuthProvider, getRedirectResult } from "firebase/auth";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './css/login.css'
import { getFirestore, setDoc, collection, getDoc, doc } from 'firebase/firestore';

const provider = new GoogleAuthProvider();
const auth = getAuth();

const Login = () => {
    const firestore = getFirestore();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorCode, setErrorCode] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    
    useEffect(() => {
        if (errorMessage) {
            switch (errorCode) {
                case "auth/invalid-email":
                    // alert("El email no es válido");
                    setErrorMessage("El email no es válido");
                    break;
                case "auth/wrong-password":
                    //alert("La contraseña no es válida");
                    setErrorMessage("La contraseña no es válida");
                    break;
                case "auth/user-not-found":
                    //alert("El usuario no existe");
                    setErrorMessage("El usuario no existe");
                    break;
                case "auth/too-many-requests":
                    //alert("Demasiados intentos, intente más tarde");
                    setErrorMessage("Demasiados intentos, intente más tarde");
                    break;
                default:
                    break;
            }
        }
    }, [errorMessage]);

    const onLoginGoogle = () => {
      signInWithRedirect(auth, provider)
     .then(() => {
       // This gives you a Google Access Token. You can use it to access the Google API.
      //  const credential = GoogleAuthProvider.credentialFromResult(result);
      //  const token = credential.accessToken;
      //  // The signed-in user info.
      //  const user = result.user;
       navigate("/")
     }).catch((error) => {
       // Handle Errors here.
       const errorCode = error.code;
       const errorMessage = error.message;
       // The email of the user's account used.
       const email = error.customData.email;
       // The AuthCredential type that was used.
       const credential = GoogleAuthProvider.credentialFromError(error);
       // ...
     });
   }

    const onLogin = (e) => {
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            navigate("/")
            console.log(user);
        })
        .catch((error) => {
            setErrorCode(error.code);
            setErrorMessage(error.message);
            // console.log(errorCode, errorMessage)
        });
       
    }

    const addUserFirestore = async (auth) => {
      console.log("user uid: ", auth.currentUser.uid)
      const docRef = doc(collection(firestore, "users"), auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          console.log("usuario ya creado!")
        } else {
          const docRef2 = await setDoc(docRef, {
            nombreCompleto: auth.currentUser.displayName,
            email: auth.currentUser.email,
            uid: auth.currentUser.uid,
            username: auth.currentUser.displayName,
            rol: "user"
        });}
      }

    useEffect(() => {
      console.log("auth", auth)
      getRedirectResult(auth)
        .then((result) => {
          console.log("result", result);
          console.log("auth current user", auth.currentUser);
          if (auth.currentUser) {
              console.log("añadiendo usuario", auth.currentUser)
              addUserFirestore(auth)
            }
          //addUserFirestore()
          if (result && result.user != null) {
            navigate('/');
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }, [navigate]);
    
    const centrar = {
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        flexDirection: 'column',
    };

    

    return(
        // <>
        //     <main >        
        //         <section>
        //             <div>                                            
        //                 <p> ClioTravel </p>                                
        //                 <form>                                              
        //                     <div>
        //                         <label htmlFor="email-address">
        //                             Email address
        //                         </label>
        //                         <input
        //                             id="email-address"
        //                             name="email"
        //                             type="email"                                    
        //                             required                                                                                
        //                             placeholder="Email address"
        //                             onChange={(e)=>setEmail(e.target.value)}
        //                         />
        //                     </div>

        //                     <div>
        //                         <label htmlFor="password">
        //                             Password
        //                         </label>
        //                         <input
        //                             id="password"
        //                             name="password"
        //                             type="password"                                    
        //                             required                                                                                
        //                             placeholder="Password"
        //                             onChange={(e)=>setPassword(e.target.value)}
        //                         />
        //                     </div>
                                                
        //                     <div>
        //                         <button                                    
        //                             onClick={onLogin}                                        
        //                         >      
        //                             Login                                                                  
        //                         </button>
        //                     </div>                               
        //                 </form>
                       
        //                 <p className="text-sm text-white text-center">
        //                     No account yet? {' '}
        //                     <NavLink to="/signup">
        //                         Sign up
        //                     </NavLink>
        //                 </p>
                                                   
        //             </div>
        //         </section>
        //     </main>
        // </>
        <div className='contenidoLogin' >   
        <div className="container" style={centrar}>
        {/* <ul className="nav nav-pills nav-justified mb-3" id="ex1" role="tablist">
          <li className="nav-item" role="presentation">
            <a className="nav-link active" id="tab-login" data-mdb-toggle="pill" href="#pills-login" role="tab"
              aria-controls="pills-login" aria-selected="true">Login</a>
          </li>
          <li className="nav-item" role="presentation">
            <a className="nav-link" id="tab-register" data-mdb-toggle="pill" href="#pills-register" role="tab"
              aria-controls="pills-register" aria-selected="false">Register</a>
          </li>
        </ul> */}
        {/* <script src="https://kit.fontawesome.com/d70d441cb5.js" crossorigin="anonymous"></script> */}
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
                <h1>Login</h1>
                {/* <p>Sign in with:</p> */}
                {/* <button type="button" className="btn btn-link btn-floating mx-1"> */}
                {/* <FontAwesomeIcon icon="fab fa-facebook" /> */}
                {/* </button>
        
                <button type="button" className="btn btn-link btn-floating mx-1">
                  <i className="fab fa-google"></i>
                </button>
        
                <button type="button" className="btn btn-link btn-floating mx-1">
                  <i className="fab fa-twitter"></i>
                </button>
        
                <button type="button" className="btn btn-link btn-floating mx-1">
                  <i className="fab fa-github"></i>
                </button> */}
                <div onClick={onLoginGoogle} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px',
                border: '1px solid #D1D1D1',
                borderRadius: '5px',
                cursor: 'pointer',
                backgroundColor: 'rgb(255, 255, 255, 0.5)'
                }}>
                <img src="https://rotulosmatesanz.com/wp-content/uploads/2017/09/2000px-Google_G_Logo.svg_.png" alt="Google logo" style={{
                    width: '40px',
                    height: '40px'
                }} />
                <span style={{
                    fontSize: '16px',
                    fontWeight: 'bold'
                }}>Iniciar sesión con Google</span>
                </div>

              </div>
        
              {/* <p className="text-center">or:</p>*/}
             
              <div className="form-outline mb-4">
                {/* <label className="form-label" htmlFor="loginName">E-mail</label> */}
                <input 
                                id="email-address"
                                            name="email"
                                            type="email"                                    
                                            required                                       
                                            className='form-control'                         
                                            placeholder="Email"
                                            onChange={(e)=>setEmail(e.target.value)} />
              </div>
        
              
              <div className="form-outline mb-4">
                {/* <label className="form-label" htmlFor="loginPassword">Contraseña</label> */}
                <input type="password" className="form-control"  id="password"
                                             name="password"                                
                                             required      
                                             placeholder="Contraseña"
                                             onChange={(e)=>setPassword(e.target.value)}/>
              </div>
        
              {/* <div className="row mb-4">
                  <a href="#!">¿Olvidaste la contraseña?</a>
              </div>
         */}
              <button className="btn btn-primary btn-block mb-4" onClick={onLogin}>Iniciar Sesión</button>

                
              {/* <div>
                 <p> Error: {errorMessage} </p>
              </div> */}
        
              <div className="text-center">
                <p className='negrita'>¿No estas registrado? <a href="/signup">Registrate</a></p>
              </div>
            </form>
          </div>
          {/* <div className="tab-pane fade" id="pills-register" role="tabpanel" aria-labelledby="tab-register">
            <form>
              <div className="text-center mb-3">
                <p>Sign up with:</p>
                <button type="button" className="btn btn-link btn-floating mx-1">
                  <i className="fab fa-facebook-f"></i>
                </button>
        
                <button type="button" className="btn btn-link btn-floating mx-1">
                  <i className="fab fa-google"></i>
                </button>
        
                <button type="button" className="btn btn-link btn-floating mx-1">
                  <i className="fab fa-twitter"></i>
                </button>
        
                <button type="button" className="btn btn-link btn-floating mx-1">
                  <i className="fab fa-github"></i>
                </button>
              </div>
        
              <p className="text-center">or:</p>
        
        
              <div className="form-outline mb-4">
                <input type="text" id="registerName" className="form-control" />
                <label className="form-label" htmlFor="registerName">Name</label>
              </div>

              <div className="form-outline mb-4">
                <input type="text" id="registerUsername" className="form-control" />
                <label className="form-label" htmlFor="registerUsername">Username</label>
              </div>
     
              <div className="form-outline mb-4">
                <input type="email" id="registerEmail" className="form-control" />
                <label className="form-label" htmlFor="registerEmail">Email</label>
              </div>
     
              <div className="form-outline mb-4">
                <input type="password" id="registerPassword" className="form-control" />
                <label className="form-label" htmlFor="registerPassword">Password</label>
              </div>
    
              <div className="form-outline mb-4">
                <input type="password" id="registerRepeatPassword" className="form-control" />
                <label className="form-label" htmlFor="registerRepeatPassword">Repeat password</label>
              </div>
        
 
              <div className="form-check d-flex justify-content-center mb-4">
                <input className="form-check-input me-2" type="checkbox" value="" id="registerCheck"
                  aria-describedby="registerCheckHelpText" />
                <label className="form-check-label" htmlFor="registerCheck">
                  I have read and agree to the terms
                </label>
              </div>
    
              <button className="btn btn-primary btn-block mb-3" onClick={onLogin}>Sign in</button>
            </form>
          </div> */}
        </div>
        </div>
        </div>
    )
}
 
export default Login