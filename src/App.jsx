import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  let translationTest = "The translation API is NOT supported";
  let summarizerTest = "The translation API is NOT supported";
  let langDetectTest = "The language detect API is NOT supported";

  if ("ai" in self && "translator" in self.ai) {
    translationTest = "The translation API IS supported";
  }

  if ('ai' in self && 'summarizer' in self.ai) {
   summarizerTest = "The summarizer API IS supported";
  }

  if ('ai' in self && 'languageDetector' in self.ai){
    langDetectTest = "The language detect API IS supported";
  }  

  const [count, setCount] = useState(0);

  return (
    <>
      <h3>{translationTest}</h3>
      <h3>{summarizerTest}</h3>
      <h3>{langDetectTest}</h3>
    </>
  );
}

export default App;
