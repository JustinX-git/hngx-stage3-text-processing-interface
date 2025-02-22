import {useRef } from "react";
import "./AIOutputTxt.css";

let loaderId = null;
let translateTimeLimitId = null;
let summarizeTimeLimitId = null;
const AIOutputTxt = ({action, originalTxt, modifiedTxt,sourceFullName,targetFullName, msg, setMessages}) =>{
    //Refs
    const modifiedRef = useRef(null);
    const copyAlertRef = useRef(null);
    const loaderRef = useRef(null);
    //Two setInterval Id's where created for some reason, hence this line aims to clear them both.
    clearInterval(loaderId - 1);
    clearInterval(loaderId);
    clearTimeout(translateTimeLimitId)
    clearTimeout(summarizeTimeLimitId)

    // Translation loader animation.
    if(action === "load" || action === "displayProgress"){
        console.log(action)
        const languageSymbols  = ["A", "Ç", "Ñ", "Я", "Ğ", "Ê"];
        let index = 0;

        function changeLanguage() {
            index = (index + 1) % languageSymbols.length;
            return  languageSymbols [index];
        }

       loaderId = setInterval(()=>{
           loaderRef.current.textContent = changeLanguage()
        },1000);

//If translating text loads for up to 20 mins, terminate process and display this error.
        translateTimeLimitId =  setTimeout(()=>{
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

        //Store time outs and intervals so they can be cleared if a new chat is initiated.
        const timeOutsAndIntervals = localStorage.getItem("timeOutsAndIntervals") ? JSON.parse(localStorage.getItem("timeOutsAndIntervals")) : [];
        timeOutsAndIntervals.push(loaderId,translateTimeLimitId);
        localStorage.setItem("timeOutsAndIntervals", JSON.stringify(timeOutsAndIntervals))
        return(
            <>
            <div className="morph-container">
            <svg viewBox="0 0 300 100">
                <text x="150" y="50" className="morph-text" ref={loaderRef}>A</text>
            </svg>
        </div>
        {action === "displayProgress" &&  <p>{msg}</p>}
        </>
        )
    }else if(action === "summarizerload"){
        //If summarizing text loads for up to an hour, terminate process and display this error.
        summarizeTimeLimitId =  setTimeout(()=>{
            setMessages((prevMessages) => {
                const prev = [...prevMessages];
                prev[prev.length - 1] = {
                  sender: "ai",
                  action: "displayError",
                  msg: "Process took too long. Please check your internet connection or try a different text to proccess.",
                };
                return prev;
              });
        },3600000);
        
        const timeOutsAndIntervals = localStorage.getItem("timeOutsAndIntervals") ? JSON.parse(localStorage.getItem("timeOutsAndIntervals")) : [];
        timeOutsAndIntervals.push(summarizeTimeLimitId);
        localStorage.setItem("timeOutsAndIntervals", JSON.stringify(timeOutsAndIntervals))
        return( 
            <div className="pacman-loader" style={{
                display:"flex",
                alignItems:"center"
            }}>
           <img src="/Bean Eater.gif"  width={60} height={60} alt="pacman" /> <p className="summarizer-loader">Summarizing...</p>
           </div>
           )

    }else if(action === "displayError" || action === "displayHumourousErr"){
       return( 
        <div className="AI-output">
        <p aria-label="error message" aria-live="assertive"  className={action === "displayError" ? "alert" : ""}>{action === "displayError" && <i className="fa fa-exclamation-circle" aria-hidden="true" style={{paddingRight:".3rem"}}></i>}{msg}</p>
       </div>
       )
    }else{
        const copyTextHandler = () =>{
            const text = modifiedRef.current.textContent;

            setTimeout(()=>{})
              navigator.clipboard.writeText(text)
              .then(() => {
                  copyAlertRef.current.textContent = "Copied to clipboard";
                })
                .catch(err =>{
                    copyAlertRef.current.textContent = "Failed to copy"
                });
                copyAlertRef.current.classList.add("show");
            setTimeout(()=>{copyAlertRef.current.classList.remove("show")},2000)
        }
        return(
            <>
            <div className="AI-output">
              <div className="original-txt-wrapper">
              <h3>Original{action === "translate" ? ` (${sourceFullName})` : ""}</h3>
              <p>{originalTxt}</p>
              </div>
              <div className="modified-txt-wrapper">
                <h3>{action === "translate" ? "Translation" : "Summary"}{action === "translate" ? ` (${targetFullName})` : ""}<i className="fa fa-clipboard" title={`copy ${action === "translate" ? "translation" : "summary"}`} onClick={copyTextHandler} tabIndex={0} aria-label="clipboard"></i>
                 <span ref={copyAlertRef} className="copy-alert"></span>
                </h3>
                <p ref={modifiedRef}>{modifiedTxt}</p>
              </div>
            </div>
            </>
        )
    }

}

export default AIOutputTxt