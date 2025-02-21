import {useRef } from "react";
import "./AIOutputTxt.css";

let loaderId = null;
let timeLimitId = null;
const AIOutputTxt = ({action, originalTxt, modifiedTxt,sourceFullName,targetFullName, errorMsg, setMessages}) =>{
    //Refs
    const modifiedRef = useRef(null);
    const copyAlertRef = useRef(null);
    const loaderRef = useRef(null);
    //Two setInterval Id's where created for some reason, hence this line aims to clear them both.
    clearInterval(loaderId - 1);
    clearInterval(loaderId);
    clearTimeout(timeLimitId)

    if(action === "load"){
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
                  msg: "Process took too long. Please check your internet connection or try a different text to proccess.",
                };
                return prev;
              });
        },1200000)

        return(
            <div className="morph-container">
            <svg viewBox="0 0 300 100">
                <text x="150" y="50" className="morph-text" ref={loaderRef}>A</text>
            </svg>
        </div>
        )
    }else if(action === "summarizerload"){
        return( 
            <div className="AI-output" style={{
                display:"flex",
                alignItems:"center"
            }}>
           <img src="/Bean Eater.gif"  width={60} height={60} alt="pacman" /> <p className="summarizer-loader">Summarizing...</p>
           </div>
           )

    }else if(action === "displayError" || action === "displayHumourousErr"){
       return( 
        <div className="AI-output">
        <p aria-label="error message" aria-live="assertive"  className={action === "displayError" ? "alert" : ""}>{errorMsg}</p>
       </div>
       )
    }else{
        const copyTextHandler = () =>{
            const text = modifiedRef.current.textContent;

            setTimeout(()=>{})
              navigator.clipboard.writeText(text)
              .then(() => {
                copyAlertRef.current.classList.add("show")
                setTimeout(()=>{copyAlertRef.current.classList.remove("show")},2000)
              })
              .catch(err => console.error("Failed to copy: ", err));
        }
        return(
            <>
            <div className="AI-output">
              <div className="original-txt-wrapper">
              <h3>Original{action === "translate" ? ` (${sourceFullName})` : ""}</h3>
              <p>{originalTxt}</p>
              </div>
              <div className="modified-txt-wrapper">
                <h3>{action === "translate" ? "Translation" : "Summary"}{action === "translate" ? ` (${targetFullName})` : ""}<i className="fa fa-clipboard" aria-hidden="true" title={`copy ${action === "translate" ? "translation" : "summary"}`} onClick={copyTextHandler}></i>
                 <span ref={copyAlertRef} className="copy-alert">Copied to clipboard</span>
                </h3>
                <p ref={modifiedRef}>{modifiedTxt}</p>
              </div>
            </div>
            </>
        )
    }

}

export default AIOutputTxt