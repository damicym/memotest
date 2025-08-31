import { useState } from 'react'
import { useEffect } from 'react'
import Ficha from './Ficha'
import { defineColumns } from '../libs/myFunctions'
import { inicializarFichas } from '../libs/icons'

function Tablero({ cantParesAJugar }) {
    const [fichas, setFichas] = useState([])
    const [columns, setColumns] = useState(0)
    const [fichasTocadas, setFichasTocadas] = useState([])

    const handleClickFicha = key => {
        setFichasTocadas(prev => {  
            const fichaActual = fichas.find(f => f.myKey === key)
            let newState = [...prev, fichaActual]

            if(newState.length === 1){
                newState[0].status = 1
            } else{
                if(newState.length === 2){
                    newState[1].status = 2
                    if(newState[0].pairId === newState[1].pairId){
                        newState.forEach(f => f.status = 3)
                    } else {
                        newState.forEach(f => f.status = 0)
                    }
                    return []
                }
            }
            return newState
        })
    }

    useEffect(() => {
        setFichas(inicializarFichas(cantParesAJugar))
        setColumns(defineColumns(cantParesAJugar))
    }, [cantParesAJugar])

    return (
    <section className='tablero' style={{gridTemplateColumns: `repeat(${columns}, max-content)`}}>
        {
            fichas.map((ficha, index) => (
                <Ficha 
                    key={index} 
                    myKey={ficha.myKey}
                    pairId={ficha.pairId}
                    name={ficha.name} 
                    Icon={ficha.Icon} 
                    color={ficha.color} 
                    status={ficha.status}
                    handleClick={handleClickFicha}
                />
            ))
        }
    </section>
    )
}

export default Tablero