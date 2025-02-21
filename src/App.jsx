import { useState, useEffect, useRef} from "react";
import ChatSpace from "./components/ChatSpace/ChatSpace";
import "./App.css";

const App = ()  =>{
  const loadRef = useRef(0);
  const [errorState, setErrorState] = useState({isErr:false, msg:""});
  const [detectorState, setDetectorState] = useState({modelState:"unavailable",downloaded:0});
  const [summarizerState, setSummarizerState] = useState({modelState:"unavailable",downloaded:0});


//Checks and downloads the language detector model.
const downloadLangDetectModel = async() =>{
  const languageDetectorCapabilities = await self.ai.languageDetector.capabilities();
  const canDetect = languageDetectorCapabilities.available;

 if(canDetect === "no"){
  //The detector model is not available for use.
  setErrorState({isErr:true,msg:"This app uses features not supported by your device."})
  }else if(canDetect === "readily"){
  //The detector model is already available
     setDetectorState({modelState:"available",downloaded:100})
  }
  else {
    // Begin download of the detector model.
     const detector = await self.ai.languageDetector.create({
      monitor(m) {
        m.addEventListener("downloadprogress", (e) => {
          console.log(e.total,e.loaded);
          console.log(((e.total/e.loaded) * 100));
          setDetectorState({modelState:"downloading",downloaded:((e.total/e.loaded) * 100)})
        });
      },
    });
    await detector.ready;
  }
}

//Checks and downloads the summarizer model.
const downloadSummarizerModel =  async() =>{
  const languageSummarizerCapabilities = await self.ai.summarizer.capabilities();
  const canSummarize = languageSummarizerCapabilities.available;

  if (canSummarize === 'readily') {
    // The Summarizer API can be used immediately .
    setSummarizerState({modelState:"available",downloaded:100})

  } else if(canSummarize === 'after-download') {
  const summarizer = await self.ai.summarizer.create();

  summarizer.addEventListener('downloadprogress', (e) => {
    setSummarizerState({modelState:"downloading",downloaded:((e.loaded/e.total) * 100)})
  });
  await summarizer.ready;
  }
}


  // Both the translator and the summarizer API's are still very experimental with limited support however the language detector API requires much lesser resources and is more widely supported, hence the user's experience with the app is only interrupted if the language detector API is unavailable.
if(!errorState.isErr){
  if ('ai' in self && 'languageDetector' in self.ai){
    useEffect(()=>{
      try {
        downloadLangDetectModel();
      } catch (error) {
        setErrorState({isErr:true,msg:"Something went wrong while loading models."})
      }
    },[])    
  }else{
    setErrorState({isErr:true,msg:"Your browser does not support this application"})
  }
}

//The summarize API does not halt interaction with the app if not available or upon failure to download.
useEffect(()=>{
  downloadSummarizerModel();
 },[])
 

//On instance of language detector not being usable
 if(errorState.isErr){
  return(
    <>
       <div className="compatibility-error-container">
        <div className="background"><i className="fa fa-frown-o" aria-hidden="true"></i></div>
       <h2 aria-label="error message" aria-live="assertive">{errorState.msg}</h2>
       </div>
    </>
  )
} 


//On instance of model downloads.
 if(detectorState.modelState === "downloading" || summarizerState.modelState === "downloading"){
  return(
    <>
    <div className="download-content-container">
    <div className="background"><i className="fa fa-smile-o" aria-hidden="true"></i></div>
    <h4>{`${detectorState.downloaded === 100 ? "Loaded detector model!" : `Downloading detector model:${detectorState.downloaded}%`}`}</h4>
    <h4>{`${summarizerState.downloaded === 100 ? "Loaded summarizer model!" : `Downloading summarizer model:${detectorState.downloaded}`}%`}</h4>
    </div>
    </>
  )
}else if(detectorState.modelState === "available"){
  return (
    <>
      <ChatSpace/>
    </>
  );

}

   


}

export default App;
