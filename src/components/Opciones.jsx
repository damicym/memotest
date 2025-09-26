import { isPrimeOrBanned, getClosestNotPrimeOrBanned } from "../libs/myFunctions"
import { GAME_RULES } from "./Juego"
import { FaInfoCircle as InfoIcon } from "react-icons/fa";
import Tooltip from 'react-bootstrap/Tooltip';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';

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
            <div className="title">
                <h1>Modo Casual</h1>
                <OverlayTrigger
                        delay={{ show: 200, hide: 0 }}
                        key='infoTitleOverlay'
                        placement='right'
                        overlay={
                            <Tooltip className="customTooltip" id='tooltip-right'>Esto es una beta. Próximamente habrá nuevos modos, desafíos diarios y leaderbaord de jugadores</Tooltip>
                        }
                    >
                    <InfoIcon size={18}></InfoIcon>
                </OverlayTrigger>
            </div>
            <div className="campo">
                <label>Pares de fichas ({totalPairs})</label>
                <input className="controls" type='range' min="4" step="1" max="50" onChange={ (e) => handleChange(e) } value={totalPairs}></input>
            </div>
        </section>
    )
}

export default Opciones