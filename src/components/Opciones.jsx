import { isPrime, getClosestNotPrime } from "../libs/myFunctions"

function Opciones({ cantParesAJugar, setCantParesAJugar, prevValuePares, reset }){

    const handleChange = e => {
        let expectedNumber = Number(e.target.value)
        const direction = expectedNumber > prevValuePares.current ? "up" : "down"
        if(!isPrime(expectedNumber)) {
            if (expectedNumber < 4) expectedNumber = 4
            setCantParesAJugar(expectedNumber)
        }
        else {
            expectedNumber = getClosestNotPrime(expectedNumber, direction)
            if (expectedNumber < 4) expectedNumber = 4
            setCantParesAJugar(expectedNumber)
        }
        prevValuePares.current = expectedNumber
    }

    return (
        <section className='opciones'>
            <div className="campo">
                <label>Cantidad de pares de fichas ({cantParesAJugar})</label>
                <input className="controls" type='range' min="4" step="1" max="50" onChange={ (e) => handleChange(e) } value={cantParesAJugar}></input>
            </div>
            <button className="controls" onClick={() => hint()}>Pista</button>
            <button className="controls" onClick={() => giveUp()}>Rendirse</button>
            <button className="controls" onClick={reset}>Regenerar</button>
        </section>
    )
}

export default Opciones