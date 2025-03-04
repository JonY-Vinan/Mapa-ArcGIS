import React, { useState, useRef, useEffect } from 'react';
import './Capas.css'; // Importamos el archivo CSS

const Capas = () => {
  const [isNavOpen, setIsNavOpen] = useState(false); // Estado para el menú lateral
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Estado para el dropdown
  const [isFirstLayerChecked, setIsFirstLayerChecked] = useState(false); // Estado para el checkbox
  const dropdownRef = useRef(null); // Referencia para el dropdown

  // Función para abrir/cerrar el menú lateral
  const openNav = () => {
    setIsNavOpen(true);
  };

  const closeNav = () => {
    setIsNavOpen(false);
  };

  // Función para abrir/cerrar el dropdown
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Función para manejar el cambio del checkbox
  const handleCheckboxChange = () => {
    setIsFirstLayerChecked(!isFirstLayerChecked);
  };

  // Cerrar el dropdown si se hace clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div>
      {/* Side Navigation */}
      <div id="mySidenav" className="sidenav" style={{ width: isNavOpen ? '250px' : '0' }}>
        <a href="javascript:void(0)" className="closebtn" onClick={closeNav}>
          &times;
        </a>
        <div>
          <h2 id="titleHeader" className="accordion-header">
            <button className="dropbtn" onClick={toggleDropdown}>
              Dropdown
              <i className="fa fa-caret-down"></i>
            </button>
            <div
              className={`dropdown-content ${isDropdownOpen ? 'show' : ''}`}
              id="myDropdown"
              ref={dropdownRef}
            >
              <div>
                <label>
                  <input
                    type="checkbox"
                    checked={isFirstLayerChecked}
                    onChange={handleCheckboxChange}
                  />
                  Primera capa
                </label>
              </div>
            </div>
          </h2>
        </div>
        
      </div>

      {/* Main Content */}
      <span className="open-btn" onClick={openNav}>
        &#9776; CAPAS
      </span>

      {/* Texto que se muestra/oculta según el estado del checkbox */}
      {isFirstLayerChecked && (
        <div className="texto-primera-capa">
          Este es el texto de la primera capa.
        </div>
      )}
    </div>
  );
};

export default Capas;