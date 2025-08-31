import { useState } from 'react'
import { useEffect } from 'react'
import Ficha from './Ficha'
import { defineColumns } from '../libs/myFunctions'
import { inicializarFichas } from '../libs/icons'

function Tablero({ cantParesAJugar }) {
    const [fichas, setFichas] = useState([])
    const [columns, setColumns] = useState(0)
    
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
                    pairId={ficha.pairId}
                    name={ficha.name} 
                    Icon={ficha.Icon} 
                    color={ficha.color} 
                    status={ficha.status}
                />
            ))
        }
    </section>
    )
}

export default Tablero