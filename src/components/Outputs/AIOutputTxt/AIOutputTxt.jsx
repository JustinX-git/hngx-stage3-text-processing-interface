import {useRef } from "react";
import "./AIOutputTxt.css";

let loaderId = null;
let timeLimitId = null;
const AIOutputTxt = ({action, originalTxt, modifiedTxt,sourceFullName,targetFullName, errorMsg, setMessages}) =>{
    //Two setInterval Id's where created for some reason, hence this line aims to clear them both.
    clearInterval(loaderId - 1);
    clearInterval(loaderId);
    clearTimeout(timeLimitId)

    if(action === "load"){
        const loaderRef = useRef(null);
        const languageSymbols  = ["A", "Ç", "Ñ", "Я", "Ğ", "Ê"];
        let index = 0;

        function changeLanguage() {
            index = (index + 1) % languageSymbols.length;
            return  languageSymbols [index];
        }

       loaderId = setInterval(()=>{
           loaderRef.current.textContent = changeLanguage()
        },1000);


        timeLimitId =  setTimeout(()=>{
            setMessages((prevMessages) => {
                const prev = [...prevMessages];
                prev[prev.length - 1] = {
                  sender: "ai",
                  action: "displayError",
                  msg: "Process took too long. Please check your internet connection and try again.",
                };
                return prev;
              });
        },120000)

        return(
            <div className="morph-container">
            <svg viewBox="0 0 300 100">
                <text x="150" y="50" className="morph-text" ref={loaderRef}>A</text>
            </svg>
        </div>
        )
    } else if(action === "displayError" || action === "displayHumourousErr"){

       return(
        
        <div className="AI-output">
        <p className={action === "displayError" ? "alert" : ""}>{errorMsg}</p>
       </div>
       )
    }else{
        return(
            <>
            <div className="AI-output">
              <div className="original-txt-wrapper">
              <h3>Original{action === "translate" ? ` (${sourceFullName})` : ""}</h3>
              <p>{originalTxt}</p>
              </div>
              <div className="modified-txt-wrapper">
                <h3>{action === "translate" ? "Translation" : "Summary"}{action === "translate" ? ` (${targetFullName})` : ""}</h3>
                <p>{modifiedTxt}</p>
              </div>
            </div>
            </>
        )
    }

}

export default AIOutputTxt