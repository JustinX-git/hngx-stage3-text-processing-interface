import { useRef, useState, useEffect } from "react";
import Intro from "../Intro/Intro";
import Navbvar from "../UI/Navbar/Navbar";
import TextInput from "../UI/TextInput/TextInput";
import UserOutputTxt from "../Outputs/UserOutputTxt/UserOutputTxt";
import AIOutputTxt from "../Outputs/AIOutputTxt/AIOutputTxt";
import "./ChatSpace.css";

const ChatSpace = () => {
  const outputEndRef = useRef(null);
  const [detectorState, setDetectorState] = useState({modelState:"unavailable",downloaded:0});
  const [summarizerState, setSummarizerState] = useState({modelState:"unavailable",downloaded:0});
  const [messages, setMessages] = useState([]);
  let userMsgIndex = 0;

//Downloading Language Detect model if not available
const downloadLangDetectModel = async() =>{
  const languageDetectorCapabilities = await self.ai.languageDetector.capabilities();
  const canDetect = languageDetectorCapabilities.available;

 if(canDetect === "readily"){
  //The detector model is already available
     setDetectorState({modelState:"available",downloaded:100})
  }
  else {
    // Begin download of the model
     const detector = await self.ai.languageDetector.create({
      monitor(m) {
        m.addEventListener("downloadprogress", (e) => {
          setDetectorState({modelState:"downloading",downloaded:((e.total/e.loaded) * 100)})
        });
      },
    });
    await detector.ready;
  }
}

const downloadSummarizerModel =  async() =>{
  const languageSummarizerCapabilities = await self.ai.summarizer.capabilities();
  const canSummarize = languageSummarizerCapabilities.available;

  console.log(languageSummarizerCapabilities)
 
  if (canSummarize === 'readily') {
    // The Summarizer API can be used immediately .
    setSummarizerState({modelState:"available",downloaded:100})
  } else if(canSummarize === 'after-download') {
    // The Summarizer API can be used after the model is downloaded.
    // const summarizer = await self.ai.summarizer.create();
    // summarizer.addEventListener('downloadprogress', (e) => {
    //   console.log(e.loaded, e.total);
    //   // setSummarizerState({modelState:"downloading",downloaded:((e.loaded/e.total) * 100)})
    // });
    await summarizer.ready;
  }
}



//Effects
useEffect(()=>{
  downloadLangDetectModel();
},[detectorState.modelState])


useEffect(()=>{
 downloadSummarizerModel();
},[summarizerState.modelState])


//Scrolls to the bottom of the chats for every update in the chat messages.
  useEffect(()=>{
    const lastMsg = messages[messages.length - 1];
    if(lastMsg && (lastMsg.action !== "translate" && lastMsg.action !== "summarize" )){
      outputEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  

  },[messages])


  if(detectorState.modelState === "unavailable"){
    return(
      <>
      <h4>Could not load models, this could be due to insufficent disk storage.</h4>
      <p>A minimum of 22Gb disk storage is required.</p>
      </>
    )
    
  }else if(detectorState.modelState === "downloading"){
    return(
      <>
      <h4>Loading Language Detector Model: {detectorState.downloaded}</h4>
      <h4>Loading Summarizer Model: {summarizerState.downloaded}</h4>
      </>
    )
  }

  //Chat renders
  if(messages.length === 0) return <Intro messages={messages} setMessages={setMessages}/>
       
  return(
    <>
     <Navbvar messages={messages} setMessages={setMessages}/>
    <div className="chatbox">
      {messages.map((msg, index,array) => (msg.sender ==="user" ? <UserOutputTxt key={index} index={userMsgIndex++} inputTxt={msg.text} messages={array} setMessages={setMessages}/>:<AIOutputTxt  key={index} action={msg.action} originalTxt={msg.originalTxt} modifiedTxt={msg.modifiedTxt} sourceFullName={msg. sourceFullName} targetFullName={msg.targetFullName} errorMsg={msg.msg} setMessages={setMessages}/>)
    )}
    <div style={{marginTop:"2rem"}} ref={outputEndRef}/>
    </div>
       <TextInput isIntro={false} setMessages={setMessages}/>
     </>
  )
};

export default ChatSpace;
