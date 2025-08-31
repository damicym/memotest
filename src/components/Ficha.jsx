import { PiSealQuestionBold  as HiddenIcon} from "react-icons/pi"

function Ficha({pairId, name, Icon, color, status}){
    const alphaColor = color.replace('1)', '0.5)')

    return (
        <div 
        className="ficha" 
        style={status === 'hidden' ? { borderColor: 'gray', backgroundColor: 'lightgray' } : { borderColor: alphaColor, backgroundColor: 'var(--lightGray)'}}
        >
            {
            status === 'hidden' 
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