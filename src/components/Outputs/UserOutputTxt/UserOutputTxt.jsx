import { useState } from "react";
import LangDetect from "../../LangDetect/LangDetect";
import TranslateSelect from "../../TranslateSelect/TranslateSelect";
import "./UserOutputTxt.css";

const UserOutputTxt = ({ index, inputTxt }) => {
  const [toSummarize, setToSummarize] = useState(false);
  const [toTranslate, setToTranslate] = useState(true);
  const [lang, setLang] = useState({long:"English",short:"en"});


  const translateTxtHandler = (e) => {
    e.preventDefault();
    console.log(lang)
  };
  return (
    <>
      <div id="user-output">
        <p>{inputTxt}</p>
        <div id="ai-tools">
          <LangDetect
            inputText={inputTxt}
            index={index}
            setToSummarize={setToSummarize}
            setToTranslate={setToTranslate}
          />
          <div id="active-tools">
            {toTranslate && <TranslateSelect lang={lang} setLang={setLang} />}
            {toTranslate && (
              <button onClick={translateTxtHandler}>Translate</button>
            )}
            {toSummarize && <button>Summarize</button>}
          </div>
        </div>
      </div>
    </>
  );
};

export default UserOutputTxt;
