import { Fragment, useState } from 'react'
import { useEffect } from 'react'
import { GAME_STATUS, GAME_RULES, TIMINGS } from "./Juego"
import { getFancyTimeBySecs } from '../libs/myFunctions'
import ProgressBar from 'react-bootstrap/ProgressBar';
import { AiOutlineBulb as HintIcon } from "react-icons/ai";
import { FiFlag as GiveUpIcon} from "react-icons/fi";
import { GrPowerReset as ResetIcon } from "react-icons/gr";
import Tooltip from 'react-bootstrap/Tooltip';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';

function Stats({ totalPairs, qGuessedPairs, errors, reset, hint, giveUp, gameStatus, hintActive, wasHintActive, usedHints }){
    const [animatedDots, setPuntos] = useState("...")
    const [secondsInGame, setSeconds] = useState()
    const [timeInGame, setTimeInGame] = useState(0)

    useEffect(() => {
        const waitingInterval = setInterval(() => {
            if(gameStatus !== GAME_STATUS.NOT_STARTED) {
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

    return (
       <section className='stats' style={{ display: gameStatus === GAME_STATUS.NOT_STARTED ? 'flex' : 'grid'}}>
        { gameStatus === GAME_STATUS.NOT_STARTED ? 
            <div className='waiting'>
                <p>Esperando a que empieces a jugar para mostrar estadísticas</p>
                <p>{animatedDots}</p>
            </div>
        :  
            <>
                <section className='statsInfo'>
                    <p className="timer" style={{ width: '85px', textAlign: 'center', opacity: gameStatus === GAME_STATUS.GIVEN_UP ? '0.4' : '1'}} >{timeInGame}</p>
                    <div className="customProgressBar" style={{ position: 'relative', width: '250px', opacity: gameStatus === GAME_STATUS.GIVEN_UP ? '0.4' : '1' }}>
                        <ProgressBar
                            striped={gameStatus === GAME_STATUS.GIVEN_UP}
                            animated={gameStatus !== GAME_STATUS.GIVEN_UP}
                            now={(qGuessedPairs / totalPairs) * 100} 
                            style={{ 
                                '--bs-progress-bar-bg': 'var(--success)',
                                '--bs-progress-font-size': '0.8rem',
                                width: "100%", 
                                height: "26px",
                                borderRadius: '13px',
                                backgroundColor: 'var(--lightGray)'
                            }}
                        />
                        <div 
                            style={{
                                position: 'absolute',
                                top: '0',
                                left: '0',
                                width: '100%',
                                height: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'var(--accent)',
                                fontWeight: '650',
                                fontSize: '0.9rem',
                                pointerEvents: 'none',
                                zIndex: 1
                            }}
                        >
                            {`${Math.floor((qGuessedPairs / totalPairs) * 100)}%`}
                        </div>
                    </div>
                    { gameStatus === GAME_STATUS.GIVEN_UP ?
                        <p className='givenUpText' >¡Te rendiste!</p> :<></>
                    }
                    <section className='controlsContainer'>
                    { gameStatus !== GAME_STATUS.STARTED || hintActive || usedHints >= GAME_RULES.MAX_HINTS ?
                        <div className="hintBtnContainer">
                            <button 
                                tabIndex={-1}
                                className={`control ${hintActive && usedHints !== GAME_RULES.MAX_HINTS ? 'loadingHint' : wasHintActive.current && usedHints !== GAME_RULES.MAX_HINTS ? 'bounce' : ''}`} 
                                onClick={hint} 
                                disabled={gameStatus !== GAME_STATUS.STARTED || hintActive || usedHints >= GAME_RULES.MAX_HINTS} 
                            >
                                <HintIcon />
                            </button>
                            { usedHints !== GAME_RULES.MAX_HINTS && gameStatus === GAME_STATUS.STARTED ?
                                <span 
                                    style={{pointerEvents: gameStatus !== GAME_STATUS.STARTED || hintActive || usedHints >= GAME_RULES.MAX_HINTS ? 'none' : 'auto'}}
                                    onClick={hint}
                                    className="hintBadge">{GAME_RULES.MAX_HINTS - usedHints}
                                </span> :<></>
                            }
                        </div>
                        : 
                        <OverlayTrigger
                            delay={{ show: 700, hide: 0 }}
                            key='hintOverlay'
                            placement='top'
                            overlay={
                                <Tooltip className="customTooltip" id='tooltip-top'>Usar una pista</Tooltip>
                            }
                        >
                            <div className="hintBtnContainer">
                                <button 
                                    tabIndex={-1}
                                    className={`control ${hintActive && usedHints !== GAME_RULES.MAX_HINTS ? 'loadingHint' : wasHintActive.current && usedHints !== GAME_RULES.MAX_HINTS ? 'bounce' : ''}`} 
                                    onClick={hint} 
                                    disabled={gameStatus !== GAME_STATUS.STARTED || hintActive || usedHints >= GAME_RULES.MAX_HINTS} 
                                >
                                    <HintIcon />
                                </button>
                                { usedHints !== GAME_RULES.MAX_HINTS && gameStatus === GAME_STATUS.STARTED ?
                                    // <p>{GAME_RULES.MAX_HINTS - usedHints}</p> :<></>
                                    <span 
                                        style={{pointerEvents: gameStatus !== GAME_STATUS.STARTED || hintActive || usedHints >= GAME_RULES.MAX_HINTS ? 'none' : 'auto'}}
                                        onClick={hint}
                                        className="hintBadge">{GAME_RULES.MAX_HINTS - usedHints}
                                    </span> :<></>
                                }
                            </div>
                        </OverlayTrigger>
                    }
                    { gameStatus !== GAME_STATUS.STARTED ?
                        <button 
                            tabIndex={-1}
                            className="control" 
                            onClick={giveUp} 
                            disabled={gameStatus !== GAME_STATUS.STARTED} 
                        >
                            <GiveUpIcon />
                        </button>
                        :
                        <OverlayTrigger
                            delay={{ show: 700, hide: 0 }}
                            key='giveUpOverlay'
                            placement='top'
                            overlay={
                                <Tooltip className="customTooltip" id='tooltip-top'>Rendirse</Tooltip>
                            }
                        >
                            <button 
                                tabIndex={-1}
                                className="control" 
                                onClick={giveUp} 
                                disabled={gameStatus !== GAME_STATUS.STARTED} 
                            >
                                <GiveUpIcon />
                            </button>
                        </OverlayTrigger>
                    }
                    { gameStatus === GAME_STATUS.NOT_STARTED ?
                        <button 
                            tabIndex={-1}
                            className="control" 
                            onClick={() => reset()} 
                            disabled={gameStatus === GAME_STATUS.NOT_STARTED} 
                        >
                            <ResetIcon />
                        </button>
                        :
                        <OverlayTrigger
                            delay={{ show: 700, hide: 0 }}
                            key='resetOverlay'
                            placement='top'
                            overlay={
                                <Tooltip className="customTooltip" id='tooltip-top'>Regenerar tablero</Tooltip>
                            }
                        >
                            <button 
                                tabIndex={-1}
                                className="control" 
                                onClick={() => reset()} 
                                disabled={gameStatus === GAME_STATUS.NOT_STARTED} 
                            >
                                <ResetIcon />
                            </button>
                        </OverlayTrigger>
                    }
                    </section>
                </section>
            </>
        }
            
       </section>
    )
}

export default Stats