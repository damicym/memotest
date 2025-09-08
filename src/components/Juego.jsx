import { useEffect, useState, useRef } from 'react'
import Tablero from './Tablero'
import Opciones from './Opciones'
import Stats from './Stats'
import { defineColumns } from '../libs/myFunctions'
import { inicializarFichas } from '../libs/icons'

export const FICHA_STATUS = Object.freeze({
  ESCONDIDA: 0,
  MOSTRADA: 1,
  ADIVINADA: 2
})

export const GAME_STATUS = Object.freeze({
  NOT_STARTED: 0,
  STARTED: 1,
  WON: 2,
  GIVEN_UP: 3
})

function Juego() {
  const [fichas, setFichas] = useState([])
  const [isBoardLocked, setIsBoardLocked] = useState(false) // depsues de tocar una ficha incorrecta se lockea el juego por un tiempo
  const [columns, setColumns] = useState(0)
  const [totalPairs, setTotalPairs] = useState(10)
  const prevValuePairs = useRef(10)
  // const [resetKey, setResetKey] = useState(0)
  const [clicks, setClicks] = useState(0)
  const [gameStatus, setGameStatus] = useState(GAME_STATUS.NOT_STARTED)
  const [qGuessedPairs, setQGuessedPairs] = useState(0)
  const [hintActive, setHintActive] = useState(false)
  const wasHintActive = useRef(false)

  useEffect(() => {
    reset()
  }, [totalPairs])

  useEffect(() => {
    if (fichas.length > 0 && gameStatus !== GAME_STATUS.GIVEN_UP) {
      const qGuessedPairs = fichas.filter(ficha => ficha.status === FICHA_STATUS.ADIVINADA).length / 2
      setQGuessedPairs(qGuessedPairs)
    }
  }, [fichas])

  useEffect(() => {
    if(qGuessedPairs === totalPairs) setGameStatus(GAME_STATUS.WON)
  }, [qGuessedPairs])

  useEffect(() => {
    if(gameStatus === GAME_STATUS.GIVEN_UP){
      setFichas(prev => {
        let next = prev.map(ficha =>
        ({ ...ficha, status: FICHA_STATUS.ADIVINADA })
        )
        return next
      })
    }
  }, [gameStatus])

  const sumarClick = () => {
    setClicks(prev => {
      if(prev === 0 && gameStatus === GAME_STATUS.NOT_STARTED) setGameStatus(GAME_STATUS.STARTED)
      return prev + 1
    })
  }

  // para opciones:
  const reset = () => {
    // setResetKey(prev => prev + 1)
    setClicks(0)
    setGameStatus(GAME_STATUS.NOT_STARTED)
    setQGuessedPairs(0)
    setIsBoardLocked(false)
    setFichas(inicializarFichas(totalPairs))
    setColumns(defineColumns(totalPairs))
    setHintActive(false)
    wasHintActive.current = false
  }

  const hint = () => {
    setFichas(prev => {
      if (!prev || prev.length === 0) return prev
      const candidatas = prev.filter(ficha => ficha.status !== FICHA_STATUS.ADIVINADA)
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
    wasHintActive.current = true
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
    setGameStatus(GAME_STATUS.GIVEN_UP)
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
        wasHintActive={wasHintActive}
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