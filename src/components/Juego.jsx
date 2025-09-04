import { useEffect, useState } from 'react'
import { useRef } from 'react'
import Tablero from './Tablero'
import Opciones from './Opciones'
import Stats from './Stats'

function Juego() {
  const [cantParesAJugar, setCantParesAJugar] = useState(10)
  const prevValuePares = useRef(10)
  const [resetKey, setResetKey] = useState(0)
  const [clicks, setClicks] = useState(0)
  const [started, setStarted] = useState(false)
  const [pairsLeft, setPairsLeft] = useState(0)

  useEffect(() => {
    reset()
  }, [cantParesAJugar])

  const sumarClick = () => {
    setClicks(prev => {
      if(!prev && !started) setStarted(true)
      return prev + 1
    })
  }

  const reset = () => {
    setResetKey(prev => prev + 1)
    setClicks(0)
    setStarted(false)
    setPairsLeft(0)
  }

  return (
    <main className="juego">
      <Opciones
        cantParesAJugar={cantParesAJugar} 
        setCantParesAJugar={setCantParesAJugar} 
        prevValuePares={prevValuePares}
        reset={reset} 
      />
      <Stats
        totalPairs={cantParesAJugar}
        pairsLeft={pairsLeft}
        clicks={clicks}
        started={started}
      />
      <Tablero 
      key={resetKey} 
      cantParesAJugar={cantParesAJugar} 
      sumarClick={sumarClick}
      setPairsLeft={setPairsLeft}
      />
    </main>
  )
}

export default Juego
