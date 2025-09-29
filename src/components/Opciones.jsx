import { useState, useEffect } from "react";
import { isPrimeOrBanned, getClosestNotPrimeOrBanned } from "../libs/myFunctions"
import { GAME_RULES, GAME_MODES, GAME_MODES_DESCRIPTIONS } from "./Juego"
import { FaInfoCircle as InfoIcon } from "react-icons/fa";
import { LiaExchangeAltSolid as ChangeModeIcon } from "react-icons/lia";
import { IoSettingsOutline as ModeSettingsIcon } from "react-icons/io5";
import { PiSlidersHorizontal as SliderIcon } from "react-icons/pi";
import Tooltip from 'react-bootstrap/Tooltip';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Modal from 'react-bootstrap/Modal';

function Opciones({ totalPairs, setTotalPairs, prevValuePairs, gameMode, setGameMode }){
    const [modalShow, setModalShow] = useState(false);
    const [animationClass, setAnimationClass] = useState("");
    const [isAnimating, setIsAnimating] = useState(false);

    function getFancyModeName(modeName){
        return modeName === GAME_MODES.CLASSIC ? 'Clásico' : modeName === GAME_MODES.SEQUENCE ? 'Secuencia' : 'Modo no seleccionado'
    }

    const renderQFichasBtn = () => {
        const config = {
            [GAME_MODES.CLASSIC]: {
                label: 'Pares: ',
                options: GAME_RULES.CLASSIC_DEFAULT_FICHAS_Q
            },
            [GAME_MODES.SEQUENCE]: {
                label: 'Grupos: ',
                options: GAME_RULES.SEQUENCE_DEFAULT_FICHAS_Q
            }
        }
        const currentConfig = config[gameMode]
        if (!currentConfig) return null

        return (
            <div className="selectorAllContainer">
                <label>{currentConfig.label}</label>
                <div className="selectorBtnContainer">
                    {currentConfig.options.map(q => 
                        <button 
                            tabIndex={-1} 
                            key={q} 
                            className={`selectorBtn ${q === totalPairs ? 'selected' : ''}`} 
                            onClick={() => handlePairsChange(q)}
                        >
                            {q}
                        </button>
                    )}
                    <button 
                        tabIndex={-1} 
                        key={99} 
                        onClick={() => setModalShow(true)} 
                        className={`selectorBtn ${!currentConfig.options.includes(totalPairs) && !isAnimating ? 'selected' : ''}`}
                    >
                        <SliderIcon />
                    </button>
                </div>
            </div>
        );
    }

    const handlePairsChange = newValue => {
        let expectedNumber = Number(newValue)
        const direction = expectedNumber > prevValuePairs.current ? "up" : "down"
        if(!isPrimeOrBanned(expectedNumber, GAME_RULES.EXCLUDED_Q_PAIRS)) {
            if (expectedNumber < GAME_RULES.MIN_TOTAL_PAIRS) expectedNumber = GAME_RULES.MIN_TOTAL_PAIRS
            setTotalPairs(expectedNumber)
        }
        else {
            expectedNumber = getClosestNotPrimeOrBanned(expectedNumber, direction, GAME_RULES.EXCLUDED_Q_PAIRS)
            if (expectedNumber < GAME_RULES.MIN_TOTAL_PAIRS) expectedNumber = GAME_RULES.MIN_TOTAL_PAIRS
            setTotalPairs(expectedNumber)
        }
        prevValuePairs.current = expectedNumber
    }

    const changeMode = () => {
        if (isAnimating) return
        setIsAnimating(true)
        setAnimationClass("slide-exit")
        
        setTimeout(() => {
            setGameMode(prev => {
                switch (prev){
                    case GAME_MODES.CLASSIC: return GAME_MODES.SEQUENCE
                    break
                    case GAME_MODES.SEQUENCE: return GAME_MODES.CLASSIC
                    break
                    default: return GAME_MODES.CLASSIC
                }
            })
            setAnimationClass("slide-enter")
            setTimeout(() => {
                setAnimationClass("")
                setIsAnimating(false)
            }, 600);
        }, 600);
    }

    return (
        <>
            <section className='opciones'>
                <div className="gameMode">
                    <div className="modesBtnContainer">
                        {/* <button tabIndex={-1} className="modeBtn" onClick={() => setModalShow(true)} ><ModeSettingsIcon></ModeSettingsIcon></button> */}
                        <button disabled={isAnimating} tabIndex={-1} className="modeBtn" onClick={changeMode}><ChangeModeIcon></ChangeModeIcon></button>
                    </div>
                    <div className="titleContainer">
                        <div className={`title ${animationClass}`}>
                            <h1>{getFancyModeName(gameMode)}</h1>
                            <OverlayTrigger
                                delay={{ show: 100, hide: 0 }}
                                key='infoTitleOverlay'
                                placement='right'
                                overlay={
                                    <Tooltip className="customTooltip" id='tooltip-right'>{gameMode === GAME_MODES.CLASSIC ? GAME_MODES_DESCRIPTIONS.CLASSIC : gameMode === GAME_MODES.SEQUENCE ? GAME_MODES_DESCRIPTIONS.SEQUENCE : GAME_MODES_DESCRIPTIONS.ERROR }</Tooltip>
                                }
                            >
                                <InfoIcon className="modeInfo" size={18}></InfoIcon>
                            </OverlayTrigger>
                        </div>
                    </div>
                </div>
               { renderQFichasBtn() }
            </section>

            <Modal
                show={modalShow}
                onHide={() => setModalShow(false)}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                    Opciones
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <div className="campo">
                        <label>Pares de fichas ({totalPairs})</label>
                        <input tabIndex={-1} type='range' min={GAME_RULES.MIN_TOTAL_PAIRS} step="1" max={GAME_RULES.MAX_TOTAL_PAIRS} onChange={ (e) => handlePairsChange(e.target.value) } value={totalPairs}></input>
                    </div>
                </Modal.Body>
            </Modal>
      </>
    )
}

export default Opciones