import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./css/header.css";
export const Header = ({ handleLogout, user }) => {

    const [menuAbierto, setMenuAbierto] = useState(false);
    const menuRef = useRef(null);
    const botonRef = useRef(null);
  
    function manejarClickMenu() {
      setMenuAbierto(!menuAbierto);
      console.log(menuAbierto);
    }
  
    function manejarClickCerrar() {
        console.log("cerrar");
        setMenuAbierto(false);
    }
  
    function manejarClickFuera(evento) {
      if (menuRef.current && !menuRef.current.contains(evento.target)  &&
      !botonRef.current.contains(evento.target)) {
        setMenuAbierto(false);
        console.log("fuera");
      }
    }
  
    useEffect(() => {
      document.addEventListener("click", manejarClickFuera);
      return () => {
        document.removeEventListener("click", manejarClickFuera);
      };
    }, []);
  
    return (
        <>
        <header>
          <div className="logo">
            <button onClick={manejarClickMenu} ref={botonRef}>☰</button>
            <h1>Clio Travel</h1>
            <h3 className="userDisplay"> <span>Bienvenido,</span>  {user.displayName} </h3>
          </div>
        </header>
        <nav className={menuAbierto ? "abierto" : ""} ref={menuRef}>
            <button type="button" className="btn-close btn-close-white" aria-label="Close" onClick={manejarClickCerrar}></button>
            <ul>
                <li><Link to={"/"}>Inicio</Link> </li>
                <li><Link to={"/viajes"}>Viajes</Link> </li>
                {/* <li><Link to={"/amigos"}>Amigos</Link> </li> */}
                <li><Link to={"/profile"}>Perfil</Link> </li>
                <li><Link to={"/deudas"}>Deudas</Link> </li>
                <li><button type="button" className="btn btn-danger" onClick={handleLogout}>Logout</button></li>
               
            </ul>
        </nav>
      </>
    );
    }