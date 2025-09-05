import { useEffect, useState } from 'react'
import { useRef } from 'react'
import Tablero from './Tablero'
import Opciones from './Opciones'
import Stats from './Stats'
import { defineColumns } from '../libs/myFunctions'
import { inicializarFichas } from '../libs/icons'

function Juego() {
  const [fichas, setFichas] = useState([])
  const [lock, setLock] = useState(false)
  const [columns, setColumns] = useState(0)
  const [qPlayedPairs, setQPlayedPairs] = useState(10)
  const prevValuePares = useRef(10)
  const [resetKey, setResetKey] = useState(0)
  const [clicks, setClicks] = useState(0)
  const [gameStatus, setGameStatus] = useState(false)
  const [qPairsLeft, setQPairsLeft] = useState(0)
  const [hintActive, setHintActive] = useState(false)

  useEffect(() => {
    reset()
    setFichas(inicializarFichas(qPlayedPairs))
    setColumns(defineColumns(qPlayedPairs))
  }, [qPlayedPairs])

  useEffect(() => {
    if (fichas.length > 0) {
        const qPairsLeft = fichas.filter(ficha => ficha.status === 2).length / 2
        setQPairsLeft(qPairsLeft)
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
    setResetKey(prev => prev + 1)
    setClicks(0)
    setGameStatus(false)
    setQPairsLeft(0)
    setLock(false)
    setFichas(inicializarFichas(qPlayedPairs))
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
        qPlayedPairs={qPlayedPairs} 
        setQPlayedPairs={setQPlayedPairs} 
        prevValuePares={prevValuePares}
        reset={reset} 
        hint={hint}
        giveUp={giveUp}
        gameStatus={gameStatus}
        hintActive={hintActive}
      />
      <Stats
        totalPairs={qPlayedPairs}
        qPairsLeft={qPairsLeft}
        clicks={clicks}
        gameStatus={gameStatus}
      />
      <Tablero 
      key={resetKey} 
      fichas={fichas}
      setFichas={setFichas}
      columns={columns}
      lock={lock}
      setLock={setLock}
      sumarClick={sumarClick}
      />
    </main>
  )
}

export default Juego
