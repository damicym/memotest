import { useEffect, useState, useRef } from 'react'
import Tablero from './Tablero'
import Opciones from './Opciones'
import Stats from './Stats'
import { defineColumns, inicializarFichas, getGroupsNFichasPerG } from '../libs/myFunctions'
import { fireWin } from '../libs/confetti'

export const FICHA_STATUS = Object.freeze({
  ORDER_ERROR: -2,
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
  EXTRA_TIME: 0.3 * 1000,
  FICHA_FLIP: 0.5 * 1000,
  HINT_COOLDOWN: 2 * 1000,
  HINT_DURATION: 1.6 * 1000,
  BETWEEN_ANIMATED_DOTS: 0.6 * 1000,
  SHINE_DURATION: 4 * 1000,
  BETWEEN_FICHA_SHINE: 0.8 * 1000,
  SHINE_CYCLE: 4.6 * 1000,  // suma de los 2 anteriores
  BETWEEN_WIN_CONFETTI: 0.5 * 1000,
})

export const GAME_MODES_DESCRIPTIONS = Object.freeze({
  ERROR: "Parece que se ha producido un error al determinar el modo de juego :(",
  BETA: "Esto es una beta. Próximamente habrá nuevos modos, desafíos diarios y leaderbaord de jugadores",
  CLASSIC: "Memotest sin nada nuevo: Encontrá los pares de fichas que coincidan en ícono y color. Podés usar pistas.",
  SEQUENCE: "Encontrá secuencias de fichas: Ya no solo importa que coincidan, sino también el orden en el que las das vuelta. Podés usar pistas.",
})

export const GAME_RULES = Object.freeze({
  DEFAULT_TABLERO_SIZE: 1,
  MIN_TOTAL_PAIRS: 4,
  MAX_TOTAL_PAIRS: 50,
  MAX_HINTS: 3,
  EXCLUDED_Q_PAIRS: [34, 38, 46],
  CLASSIC_GROUPS: 2,
  CLASSIC_TABLERO_TYPES: [ 
    { name: "Chico", groups: 6, fichasPerGroup: 2 }, 
    { name: "Mediano", groups: 12, fichasPerGroup: 2 }, 
    { name: "Grande", groups: 20, fichasPerGroup: 2 }, 
    /* { name: "Enorme", groups: 35, fichasPerGroup: 2 } */
  ],
  SEQUENCE_TABLERO_TYPES: [ 
    { name: "Chico", groups: 8, fichasPerGroup: 2 }, 
    { name: "Mediano", groups: 12, fichasPerGroup: 2 }, 
    { name: "Grande", groups: 16, fichasPerGroup: 2 }, 
    /* { name: "Enorme", groups: 16, fichasPerGroup: 4 } */
  ]
})

export const GAME_MODES = Object.freeze({
  CLASSIC: 0,
  SEQUENCE: 1
})

function Juego() {
  const [gameMode, setGameMode] = useState(0)
  const { groups: newGroups, fichasPerGroup: newFichasPerGroup } = getGroupsNFichasPerG(gameMode, GAME_RULES.DEFAULT_TABLERO_SIZE)
  const [totalGroups, setTotalGroups] = useState(() => newGroups)
  const prevValuePairs = useRef(newGroups)
  const [fichas, setFichas] = useState([])
  const [columns, setColumns] = useState(0)
  const [isBoardLocked, setIsBoardLocked] = useState(false) // depsues de tocar una ficha incorrecta se lockea el juego por un tiempo
  const [clicks, setClicks] = useState(0)
  const [errors, setErrors] = useState(0)
  const [gameStatus, setGameStatus] = useState(GAME_STATUS.NOT_STARTED)
  const gameStatusRef = useRef(gameStatus)
  const [qGuessedPairs, setQGuessedPairs] = useState(0)
  const [hintActive, setHintActive] = useState(false)
  const wasHintActive = useRef(false)
  const [shouldFichasAnimate, setShouldFichasAnimate] = useState(true)
  const [shapesNColors, setShapesNColors] = useState([])
  const [usedHints, setUsedHints] = useState(0)
  const [isFirstRender, setIsFirstRender] = useState(true)
  const timeoutFlipAllFichas = useRef(null)
  const [selectedSize, setSelectedSize] = useState(GAME_RULES.DEFAULT_TABLERO_SIZE)
  const [fichasPerGroup, setFichasPerGroup] = useState(newFichasPerGroup)
  const resetTriggeredByModeChange = useRef(false)
  const prevFichasPerGroup = useRef(newFichasPerGroup)
  const abiertasRef = useRef([])

  useEffect(() => {
    reset(false)
  }, [selectedSize])

  useEffect(() => {
    if (isFirstRender) {
      setIsFirstRender(false)
      return
    }
    if(gameMode === GAME_MODES.SEQUENCE){
      document.documentElement.classList.add('sequence-mode')
    } else {
      document.documentElement.classList.remove('sequence-mode')
    }
    let nextSize = selectedSize
    if (
      (gameMode === GAME_MODES.CLASSIC && selectedSize >= GAME_RULES.CLASSIC_TABLERO_TYPES.length) ||
      (gameMode === GAME_MODES.SEQUENCE && selectedSize >= GAME_RULES.SEQUENCE_TABLERO_TYPES.length)
    ) {
      nextSize = GAME_RULES.DEFAULT_TABLERO_SIZE
      setSelectedSize(GAME_RULES.DEFAULT_TABLERO_SIZE)
    }

    const { groups: newTotal, fichasPerGroup: newFichasPerGroup} = getGroupsNFichasPerG(gameMode, nextSize)
    prevValuePairs.current = newTotal
    resetTriggeredByModeChange.current = true
    setTotalGroups(newTotal)
    setFichasPerGroup(newFichasPerGroup)

    if (newTotal * newFichasPerGroup === totalGroups * prevFichasPerGroup.current) reset()
      else if (newTotal === totalGroups ) reset({ wAnimation: false })

    prevFichasPerGroup.current = newFichasPerGroup
  }, [gameMode])

  useEffect(() => {
    if (resetTriggeredByModeChange.current) {
      resetTriggeredByModeChange.current = false
      reset({ wAnimation: false })
      return
    }
    reset({ wAnimation: false })
  }, [totalGroups])

  useEffect(() => {
    if (fichas.length > 0 && gameStatus !== GAME_STATUS.GIVEN_UP) {
      const qGuessedPairs = fichas.filter(ficha => ficha.status === FICHA_STATUS.ADIVINADA).length / fichasPerGroup
      setQGuessedPairs(qGuessedPairs)
    }
  }, [fichas])

  useEffect(() => {
    if(qGuessedPairs === totalGroups) setGameStatus(GAME_STATUS.WON)
  }, [qGuessedPairs])

  useEffect(() => {
    gameStatusRef.current = gameStatus
    wasHintActive.current = false
    if(gameStatus === GAME_STATUS.STARTED){
      setShouldFichasAnimate(true)
    }
    else if(gameStatus === GAME_STATUS.GIVEN_UP){
      setIsBoardLocked(true)
      let next = [...fichas]
      next.forEach(f => {
        f.status = FICHA_STATUS.ADIVINADA
        f.beingHinted = false
      })
      setFichas(next)
      setHintActive(false)
    }
    else if(gameStatus === GAME_STATUS.WON){
      fireWin()
    }
  }, [gameStatus])

  useEffect(() => {
    if (clicks % fichasPerGroup !== 0) return
    if (fichas.length === 0) return
    if(gameStatus === GAME_STATUS.GIVEN_UP) return
    const qGuessedPairs = fichas.filter(ficha => ficha.status === FICHA_STATUS.ADIVINADA).length / fichasPerGroup
    const attempts = clicks / fichasPerGroup
    setErrors(Math.max(0, attempts - qGuessedPairs))
  }, [clicks, fichas])

  const sumarClick = () => {
    setClicks(prev => {
      if(prev === 0 && gameStatus === GAME_STATUS.NOT_STARTED) setGameStatus(GAME_STATUS.STARTED)
      return prev + 1
    })
  }

  // para opciones:
  const reset = ({ wAnimation } = {wAnimation: true} ) => {
    clearTimeout(timeoutFlipAllFichas.current)
    setIsBoardLocked(true)
    abiertasRef.current = []
    let nextFichasPerGroup
    if (
      (gameMode === GAME_MODES.CLASSIC && selectedSize >= GAME_RULES.CLASSIC_TABLERO_TYPES.length) ||
      (gameMode === GAME_MODES.SEQUENCE && selectedSize >= GAME_RULES.SEQUENCE_TABLERO_TYPES.length)
    ) {
      nextFichasPerGroup = GAME_RULES.CLASSIC_GROUPS
    }
    else nextFichasPerGroup = getGroupsNFichasPerG(gameMode, selectedSize).fichasPerGroup
    
    let next = [...fichas]
    next.forEach(f => f.status = FICHA_STATUS.ESCONDIDA)
    setFichas(next)
    
    setShapesNColors(prev => prev.length > 0 ? [] : prev)
    setUsedHints(0)
    setErrors(0)
    setClicks(0)
    setGameStatus(GAME_STATUS.NOT_STARTED)
    setColumns(defineColumns(totalGroups, nextFichasPerGroup))
    setQGuessedPairs(0)
    setHintActive(false)
    wasHintActive.current = false

    const fichasInit = () => {
      setFichas(inicializarFichas(totalGroups, nextFichasPerGroup, gameMode, /* false */))
      setIsBoardLocked(false)
    }

    if (!wAnimation) {
      setShouldFichasAnimate(false)
      fichasInit()
    } else {
      setShouldFichasAnimate(true)
      timeoutFlipAllFichas.current = setTimeout(fichasInit, TIMINGS.FICHA_FLIP)
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
    // if (usedHints >= GAME_RULES.MAX_HINTS) return

    setUsedHints(prev => prev + 1)
    setHintActive(true)

    const elegida = candidatas[Math.floor(Math.random() * candidatas.length)]
    const groupIdElegido = elegida.groupId
    
    let next = [...fichas]
    const elegidas = next.filter(f => f.groupId === groupIdElegido)
    elegidas.forEach(f => f.beingHinted = true)
    setFichas(next)
  }

  useEffect(() => {
    if (!hintActive) return
    wasHintActive.current = true

    const updateHintActiveTimer = setTimeout(() => { 
      setHintActive(false) 
    }, TIMINGS.HINT_COOLDOWN)

    const removeClassTimer = setTimeout(() => {
      let next = [...fichas]
      next.forEach(f => f.beingHinted = false)
      setFichas(next)
    }, TIMINGS.HINT_DURATION)

    return () => {
      clearTimeout(removeClassTimer)
      clearTimeout(updateHintActiveTimer)
    }
  }, [hintActive])

  const giveUp = () => {
    setGameStatus(GAME_STATUS.GIVEN_UP)
  }

  return (
    <main className="juego">
      <Opciones
        totalGroups={totalGroups} 
        setTotalGroups={setTotalGroups} 
        prevValuePairs={prevValuePairs}
        gameMode={gameMode}
        setGameMode={setGameMode}
        selectedSize={selectedSize}
        setSelectedSize={setSelectedSize}
        setFichasPerGroup={setFichasPerGroup}
        prevFichasPerGroup={prevFichasPerGroup}
      />
      <Stats
        totalGroups={totalGroups}
        qGuessedPairs={qGuessedPairs}
        reset={reset} 
        hint={hint}
        giveUp={giveUp}
        gameStatus={gameStatus}
        hintActive={hintActive}
        wasHintActive={wasHintActive}
        fichasPerGroup={fichasPerGroup}
        gameMode={gameMode}
        // usedHints={usedHints}
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
          gameStatusRef={gameStatusRef}
          fichasPerGroup={fichasPerGroup}
          gameMode={gameMode}
          abiertasRef={abiertasRef}
        />
      </div>
    </main>
  )
}

export default Juego