const TranslateOption = ({lang,shortLang,index,setSelected,setLang}) =>{
    const selectedHandler = () =>{
       setSelected(true);
       setLang({long:lang,short:shortLang})
    }
    return (
        <li className="option" onClick={selectedHandler} style={{animationDelay:`${index *.7}s`}}>{lang}</li>
    )
}

export default TranslateOption