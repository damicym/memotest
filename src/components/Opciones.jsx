import { isPrime, getClosestNotPrime } from "../libs/myFunctions"
import { GAME_STATUS } from "./Juego"

function Opciones({ totalPairs, setTotalPairs, prevValuePairs, reset, hint, giveUp, gameStatus, hintActive, wasHintActive }){

    const handleChange = e => {
        let expectedNumber = Number(e.target.value)
        const direction = expectedNumber > prevValuePairs.current ? "up" : "down"
        if(!isPrime(expectedNumber)) {
            if (expectedNumber < 4) expectedNumber = 4
            setTotalPairs(expectedNumber)
        }
        else {
            expectedNumber = getClosestNotPrime(expectedNumber, direction)
            if (expectedNumber < 4) expectedNumber = 4
            setTotalPairs(expectedNumber)
        }
        prevValuePairs.current = expectedNumber
    }

    return (
        <section className='opciones'>
            <div className="campo">
                <label>Cantidad de pares de fichas ({totalPairs})</label>
                <input className="controls" type='range' min="4" step="1" max="50" onChange={ (e) => handleChange(e) } value={totalPairs}></input>
            </div>
            <button 
            className={`controls ${hintActive ? 'loadingHint' : wasHintActive.current ? 'bounce' : ''}`} 
            onClick={hint} 
            disabled={gameStatus === GAME_STATUS.NOT_STARTED || gameStatus === GAME_STATUS.GIVEN_UP || hintActive} 
            >
                Pista
            </button>
            <button 
            className="controls" 
            onClick={giveUp} 
            disabled={gameStatus === GAME_STATUS.NOT_STARTED || gameStatus === GAME_STATUS.GIVEN_UP} 
            >
                Rendirse
            </button>
            <button 
            className="controls" 
            onClick={reset} 
            disabled={gameStatus === GAME_STATUS.NOT_STARTED} 
            >
                Regenerar
            </button>
        </section>
    )
}

export default Opciones