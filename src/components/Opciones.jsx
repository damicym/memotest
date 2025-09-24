import { isPrimeOrBanned, getClosestNotPrimeOrBanned } from "../libs/myFunctions"
import { GAME_STATUS, GAME_RULES } from "./Juego"

function Opciones({ totalPairs, setTotalPairs, prevValuePairs, reset, hint, giveUp, gameStatus, hintActive, wasHintActive, usedHints }){
    const handleChange = e => {
        let expectedNumber = Number(e.target.value)
        const direction = expectedNumber > prevValuePairs.current ? "up" : "down"
        if(!isPrimeOrBanned(expectedNumber, GAME_RULES.EXCLUDED_Q_PAIRS)) {
            if (expectedNumber < 4) expectedNumber = 4
            setTotalPairs(expectedNumber)
        }
        else {
            expectedNumber = getClosestNotPrimeOrBanned(expectedNumber, direction, GAME_RULES.EXCLUDED_Q_PAIRS)
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
            <div className="hintBtnContainer">
                <button 
                className={`controls ${hintActive && usedHints !== GAME_RULES.MAX_HINTS ? 'loadingHint' : wasHintActive.current && usedHints !== GAME_RULES.MAX_HINTS ? 'bounce' : ''}`} 
                onClick={hint} 
                disabled={gameStatus !== GAME_STATUS.STARTED || hintActive || usedHints >= GAME_RULES.MAX_HINTS} 
                >
                    Pista
                </button>
                { usedHints !== GAME_RULES.MAX_HINTS && gameStatus === GAME_STATUS.STARTED ?
                    <p>{GAME_RULES.MAX_HINTS - usedHints}</p> :<></>
                }
            </div>
            <button 
            className="controls" 
            onClick={giveUp} 
            disabled={gameStatus !== GAME_STATUS.STARTED} 
            >
                Rendirse
            </button>
            <button 
            className="controls" 
            onClick={() => reset()} 
            disabled={gameStatus === GAME_STATUS.NOT_STARTED} 
            >
                Regenerar
            </button>
        </section>
    )
}

export default Opciones