import { useRef, useState } from 'react'
import { useEffect } from 'react'
import { GAME_STATUS, GAME_MODES, TIMINGS } from "./Juego"
import { getFancyTimeBySecs } from '../libs/myFunctions'
import ProgressBar from 'react-bootstrap/ProgressBar';
import { AiOutlineBulb as HintIcon } from "react-icons/ai";
import { FiFlag as GiveUpIcon} from "react-icons/fi";
import { GrPowerReset as ResetIcon } from "react-icons/gr";
import Tooltip from 'react-bootstrap/Tooltip';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import { numberIcons } from '../libs/myFunctions';

function Stats({ totalGroups, qGuessedPairs, reset, hint, giveUp, gameStatus, hintActive, wasHintActive, fichasPerGroup, gameMode /* , usedHints */ }){
    const [animatedDots, setPuntos] = useState("...")
    const [secondsInGame, setSeconds] = useState()
    const [timeInGame, setTimeInGame] = useState(0)
    const [progress, setProgress] = useState((qGuessedPairs / totalGroups) * 100)
    // const [FichasPerGIcon, setFichasPerGIcon] = useState(null)
    
    // useEffect(() => {
    //     setFichasPerGIcon(gameMode === GAME_MODES.SEQUENCE ? numberIcons[fichasPerGroup - 1] : null)
    // }, [fichasPerGroup])

    useEffect(() => {
        setProgress((qGuessedPairs / totalGroups) * 100)
    }, [totalGroups, qGuessedPairs])

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
                <>
                    {/* <div className='protip'>
                        <p>
                            Encontrá grupos de <span className="inline-icon">{FichasPerGIcon && <FichasPerGIcon />}</span> fichas en su orden correcto
                        </p>
                    </div> */}
                    <div className='waiting'>
                        <p>Esperando a que empieces a jugar para mostrar estadísticas</p>
                        <p>{animatedDots}</p>
                    </div>
                </>
            :  
            <>
                <section className='statsInfo'>
                    <p className="timer" style={{ width: '85px', textAlign: 'center', opacity: gameStatus === GAME_STATUS.GIVEN_UP ? '0.4' : '1'}} >{timeInGame}</p>
                    <div className="customProgressBar" style={{ position: 'relative', width: '250px', opacity: gameStatus === GAME_STATUS.GIVEN_UP ? '0.4' : '1' }}>
                        <ProgressBar
                            striped={gameStatus === GAME_STATUS.GIVEN_UP}
                            animated={gameStatus !== GAME_STATUS.GIVEN_UP}
                            now={Math.max(4, progress)} 
                            className='progressBarComponent'
                            style={{ 
                                '--bs-progress-bar-bg': `hsl(${progress}, 55%, 55%)`,
                                '--bs-progress-font-size': '0.8rem',
                            }}
                        />
                        <div className='progressText'>
                            {`${Math.floor((qGuessedPairs / totalGroups) * 100)}%`}
                        </div>
                    </div>
                    { gameStatus === GAME_STATUS.GIVEN_UP &&
                        <p className='givenUpText' >¡Juego terminado!</p>
                    }
                    <section className='controlsContainer'>
                    { gameStatus !== GAME_STATUS.STARTED || hintActive /* || usedHints >= GAME_RULES.MAX_HINTS */ ?
                        <div className="hintBtnContainer">
                            <button 
                                tabIndex={-1}
                                /* && usedHints !== GAME_RULES.MAX_HINTS */
                                className={`control ${hintActive ? 'loadingHint' : wasHintActive.current && gameStatus === GAME_STATUS.STARTED ? 'bounce' : ''}`} 
                                onClick={hint} 
                                disabled={gameStatus !== GAME_STATUS.STARTED || hintActive /* || usedHints >= GAME_RULES.MAX_HINTS */} 
                            >
                                <HintIcon />
                            </button>
                            {/* { usedHints !== GAME_RULES.MAX_HINTS && gameStatus === GAME_STATUS.STARTED ?
                                <span 
                                    style={{pointerEvents: gameStatus !== GAME_STATUS.STARTED || hintActive || usedHints >= GAME_RULES.MAX_HINTS ? 'none' : 'auto'}}
                                    onClick={hint}
                                    className="hintBadge">{GAME_RULES.MAX_HINTS - usedHints}
                                </span> :<></>
                            } */}
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
                                    /* && usedHints !== GAME_RULES.MAX_HINTS */
                                    className={`control ${hintActive ? 'loadingHint' : wasHintActive.current && gameStatus === GAME_STATUS.STARTED ? 'bounce' : ''}`} 
                                    onClick={hint} 
                                    disabled={gameStatus !== GAME_STATUS.STARTED || hintActive /* || usedHints >= GAME_RULES.MAX_HINTS */} 
                                >
                                    <HintIcon />
                                </button>
                                {/* { usedHints !== GAME_RULES.MAX_HINTS && gameStatus === GAME_STATUS.STARTED ?
                                    <span 
                                        style={{pointerEvents: gameStatus !== GAME_STATUS.STARTED || hintActive || usedHints >= GAME_RULES.MAX_HINTS ? 'none' : 'auto'}}
                                        onClick={hint}
                                        className="hintBadge">{GAME_RULES.MAX_HINTS - usedHints}
                                    </span> :<></>
                                } */}
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