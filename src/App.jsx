import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  let test = "The translation API is NOT supported";
  if ("ai" in self && "translator" in self.ai) {
    // The Translator API is supported.
    console.log(self);
    // console.log("The translation API IS supported")
    test = "The translation API IS supported";
  }

  const [count, setCount] = useState(0);

  return (
    <>
      <h1>{test}</h1>
    </>
  );
}

export default App;
