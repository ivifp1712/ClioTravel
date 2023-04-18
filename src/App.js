import logo from './logo.svg';
import './App.css';
import React, {useState, useEffect} from 'react';
import Home from './page/Home';
import Signup from './page/Signup';
import Login from './page/Login';
import { Amigos } from './page/Amigos';
import { Profile } from './page/Profile';
import { BrowserRouter as Router} from 'react-router-dom';
import {Routes, Route} from 'react-router-dom';
import { Viajes } from './page/Viajes';
import { Viaje } from './page/Viaje';
import Deudas from './page/Deudas';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { onAuthStateChanged } from "firebase/auth";
import { auth } from './FirebaseConfig';

function App() {

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

  return (
    <div className="App">
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}
      <Router>
      <div>
        <section>                              
            {/* <Routes>                                                          
               <Route path="/" element={<Home/>}/>
               <Route path="/home" element={<Home/>}/>
               <Route path="/signup" element={<Signup/>}/>
               <Route path="/viajes" element={<Viajes/>}/>
               <Route path="/login" element={<Login/>}/>
                <Route path="/profile" element={<Profile/>}/>
                <Route path="/amigos" element={<Amigos/>}/>
               <Route path="*" element={<Home/>}/>
            </Routes>  
          */}
          {guser &&
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/home" element={<Home />} />
                <Route path="/viajes" element={<Viajes />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/amigos" element={<Amigos />} />
                <Route path="/viaje/:id" element={<Viaje />} />
                <Route path="/viaje" element={<Viajes />} />
                <Route path="/deudas" element={<Deudas user={guser} />} />
                <Route path="/*" element={<Home />} />
              </Routes>
            }
            {!guser &&
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/home" element={<Home />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route path="/*" element={<Home />} />
              </Routes>
            }
        </section>
      </div>
    </Router>
    </div>
  );
}

export default App;
