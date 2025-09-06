import { useEffect, useState, useRef } from 'react'
import Tablero from './Tablero'
import Opciones from './Opciones'
import Stats from './Stats'
import { defineColumns } from '../libs/myFunctions'
import { inicializarFichas } from '../libs/icons'

function Juego() {
  const [fichas, setFichas] = useState([])
  const [isBoardLocked, setIsBoardLocked] = useState(false) // depsues de tocar una ficha incorrecta se lockea el juego por un tiempo
  const [columns, setColumns] = useState(0)
  const [totalPairs, setTotalPairs] = useState(10)
  const prevValuePairs = useRef(10)
  // const [resetKey, setResetKey] = useState(0)
  const [clicks, setClicks] = useState(0)
  const [gameStatus, setGameStatus] = useState(false)
  const [qGuessedPairs, setQGuessedPairs] = useState(0)
  const [hintActive, setHintActive] = useState(false)

  useEffect(() => {
    reset()
  }, [totalPairs])

  useEffect(() => {
    if (fichas.length > 0) {
        const qGuessedPairs = fichas.filter(ficha => ficha.status === 2).length / 2
        setQGuessedPairs(qGuessedPairs)
    }
  }, [fichas])

  const sumarClick = () => {
    setClicks(prev => {
      if(!prev && !gameStatus) setGameStatus(true)
      return prev + 1
    })
  }

  // para opciones:
  const reset = () => {
    // setResetKey(prev => prev + 1)
    setClicks(0)
    setGameStatus(false)
    setQGuessedPairs(0)
    setIsBoardLocked(false)
    setFichas(inicializarFichas(totalPairs))
    setColumns(defineColumns(totalPairs))
    setHintActive(false)
  }

  const hint = () => {
    setFichas(prev => {
      if (!prev || prev.length === 0) return prev
      const candidatas = prev.filter(ficha => ficha.status !== 2)
      if (candidatas.length === 0) return prev
      setHintActive(true)
      const elegida = candidatas[Math.floor(Math.random() * candidatas.length)]
      const pairIdElegido = elegida.pairId
      
      const next = prev.map(ficha =>
        ficha.pairId === pairIdElegido ? { ...ficha, beingHinted: true } : ficha
      )
      return next
    })
  }

  useEffect(() => {
    if (!hintActive) return
    const timeTo = 8 * 1000
    const timer = setTimeout(() => {
      setHintActive(false)
      setFichas(prev =>
        prev.map(ficha => ({ ...ficha, beingHinted: false }))
      )
    }, timeTo)

    return () => clearTimeout(timer)
  }, [hintActive])

  const giveUp = () => {

  }

  return (
    <main className="juego">
      <Opciones
        totalPairs={totalPairs} 
        setTotalPairs={setTotalPairs} 
        prevValuePairs={prevValuePairs}
        reset={reset} 
        hint={hint}
        giveUp={giveUp}
        gameStatus={gameStatus}
        hintActive={hintActive}
      />
      <Stats
        totalPairs={totalPairs}
        qGuessedPairs={qGuessedPairs}
        clicks={clicks}
        gameStatus={gameStatus}
      />
      <Tablero 
      // key={resetKey} 
      fichas={fichas}
      setFichas={setFichas}
      columns={columns}
      isBoardLocked={isBoardLocked}
      setIsBoardLocked={setIsBoardLocked}
      sumarClick={sumarClick}
      />
    </main>
  )
}

export default Juego
