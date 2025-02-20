import { useState } from "react";
import LangDetect from "../../LangDetect/LangDetect";
import TranslateSelect from "../../TranslateSelect/TranslateSelect";
import "./UserOutputTxt.css";

const UserOutputTxt = ({ index, inputTxt, messages, setMessages }) => {
  const [toSummarize, setToSummarize] = useState(false);
  const [toTranslate, setToTranslate] = useState(true);
  const [lang, setLang] = useState({ long: "English", short: "en" });

  //Retrieve name of language from its asociated BCP 47 format.
  function getLanguageName(langCode) {
    const languageNames = new Intl.DisplayNames(["en"], { type: "language" });
    return languageNames.of(langCode) || "Unknown Language";
  }

  const translateTxtHandler = async (e) => {
    e.preventDefault();
    const sourceLanguage = JSON.parse(localStorage.getItem("detectedLangs"))[
      index
    ][1];
    const targetLanguage = lang.short;
    const sourceFullName = getLanguageName(sourceLanguage);
    const targetFullName = getLanguageName(targetLanguage);
    setMessages((prevMessages) => {
      return [...prevMessages, { sender: "ai", action: "load" }];
    });
      

    try {
      const translatorCapabilities = await self.ai.translator.capabilities();
      const languagePackStatus = translatorCapabilities.languagePairAvailable(
        sourceLanguage,
        targetLanguage
      );

      if (languagePackStatus === "no") {
        throw new Error(
          "This translation is currently not supported, please try another."
        );
      }

      let translator;
      if (languagePackStatus === "readily") {
        //translation logic
        translator = await self.ai.translator.create({
          sourceLanguage,
          targetLanguage,
        });
      } else {
        translator = await self.ai.translator.create({
          sourceLanguage,
          targetLanguage,
        });
      }

      const translation = await translator.translate(inputTxt);
      setMessages((prevMessages) => {
        const prev = [...prevMessages];
        prev[prev.length - 1] = {
          sender: "ai",
          action: "translate",
          sourceFullName,
          targetFullName,
          originalTxt: inputTxt,
          modifiedTxt: translation,
        };
        return prev;
      });
    } catch (error) {
      if (sourceLanguage === targetLanguage) {
        setTimeout(() => {
          setMessages((prevMessages) => {
            const prev = [...prevMessages];
            prev[prev.length - 1] = {
              sender: "ai",
              action: "displayHumourousErr",
              msg: `Phew! Translating ${sourceFullName} to ${targetFullName} was hard work. 😪 …Oh wait, nothing changed! Try a different language. 😉`,
            };
            return prev;
          });
        }, 2000);
      } else {
        setMessages((prevMessages) => {
          const prev = [...prevMessages];
          prev[prev.length - 1] = {
            sender: "ai",
            action: "displayError",
            msg: error.message,
          };
          return prev;
        });
      }

    }
  };

  return (
    <>
      <div className="user-output">
        <div className="text-box">
          <p>{inputTxt}</p>
          <LangDetect
            inputText={inputTxt}
            index={index}
            messages={messages}
            setToSummarize={setToSummarize}
            setToTranslate={setToTranslate}
          />
        </div>
        <div className="ai-tools">
          {toTranslate && <TranslateSelect lang={lang} setLang={setLang} />}
          {toTranslate && (
            <button className="translate-btn" onClick={translateTxtHandler}>
              Translate <i className="fa fa-exchange" aria-hidden="true"></i>
            </button>
          )}
          {toSummarize && (
            <button className="summarize-btn">
              Summarize <i className="fa fa-align-right" aria-hidden="true"></i>
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default UserOutputTxt;
