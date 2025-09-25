import { isPrimeOrBanned, getClosestNotPrimeOrBanned } from "../libs/myFunctions"
import { GAME_RULES } from "./Juego"

function Opciones({ totalPairs, setTotalPairs, prevValuePairs }){
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
            <h1>Modo Casual</h1>
            <div className="campo">
                <label>Pares de fichas ({totalPairs})</label>
                <input className="controls" type='range' min="4" step="1" max="50" onChange={ (e) => handleChange(e) } value={totalPairs}></input>
            </div>
        </section>
    )
}

export default Opciones