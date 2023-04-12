// import React from 'react'
// import "./page/css/hero.css";

// export const Hero = ({handleLogout}) => {
// return (
// <div>
// {/* <nav>
//     <h2>Bienvenido a la aplicación</h2>
//     <button onClick={handleLogout}>Logout</button>
// </nav> */}
// <script src="https://kit.fontawesome.com/d70d441cb5.js" crossOrigin="anonymous"></script>
// <div className="encabezado">
//   <button className="hamburguesa">
//     <img srcSet="/bars-solid.png" />
//   </button>
//   <h1>Mi sitio web</h1>
// </div>
// <div className="contenedor">
//   <div className="menu-lateral">
//     <ul>
//       <li><a href="#">Inicio</a></li>
//       <li><a href="#">Servicios</a></li>
//       <li><a href="#">Productos</a></li>
//       <li><a href="#">Acerca de</a></li>
//       <li><a href="#">Contacto</a></li>
//     </ul>
//   </div>
//   <div className="contenido">
//     <h2>Bienvenido a mi sitio web</h2>
//     <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed in nulla euismod, sagittis dolor ac, blandit risus. Nulla facilisi. Nullam rhoncus vel odio et maximus. Sed tincidunt suscipit eros, non blandit libero laoreet vel. Etiam eget nulla elit. Vestibulum at massa risus. Vestibulum sagittis feugiat sapien, nec vehicula quam.</p>
//   </div>
// </div>

// </div>
// )}

// import React, { useState } from "react";
// import "./page/css/hero.css";

// export const Hero = ({ handleLogout }) => {
//   const [menuOpen, setMenuOpen] = useState(false);

//   const toggleMenu = () => {
//     setMenuOpen(!menuOpen);
//   };

//   return (
//     <div>
//       <div className="encabezado">
//         <button className="hamburguesa" onClick={toggleMenu}>
//           <i className="fas fa-bars"></i>
//         </button>
//         <h1>Mi sitio web</h1>
//       </div>
//       <div className={`contenedor ${menuOpen ? "menu-abierto" : ""}`}>
//         <div className="menu-lateral">
//           <ul>
//             <li>
//               <a href="#">Inicio</a>
//             </li>
//             <li>
//               <a href="#">Servicios</a>
//             </li>
//             <li>
//               <a href="#">Productos</a>
//             </li>
//             <li>
//               <a href="#">Acerca de</a>
//             </li>
//             <li>
//               <a href="#">Contacto</a>
//             </li>
//           </ul>
//         </div>
//         <div className="contenido">
//           <h2>Bienvenido a mi sitio web</h2>
//           <p>
//             Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed in
//             nulla euismod, sagittis dolor ac, blandit risus. Nulla facilisi.
//             Nullam rhoncus vel odio et maximus. Sed tincidunt suscipit eros,
//             non blandit libero laoreet vel. Etiam eget nulla elit. Vestibulum
//             at massa risus. Vestibulum sagittis feugiat sapien, nec vehicula
//             quam.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// import React, { useState } from "react";
// import './page/css/hero.css'

// export const Hero = ({ handleLogout }) => {
//   const [menuAbierto, setMenuAbierto] = useState(false);

//   const toggleMenu = () => {
//     setMenuAbierto(!menuAbierto);
//   };

//   return (
//     <div>
//       <header>
//         <div className="logo">
//           <button onClick={toggleMenu}>Menu</button>
//           <h1>Clio Travel</h1>
//         </div>
//       </header>
//       <div className="contenido">
//         <h2>Bienvenido a Clio Travel</h2>
//         <p>Esta es una aplicación de viajes que te permitirá buscar y reservar los mejores hoteles y actividades en todo el mundo.</p>
//       </div>
//       {menuAbierto && (
//         <nav>
//           <ul>
//             <li>Inicio</li>
//             <li>Destinos</li>
//             <li>Actividades</li>
//             <li>Hoteles</li>
//             <li>Reservas</li>
//           </ul>
//         </nav>
//       )}
//     </div>
//   );
// }

import React, { useState, useEffect, useRef } from "react";
import './page/css/hero.css'
import { Header } from "./page/Header";

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
        {/* <header>
          <div className="logo">
            <button onClick={manejarClickMenu} ref={botonRef}>☰</button>
            <h1>Clio Travel</h1>
            <h3 className="userDisplay"> <span>Bienvenido,</span>  {user.displayName} </h3>
          </div>
        </header>
        <nav className={menuAbierto ? "abierto" : ""} ref={menuRef}>
            <button type="button" className="btn-close btn-close-white" aria-label="Close" onClick={manejarClickCerrar}></button>
            <ul>
                <li>Inicio</li>
                <li>Viajes</li>
                <li>Amigos</li>
                <li>Configuración</li>
                <li><button type="button" className="btn btn-danger" onClick={handleLogout}>Logout</button></li>
               
            </ul>
        </nav> */}
        <Header user={user} handleLogout={handleLogout} />
        <div className="contenido">
          <h2>Bienvenido a Clio Travel</h2>
          <p>
            Selecciona lo que desea hacer en la barra de navegación.
          </p>
        </div>
      </>
    );
}


