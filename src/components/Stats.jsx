import { useState } from 'react'
import { useEffect } from 'react'

function Stats({ totalPairs, qGuessedPairs, clicks, gameStatus }){
    const [puntos, setPuntos] = useState("...")
    const [seconds, setSeconds] = useState(0)

    useEffect(() => {
        const timeBetween = 0.6 * 1000
        const waitingInterval = setInterval(() => {
            if(gameStatus) {
                clearInterval(waitingInterval)
                return
            }
            setPuntos(prev => {
            if (prev === "...") return "."
            else if (prev === ".") return ".."
            else if (prev === "..") return "..."
            return "..."
            })
        }, timeBetween)
        return () => clearInterval(waitingInterval)
    }, [])

    useEffect(() => {
        if(!gameStatus) return
        setSeconds(0)
        const secondsInterval = setInterval(() => {
            setSeconds(prev => prev + 1)
        }, 1000)
        return () => clearInterval(secondsInterval)
    }, [gameStatus])

    return (
       <section className='stats'>
        { !gameStatus ? 
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