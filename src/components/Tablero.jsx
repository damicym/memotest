import { useState } from 'react'
import { useEffect } from 'react'
import Ficha from './Ficha'
import { defineColumns } from '../libs/myFunctions'
import { inicializarFichas } from '../libs/icons'

function Tablero({ cantParesAJugar }) {
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
        if (lock) return // hacer q se cancele animacion
        const fichaActual = fichas.find(f => f.id === key)
        if (!fichaActual) return
        if (fichaActual.status !== 0) return
        setFichas(prev => {
            // agregar ficha tocada a 'abiertas'
            let next = prev.map(ficha => ficha.id === key ? { ...ficha, status: 1 } : ficha)
            const abiertas = next.filter(f => f.status === 1)
            // decidir si puso las 2 bien
            if (abiertas.length === 2){
                const [a, b] = abiertas
                if (a.pairId === b.pairId) {
                    next = next.map(f =>
                    f.id === a.id || f.id === b.id ? { ...f, status: 2 } : f
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