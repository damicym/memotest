import { useState } from 'react'
import { useEffect } from 'react'
import Ficha from './Ficha'
import { defineColumns } from '../libs/myFunctions'
import { inicializarFichas } from '../libs/icons'

function Tablero({ cantParesAJugar, sumarClick, setPairsLeft }) {
    const [fichas, setFichas] = useState([])
    const [columns, setColumns] = useState(0)
    const [lock, setLock] = useState(false)

    const esconderDsps = (a, b) => { // a y b son fichas
        const waitTime = 1.2 * 1000
        setTimeout(() => {
            setFichas(prev => {
                let next = prev.map(ficha => 
                ficha.id === a.id || ficha.id === b.id ? { ...ficha, status: 0 } : ficha
                )
                return next
            })
            setLock(false)
        }, waitTime)
    }

    const handleClickFicha = key => {
        if (lock) return // hacer q se cancele animacion (setlock false y return. poner feedback de q se unlockeo?)
        const fichaActual = fichas.find(f => f.id === key)
        if (!fichaActual) return
        if (fichaActual.status !== 0) return
        sumarClick()
        setFichas(prev => {
            // agregar ficha tocada a 'abiertas'
            let next = prev.map(ficha => ficha.id === key ? { ...ficha, status: 1 } : ficha)
            const abiertas = next.filter(f => f.status === 1)
            // decidir si puso las 2 bien
            if (abiertas.length === 2){
                const [a, b] = abiertas
                if (a.pairId === b.pairId) {
                    next = next.map(ficha =>
                    ficha.id === a.id || ficha.id === b.id ? { ...ficha, status: 2 } : ficha
                    )
                    return next
                } else {
                    setLock(true)
                    esconderDsps(a, b)
                    return next
                }
            }
            return next
        })
    }

    useEffect(() => {
        setFichas(inicializarFichas(cantParesAJugar))
        setColumns(defineColumns(cantParesAJugar))
    }, [cantParesAJugar])

    useEffect(() => {
        if (fichas.length > 0) {
            const pairs = fichas.filter(f => f.status === 2).length / 2
            setPairsLeft(pairs)
        }
    }, [fichas])


    return (
    <section className='tablero' style={{gridTemplateColumns: `repeat(${columns}, minmax(0, min(100px, ${100 / columns}vw)))`}}>
        {
            fichas?.map((ficha, index) => (
                <Ficha 
                    key={index}
                    ficha={ficha}
                    handleClick={handleClickFicha}
                    lockState={lock}
                />
            ))
        }
    </section>
    )
}

export default Tablero