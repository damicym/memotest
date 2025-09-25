import { useEffect, useState, useRef } from 'react'
import Tablero from './Tablero'
import Opciones from './Opciones'
import Stats from './Stats'
import { defineColumns, inicializarFichas } from '../libs/myFunctions'
import { fireWin } from '../libs/confetti'

export const FICHA_STATUS = Object.freeze({
  ERROR: -1,
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

export const TIMINGS = Object.freeze({
  BEFORE_HIDING_FICHA: 0.95 * 1000,
  FICHA_FLIP: 0.5 * 1000,
  HINT_COOLDOWN: 6 * 1000,
  BETWEEN_ANIMATED_DOTS: 0.6 * 1000,
  SHINE_DURATION: 4 * 1000,
  BETWEEN_FICHA_SHINE: 0.8 * 1000,
  SHINE_CYCLE: 4.6 * 1000,  // suma de los 2 anteriores
  BETWEEN_WIN_CONFETTI: 0.5 * 1000,
})

export const GAME_RULES = Object.freeze({
  MAX_HINTS: 3,
  EXCLUDED_Q_PAIRS: [34, 38, 46]
})

function Juego() {
  const [totalPairs, setTotalPairs] = useState(10)
  const prevValuePairs = useRef(10)
  const [fichas, setFichas] = useState([])
  const [columns, setColumns] = useState(0)
  const [isBoardLocked, setIsBoardLocked] = useState(false) // depsues de tocar una ficha incorrecta se lockea el juego por un tiempo
  const [clicks, setClicks] = useState(0)
  const [errors, setErrors] = useState(0)
  const [gameStatus, setGameStatus] = useState(GAME_STATUS.NOT_STARTED)
  const [qGuessedPairs, setQGuessedPairs] = useState(0)
  const [hintActive, setHintActive] = useState(false)
  const wasHintActive = useRef(false)
  const [shouldFichasAnimate, setShouldFichasAnimate] = useState(true)
  const [shapesNColors, setShapesNColors] = useState([])
  const [usedHints, setUsedHints] = useState(0)

  useEffect(() => {
    reset("totalPairsChange")
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
    if(gameStatus === GAME_STATUS.STARTED){
      setShouldFichasAnimate(true)
    }
    else if(gameStatus === GAME_STATUS.GIVEN_UP){
      setIsBoardLocked(true)
      let next = [...fichas]
      next.forEach(f => f.status = FICHA_STATUS.ADIVINADA)
      setFichas(next)
      setHintActive(false)
      wasHintActive.current = false
    }
    else if(gameStatus === GAME_STATUS.WON){
      fireWin()
    }
  }, [gameStatus])

  useEffect(() => {
    if (clicks % 2 !== 0) return
    if (fichas.length === 0) return
    if(gameStatus === GAME_STATUS.GIVEN_UP) return
    const qGuessedPairs = fichas.filter(ficha => ficha.status === FICHA_STATUS.ADIVINADA).length / 2
    const attempts = clicks / 2
    setErrors(Math.max(0, attempts - qGuessedPairs))
  }, [clicks, fichas]);


  const sumarClick = () => {
    setClicks(prev => {
      if(prev === 0 && gameStatus === GAME_STATUS.NOT_STARTED) setGameStatus(GAME_STATUS.STARTED)
      return prev + 1
    })
  }

  // para opciones:
  const reset = (via = "resetBtn") => {
    setShapesNColors(prev => prev.length > 0 ? [] : prev)
    setIsBoardLocked(true)

    let next = [...fichas]
    next.forEach(f => f.status = FICHA_STATUS.ESCONDIDA)
    setFichas(next)

    setUsedHints(0)
    setErrors(0)
    setClicks(0)
    setGameStatus(GAME_STATUS.NOT_STARTED)
    setColumns(defineColumns(totalPairs))
    setQGuessedPairs(0)
    setHintActive(false)
    wasHintActive.current = false

    if(via == "totalPairsChange"){
      setShouldFichasAnimate(false)
      setFichas(inicializarFichas(totalPairs))
      setIsBoardLocked(false)
    } else if(via == "resetBtn"){
      setShouldFichasAnimate(true)
      setTimeout(() => {
        setFichas(inicializarFichas(totalPairs))
        setIsBoardLocked(false)
      }, TIMINGS.FICHA_FLIP)
    }
  }
  // que cuando se resetee por cambio de totalParis
  // no se animen las fichas
  // sí se deberian animar cuando:
  // la primera vez que se toca, durante el juego, cuando se resetea desde el btn

  const hint = () => {
    if (!fichas || fichas.length === 0) return
    const candidatas = fichas.filter(ficha => ficha.status !== FICHA_STATUS.ADIVINADA)
    if (candidatas.length === 0) return
    if (usedHints >= GAME_RULES.MAX_HINTS) return
    setUsedHints(prev => prev + 1)
    setHintActive(true)
    const elegida = candidatas[Math.floor(Math.random() * candidatas.length)]
    const pairIdElegido = elegida.pairId
    let next = [...fichas]
    const elegidas = next.filter(f => f.pairId === pairIdElegido)
    elegidas.forEach(f => f.beingHinted = true)
    setFichas(next)
  }

  useEffect(() => {
    if (!hintActive) return
    wasHintActive.current = true
    const timer = setTimeout(() => {
      setHintActive(false)

      let next = [...fichas]
      next.forEach(f => f.beingHinted = false)
      setFichas(next)
      
    }, TIMINGS.HINT_COOLDOWN)

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
      />
      <Stats
        totalPairs={totalPairs}
        qGuessedPairs={qGuessedPairs}
        errors={errors}
        reset={reset} 
        hint={hint}
        giveUp={giveUp}
        gameStatus={gameStatus}
        hintActive={hintActive}
        wasHintActive={wasHintActive}
        usedHints={usedHints}
      />
      <div className='tableroContainer'>
        <Tablero 
          fichas={fichas}
          setFichas={setFichas}
          columns={columns}
          isBoardLocked={isBoardLocked}
          setIsBoardLocked={setIsBoardLocked}
          sumarClick={sumarClick}
          shouldFichasAnimate={shouldFichasAnimate}
          shapesNColors={shapesNColors}
          setShapesNColors={setShapesNColors}
        />
      </div>
    </main>
  )
}

export default Juego