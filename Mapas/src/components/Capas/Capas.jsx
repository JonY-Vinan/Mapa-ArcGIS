import React, { useState, useRef, useEffect } from 'react';
import './Capas.css';
import Capa1 from './Capa1';

const Capas = ({ capa1Visible, setCapa1Visible, mapView }) => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const openNav = () => {
    setIsNavOpen(true);
  };

  const closeNav = () => {
    setIsNavOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

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
      <div id="mySidenav" className="sidenav" style={{ width: isNavOpen ? '250px' : '0' }}>
        <a href="javascript:void(0)" className="closebtn" onClick={closeNav}>
          &times;
        </a>
        <div>
          <h2 id="titleHeader" className="accordion-header">
            <button className="dropbtn" onClick={toggleDropdown}>
              Listado
              <i className="fa fa-caret-down"></i>
            </button>
            <div
              className={`dropdown-content ${isDropdownOpen ? 'show' : ''}`}
              id="myDropdown"
              ref={dropdownRef}
            >
              <label>
                <input
                  type="checkbox"
                  checked={capa1Visible}
                  onChange={(e) => setCapa1Visible(e.target.checked)}
                />
                Activar Capa 1 (Trailheads)
              </label>
              <Capa1 mapView={mapView} capa1Visible={capa1Visible} />
            </div>
          </h2>
        </div>
      </div>

      <span className="open-btn" onClick={openNav}>
        &#9776; CAPAS
      </span>
    </div>
  );
};

export default Capas;