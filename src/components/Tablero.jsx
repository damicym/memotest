import Ficha from './Ficha'
import { FICHA_STATUS } from './Juego'

function Tablero({ fichas, setFichas, columns, isBoardLocked, setIsBoardLocked, sumarClick }) {

    const esconderDsps = (a, b) => { // a y b son fichas
        const waitTime = 1.05 * 1000
        setTimeout(() => {
            setFichas(prev => {
                let next = prev.map(ficha => 
                ficha.id === a.id || ficha.id === b.id ? { ...ficha, status: FICHA_STATUS.ESCONDIDA } : ficha
                )
                return next
            })
            setIsBoardLocked(false)
        }, waitTime)
    }

    const handleClickFicha = key => {
        if (isBoardLocked) return // hacer q se cancele animacion (setlock false y return. poner feedback de q se unlockeo?)
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
    <section className='tablero' style={{gridTemplateColumns: `repeat(${columns}, minmax(0, min(100px, ${100 / columns}vw)))`}}>
        {
            fichas?.map((ficha, index) => (
                <Ficha 
                    key={index}
                    ficha={ficha}
                    handleClick={handleClickFicha}
                    lockState={isBoardLocked}
                />
            ))
        }
    </section>
    )
}

export default Tablero