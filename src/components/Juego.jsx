import { useState } from 'react'
import { useRef } from 'react'
import Tablero from './Tablero'
import Opciones from './Opciones'

function Juego() {
  const [cantParesAJugar, setCantParesAJugar] = useState(10)
  const prevValuePares = useRef(10)
  const [resetKey, setResetKey] = useState(0)

  const reset = () => {
    setResetKey(prev => prev + 1)
  }

  return (
    <main className="juego">
      <Opciones
        cantParesAJugar={cantParesAJugar} 
        setCantParesAJugar={setCantParesAJugar} 
        prevValuePares={prevValuePares}
        reset={reset} 
      />
      <Tablero 
      key={resetKey} 
      cantParesAJugar={cantParesAJugar} 
      />
    </main>
  )
}

export default Juego
