import Applogo from '../assets/logo.jpg';

const AppLogo = ({isChangeHeight = false, isCenterAlign = true}) =>{
    return (
        <>
        {isChangeHeight == true ? 
            <img src={Applogo} className={isCenterAlign == true ? 'mx-auto col-span-8 justify-self-center': 'col-span-8 justify-self-center'} style={{height:'50px'}}/> :
            <img src={Applogo} className={isCenterAlign == true ? 'mx-auto col-span-8 justify-self-center': 'col-span-8 justify-self-center'}/> 
        }
        </>
    )
}

export default AppLogo;