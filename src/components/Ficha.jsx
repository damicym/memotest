import { PiSealQuestionBold as HiddenIcon} from "react-icons/pi"

function Ficha({ ficha, handleClick, lockState }){
    const { id, pairId, name, Icon, color, status, beingHinted } = ficha
    const alphaColor = color.replace('1)', '0.5)')

    return (
        <div 
        onClick={() => handleClick(id)}
        className={`ficha ${beingHinted ? 'hinted' : ''}`}
        style={{
            '--hint-color': color,
            ...(!status ? {
                borderColor: 'gray', 
                backgroundColor: 'lightgray', 
                filter: 'drop-shadow(0px 0px 1px var(--dark))', 
                cursor: !lockState ? 'pointer' : 'auto'
            } : { 
                borderColor: alphaColor, 
                backgroundColor: 'var(--lightGray)'
            })
        }}
        >
            {
            !status
            ? <>
                <div className="svg-container">
                    <HiddenIcon color='gray' size='40'></HiddenIcon> 
                </div>
            </>
            : <>
                <div className="svg-container">
                    <Icon color={color} size='40'></Icon>
                </div>
                <p style={{color: color}}>{name}</p>
            </>
            }
        </div>
    )
}

export default Ficha