import Ficha from './Ficha'
import { FICHA_STATUS, TIMINGS } from './Juego'
import { useEffect, useState, useRef } from 'react'

function Tablero({ fichas, setFichas, columns, isBoardLocked, setIsBoardLocked, sumarClick, shouldFichasAnimate }) {
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
            setFichas(prev => {
                let next = prev.map(ficha => 
                ficha.id === a.id || ficha.id === b.id ? { ...ficha, status: FICHA_STATUS.ESCONDIDA } : ficha
                )
                return next
            })
            setIsBoardLocked(false)
        }, TIMINGS.BEFORE_HIDING_FICHA)
    }

    const handleClickFicha = key => {
        if (isBoardLocked) return
        const fichaActual = fichas.find(ficha => ficha.id === key)
        if (!fichaActual) return
        if (fichaActual.status !== FICHA_STATUS.ESCONDIDA) return
        sumarClick()
        setFichas(prev => {
            // agregar ficha tocada a 'abiertas'
            let next = prev.map(ficha => ficha.id === key ? { ...ficha, status: FICHA_STATUS.MOSTRADA } : ficha)
            const abiertas = next.filter(ficha => ficha.status === FICHA_STATUS.MOSTRADA)
            // decidir si puso las 2 bien
            if (abiertas.length === 2){
                const [a, b] = abiertas
                if (a.pairId === b.pairId) {
                    next = next.map(ficha =>
                    ficha.id === a.id || ficha.id === b.id ? { ...ficha, status: FICHA_STATUS.ADIVINADA } : ficha
                    )
                    return next
                } else {
                    setIsBoardLocked(true)
                    esconderDsps(a, b)
                    return next
                }
            }
            return next
        })
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