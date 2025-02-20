const TranslateOption = ({lang,shortLang,selected,index,setSelected,setLang}) =>{
    const selectedHandler = () =>{
       setSelected(true);
       setLang({long:lang,short:shortLang})
    }
    return (
        <li className={`option${selected ? "" : " reveal"}`} onClick={selectedHandler} style={{animationDelay:`${index *.103}s`}} aria-label={"Translation option"}>{lang}</li>
    )
}

export default TranslateOption