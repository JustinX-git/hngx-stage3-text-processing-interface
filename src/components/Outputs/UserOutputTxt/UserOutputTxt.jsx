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

  //Trigger translating  model
  const translateTxtHandler = async (e) => {
    e.preventDefault();
    // Check availability of translation API.
    if ("ai" in self && "translator" in self.ai) {
      const sourceLanguage = JSON.parse(localStorage.getItem("detectedLangs"))[
        index
      ][1];
      const targetLanguage = lang.short;
      const sourceFullName = getLanguageName(sourceLanguage);
      const targetFullName = getLanguageName(targetLanguage);

      //Dispatch loading animation.
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
        //In the instance where user attempts to translate a language to itself, we display a humorous message.
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
    } else {
      setMessages((prevMessages)=>{
         return [...prevMessages,{
          sender: "ai",
          action: "displayError",
          msg: "Sorry, this feature is not supported on your browser."
        }]
      });
    }
  };

  //Trigger summarizer model
  const summarizeTxtHandler = async (e) =>{
    e.preventDefault();
    if ('ai' in self && 'summarizer' in self.ai) {
      //Dispatch loading animation.
      setMessages((prevMessages) => {
        return [...prevMessages, { sender: "ai", action: "summarizerload" }];
      });

  try {
    const summarizer = await self.ai.summarizer.create({format:"plain-text"});
    const summary = await summarizer.summarize(longText);

    setMessages((prevMessages) => {
      const prev = [...prevMessages];
      prev[prev.length - 1] = {
        sender: "ai",
        action: "summarize",
        originalTxt: inputTxt,
        modifiedTxt: summary,
      };
      return prev;
    });
  } catch (error) {
    if(error.message === "The session cannot be created."){
      setMessages((prevMessages) => {
        const prev = [...prevMessages];
        prev[prev.length - 1] = {
          sender: "ai",
          action: "displayError",
          msg: "Sorry, your device doesn't meet the requirements to run the summarize model.",
        };
        return prev;
      });
    }else{
      console.log(error.message);
      console.log(error);
      setMessages((prevMessages) => {
        const prev = [...prevMessages];
        prev[prev.length - 1] = {
          sender: "ai",
          action: "displayError",
          msg: "Something went wrong.",
        };
        return prev;
      });
    }
  }


    }else{
      setMessages((prevMessages)=>{
        return [...prevMessages,{
         sender: "ai",
         action: "displayError",
         msg: "Sorry, this feature is not supported on your browser."
       }]
     });
    }
  }

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
          {toTranslate && (
            <button tabIndex={0} aria-label="translate button" className="translate-btn" onClick={translateTxtHandler}>
              Translate <i className="fa fa-exchange" aria-hidden="true"></i>
            </button>
          )}
          {toSummarize && (
            <button tabIndex={0} aria-label="summarize button" className="summarize-btn" onClick={summarizeTxtHandler}>
              Summarize <i className="fa fa-align-right" aria-hidden="true"></i>
            </button>
          )}
        </div>
      </div>
      {toTranslate && (
        <TranslateSelect
          toSummarize={toSummarize}
          lang={lang}
          setLang={setLang}
        />
      )}
    </>
  );
};

export default UserOutputTxt;
