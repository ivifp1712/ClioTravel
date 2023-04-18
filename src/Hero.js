import React, { useState, useEffect, useRef } from "react";
import './page/css/hero.css'
import { Header } from "./page/Header";
import { Card, Button, Dropdown, DropdownButton } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { Link } from "react-router-dom";

export const Hero = ({ handleLogout, user }) => {
    console.log(user)

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
        <Header user={user} handleLogout={handleLogout} />
        <div className="contenido">
          <h2>Bienvenido a Clio Travel</h2>
          <p>
            Selecciona lo que desea hacer en la barra de navegación.
          </p>
        {/*  <div className="d-flex justify-content-center">
       <Card style={{ width: '18rem' }} className="m-4">
        <Card.Body>
          <Card.Title>Viajes</Card.Title>
          <Link to="/viajes" className="btn btn-primary">
            Ver Viajes
          </Link>
        </Card.Body>
      </Card>

      <Card style={{ width: '18rem' }} className="m-4">
        <Card.Body>
          <Card.Title>Deudas</Card.Title>
          <Link to="/deudas" className="btn btn-primary">
            Ver Deudas
          </Link>
        </Card.Body>
      </Card>

      <Card style={{ width: '18rem' }} className="m-4">
        <Card.Body>
          <Card.Title>Perfil</Card.Title>
          <Link to="/perfil" className="btn btn-primary">
            Ver Perfil
          </Link>
        </Card.Body>
      </Card>

      <Card style={{ width: '18rem' }} className="m-4">
        <Card.Body>
          <Card.Title>Amigos</Card.Title>
          <Link to="/amigos" className="btn btn-primary">
            Ver Amigos
          </Link>
        </Card.Body>
      </Card>
    </div> */}
        
        </div>
      </>
    );
}


