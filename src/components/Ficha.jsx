import { PiSealQuestionBold  as HiddenIcon} from "react-icons/pi"

function Ficha({ myKey, pairId, name, Icon, color, status, handleClick }){
    const alphaColor = color.replace('1)', '0.5)')

    return (
        <div 
        onClick={() => handleClick(myKey)}
        className="ficha" 
        style={!status ? { borderColor: 'gray', backgroundColor: 'lightgray', cursor: 'pointer', filter: 'drop-shadow(0px 0px 1px var(--dark))' } : { borderColor: alphaColor, backgroundColor: 'var(--lightGray)'}}
        >
            {
            !status
            ? <>
                <div className="svg-container">
                    <HiddenIcon color='gray' size='50'></HiddenIcon> 
                </div>
            </>
            : <>
                <div className="svg-container">
                    <Icon color={color} size='50'></Icon>
                </div>
                <p style={{color: color}}>{name}</p>
            </>
            }
        </div>
    )
}

export default Ficha