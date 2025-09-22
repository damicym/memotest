import Ficha from './Ficha'
import { FICHA_STATUS, TIMINGS } from './Juego'
import { useEffect, useState } from 'react'
import { toOneShapeNColor, fireIcon } from '../libs/confetti'

function Tablero({ fichas, setFichas, columns, isBoardLocked, setIsBoardLocked, sumarClick, shouldFichasAnimate, shapesNColors, setShapesNColors }) {
    const [timeToShine, setTimeToShine] = useState(false)

    useEffect(() => {
        let timeout
        setTimeToShine(true)
        timeout = setTimeout(() => setTimeToShine(false), TIMINGS.SHINE_DURATION)

        const interval = setInterval(() => {
            setTimeToShine(true)
            timeout = setTimeout(() => {
                setTimeToShine(false)
            }, TIMINGS.SHINE_DURATION)
        }, TIMINGS.SHINE_CYCLE)

        return () => {
            clearInterval(interval)
            clearTimeout(timeout)
        }
    }, [])

    const esconderDsps = (a, b) => { // a y b son fichas
        setTimeout(() => {
            let next = [...fichas]
            a.status = FICHA_STATUS.ESCONDIDA
            b.status = FICHA_STATUS.ESCONDIDA
            setFichas(next)
            setIsBoardLocked(false)
        }, TIMINGS.BEFORE_HIDING_FICHA)
    }

    // cuando tocas una ficha, 
    // - si es la primera y es la primera vez q la tocan // 2da condicion evaluada en toOneShapeNColor
    // sumup: toOneShapeNColor(ficha/*checkear*/, shapesNColors, setShapesNColors)
    // 1. crear una shape y guardarla en un estado
    // 2. con un identidicador de pairId
    // - si es la segunda y está bien,
    // 1. buscar su shape en el estado con su pairId
    // 2. hacer confetti con esa shape

    const handleClickFicha = (e, key) => {
        if (isBoardLocked) return
        const fichaActual = fichas.find(f => f.id === key)
        if (!fichaActual) return
        if (fichaActual.status !== FICHA_STATUS.ESCONDIDA) return
        sumarClick()
        let next = [...fichas]
        fichaActual.status =  FICHA_STATUS.MOSTRADA
        // agregar ficha tocada a 'abiertas'
        const abiertas = next.filter(f => f.status === FICHA_STATUS.MOSTRADA)
        // decidir si puso las 2 bien
        if(abiertas.length === 2){
            const [a, b] = abiertas
            if (a.pairId === b.pairId) {
                a.status = FICHA_STATUS.ADIVINADA
                b.status = FICHA_STATUS.ADIVINADA
                let shape = shapesNColors.find(s => s.pairId === fichaActual.pairId)
                fireIcon(shape, e.clientY, e.clientX, window.innerHeight, window.innerWidth)
            } else {
                setIsBoardLocked(true)
                esconderDsps(a, b)
            }
        } else toOneShapeNColor(fichaActual, shapesNColors, setShapesNColors)
        setFichas(next)
    }

    return (
    <section className='tablero' style={{gridTemplateColumns: `repeat(${columns}, minmax(0, min(110px, ${100 / columns}vw)))`}}>
        {
            fichas?.map((ficha, index) => (
                <Ficha 
                    key={index}
                    ficha={ficha}
                    handleClick={handleClickFicha}
                    lockState={isBoardLocked}
                    shouldFichasAnimate={shouldFichasAnimate}
                    timeToShine={timeToShine}
                />
            ))
        }
    </section>
    )
}

export default Tablero