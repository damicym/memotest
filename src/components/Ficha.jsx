import { PiSealQuestionBold as HiddenIcon} from "react-icons/pi"
import { FICHA_STATUS } from "./Juego"
import { useEffect, useState } from 'react'

function Ficha({ ficha, handleClick, lockState, shouldFichasAnimate, timeToShine }){
    const [showShadow, setShowShadow] = useState(true)

    const { id, name, Icon, color, status, beingHinted } = ficha
    const alphaColor = color.replace('1)', '0.5)')

    useEffect(() => {
        if (status === FICHA_STATUS.ESCONDIDA) {
            setShowShadow(true)
        } else {
            setShowShadow(false)
        }
    }, [status])

    const handleTransitionStart = () => {
        if (status === FICHA_STATUS.ESCONDIDA) {
            setShowShadow(true)
        } else {
            setShowShadow(false)
        }
    }

    return (
        <div 
            onClick={() => handleClick(id)}
            className={`ficha ${beingHinted ? 'hinted' : ''}`}
            style={{
                '--hint-color': color,
                cursor: status === FICHA_STATUS.ESCONDIDA && !lockState  ? 'pointer' : 'auto',
                filter: showShadow ? 'drop-shadow(0px 0px 1px var(--dark))' : 'none',
                transform: status === FICHA_STATUS.MOSTRADA ? 'scale(1.05)' : 'scale(1)',
            }}
        >
            <div className="ficha-inner"
                onTransitionStart={handleTransitionStart}
                style={{
                    transition: shouldFichasAnimate ? 'transform 0.5s ease' : 'none',
                    ...(status === FICHA_STATUS.MOSTRADA || status === FICHA_STATUS.ADIVINADA) && shouldFichasAnimate
                    ? { transform: 'rotateY(180deg)' } 
                    : { transform: 'none' }
                }}
            >
                <div className="ficha-back"
                    style={{
                        borderColor: 'gray', 
                        backgroundColor: 'lightgray', 
                    }}
                >
                    <div className="svg-container">
                        <HiddenIcon color='gray' size='40'></HiddenIcon> 
                    </div>
                </div>
                <div className={`ficha-front ${status === FICHA_STATUS.ADIVINADA && timeToShine ? 'adivinada' : ''}`}
                    style={{
                        borderColor: alphaColor, 
                        backgroundColor: 'var(--lightGray)'
                    }}
                >
                    <div className="svg-container">
                        <Icon color={color} size='40'></Icon>
                    </div>
                    <p style={{color: color}}>{name}</p>
                </div>
            </div>

        </div>
    )
}

export default Ficha