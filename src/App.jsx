import ChatSpace from "./components/ChatSpace/ChatSpace";
import "./App.css";

const App = ()  =>{
  let translationTest = "The translation API is NOT supported";
  let summarizerTest = "The translation API is NOT supported";
  let langDetectTest = "The language detect API is NOT supported";

  if ("ai" in self && "translator" in self.ai) {
    translationTest = "The translation API IS supported";
  }

  if ('ai' in self && 'summarizer' in self.ai) {
   summarizerTest = "The summarizer API IS supported";
  }

  return (
    <>
      <ChatSpace/>
      {/* <h3>{summarizerTest}</h3>
      <h3>{langDetectTest}</h3> */}
    </>
  );
}

export default App;
