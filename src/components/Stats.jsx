import { useState } from 'react'
import { useEffect } from 'react'
import { GAME_STATUS } from './Juego'
import { TIMINGS } from './Juego'

function Stats({ totalPairs, qGuessedPairs, clicks, gameStatus }){
    const [puntos, setPuntos] = useState("...")
    const [seconds, setSeconds] = useState(0)

    useEffect(() => {
        const waitingInterval = setInterval(() => {
            if(gameStatus === GAME_STATUS.STARTED) {
                clearInterval(waitingInterval)
                return
            }
            setPuntos(prev => {
            if (prev === "...") return "."
            else if (prev === ".") return ".."
            else if (prev === "..") return "..."
            return "..."
            })
        }, TIMINGS.BETWEEN_ANIMATED_DOTS)
        return () => clearInterval(waitingInterval)
    }, [])

    useEffect(() => {
        // if(gameStatus === GAME_STATUS.NOT_STARTED || gameStatus === GAME_STATUS.WON) return
        if(gameStatus === GAME_STATUS.STARTED){
            setSeconds(0)
            const secondsInterval = setInterval(() => {
                setSeconds(prev => prev + 1)
            }, 1000)
            return () => clearInterval(secondsInterval)
        }
    }, [gameStatus])

    return (
       <section className='stats'>
        { gameStatus === GAME_STATUS.NOT_STARTED ? 
                <div className='waiting'>
                    <p>Esperando a que empieces a jugar para mostrar estadísticas</p>
                    <p>{puntos}</p>
                </div>
        :  
            <>
                <p>Pares encontrados: {qGuessedPairs}/{totalPairs}</p>
                <p>Clicks: {clicks}</p>
                <p>Tiempo: {seconds}s</p>
            </>
        }
            
       </section>
    )
}

export default Stats