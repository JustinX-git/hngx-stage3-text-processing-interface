import { useRef, useState, useEffect } from "react";
import TextInput from "../UI/TextInput/TextInput";
import UserOutputTxt from "../Outputs/UserOutputTxt/UserOutputTxt";
import AIOutputTxt from "../Outputs/AIOutputTxt/AIOutputTxt";
import "./ChatSpace.css";

const ChatSpace = () => {
  const outputEndRef = useRef(null);
  const [detectorState, setDetectorState] = useState({modelState:"unavailable",downloaded:0});
  // const [summarizerState, setSummarizerState] = useState({modelState:"unavailable",downloaded:0});
  const [messages, setMessages] = useState([]);

//Downloading Models if not available
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
    const summarizer = await self.ai.summarizer.create();
    summarizer.addEventListener('downloadprogress', (e) => {
      console.log(e.loaded,e.total)
      // setSummarizerState({modelState:"downloading",downloaded:((e.loaded/e.total) * 100)})
    });
    await summarizer.ready;
  }
}
 

// useEffect(()=>{
//   downloadSummarizerModel();
// },[summarizerState.modelState])

useEffect(()=>{
  console.log(detectorState)
  downloadLangDetectModel();
},[detectorState.modelState])

  useEffect(()=>{
    outputEndRef.current?.scrollIntoView({ behavior: "smooth" })
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

  return(
    <>
      {messages.map((msg, index) => (msg.sender ==="user" ? <UserOutputTxt key={index} index={index} inputTxt={msg.text}/>:<AIOutputTxt  key={index} inputTxt={msg.text}/>)
    )}
    <div style={{marginTop:"7rem"}} ref={outputEndRef}/>
       <TextInput setMessages={setMessages}/>
     </>
  )
};

export default ChatSpace;
