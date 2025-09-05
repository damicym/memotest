import { isPrime, getClosestNotPrime } from "../libs/myFunctions"

function Opciones({ qPlayedPairs, setQPlayedPairs, prevValuePares, reset, hint, giveUp, gameStatus, hintActive }){

    const handleChange = e => {
        let expectedNumber = Number(e.target.value)
        const direction = expectedNumber > prevValuePares.current ? "up" : "down"
        if(!isPrime(expectedNumber)) {
            if (expectedNumber < 4) expectedNumber = 4
            setQPlayedPairs(expectedNumber)
        }
        else {
            expectedNumber = getClosestNotPrime(expectedNumber, direction)
            if (expectedNumber < 4) expectedNumber = 4
            setQPlayedPairs(expectedNumber)
        }
        prevValuePares.current = expectedNumber
    }

    return (
        <section className='opciones'>
            <div className="campo">
                <label>Cantidad de pares de fichas ({qPlayedPairs})</label>
                <input className="controls" type='range' min="4" step="1" max="50" onChange={ (e) => handleChange(e) } value={qPlayedPairs}></input>
            </div>
            <button className="controls" onClick={hint} disabled={!gameStatus || hintActive} >Pista</button>
            <button className="controls" onClick={giveUp} disabled={!gameStatus} >Rendirse</button>
            <button className="controls" onClick={reset} disabled={!gameStatus} >Regenerar</button>
        </section>
    )
}

export default Opciones