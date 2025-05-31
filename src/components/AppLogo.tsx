import Applogo from '../assets/logo.jpg';

const AppLogo = ({isChangeHeight = false, isCenterAlign = true}) =>{
    return (
        <>
        {isChangeHeight == true ? 
            <img src={Applogo} className={isCenterAlign == true ? 'mx-auto': ''} style={{height:'50px'}}/> :
            <img src={Applogo} className={isCenterAlign == true ? 'mx-auto': ''}/> 
        }
        </>
    )
}

export default AppLogo;