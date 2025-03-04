import { useState } from 'react'

import './App.css'


import Header from './components/Header/Header.jsx';
import Mapas from './components/Mapas/Mapa.jsx';
import Capas from './components/Capas/Capas.jsx';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        
        <Header />
        <Capas />
        <Mapas />
      </div>
    </>
  )
}

export default App