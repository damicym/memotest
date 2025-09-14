import { useState } from 'react'
import { useEffect } from 'react'
import { GAME_STATUS, TIMINGS } from './Juego'
import { getFancyTimeBySecs } from '../libs/myFunctions'


function Stats({ totalPairs, qGuessedPairs, clicks, gameStatus, errors }){
    const [puntos, setPuntos] = useState("...")
    const [secondsInGame, setSeconds] = useState()
    const [timeInGame, setTimeInGame] = useState(0)

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
        if(gameStatus === GAME_STATUS.STARTED){
            setSeconds(0)
            const secondsInterval = setInterval(() => {
                setSeconds(prev => prev + 1)
            }, 1000)
            return () => clearInterval(secondsInterval)
        }
    }, [gameStatus])

    useEffect(() => {
        setTimeInGame(getFancyTimeBySecs(secondsInGame))
    }, [secondsInGame])

    useEffect(() => {
        
    }, [qGuessedPairs])

    return (
       <section className='stats'>
        { gameStatus === GAME_STATUS.NOT_STARTED ? 
                <div className='waiting'>
                    <p>Esperando a que empieces a jugar para mostrar estadísticas</p>
                    <p>{puntos}</p>
                </div>
        :  
            <>
                <p style={{width: '90px'}} >Clicks: {clicks}</p>
                <p>Pares encontrados: {qGuessedPairs}/{totalPairs}</p>
                <p style={{width: '205px'}} >Cantidad de errores: {errors}</p>
                <p style={{width: '150px'}} >Tiempo: {timeInGame}</p>
            </>
        }
            
       </section>
    )
}

export default Stats