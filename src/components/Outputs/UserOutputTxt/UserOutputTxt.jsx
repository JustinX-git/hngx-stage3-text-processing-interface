import { useState } from "react";
import LangDetect from "../../LangDetect/LangDetect";
import TranslateSelect from "../../TranslateSelect/TranslateSelect";
import "./UserOutputTxt.css";

const UserOutputTxt = ({ index, inputTxt, messages, setMessages }) => {
  const [toSummarize, setToSummarize] = useState(false);
  const [toTranslate, setToTranslate] = useState(true);
  const [lang, setLang] = useState({ long: "English", short: "en" });
  const lastMsgAction = messages[messages.length - 1].action;

  //Retrieve name of language from its asociated BCP 47 format.
  function getLanguageName(langCode) {
    const languageNames = new Intl.DisplayNames(["en"], { type: "language" });
    return languageNames.of(langCode) || "Unknown Language";
  }

  //Trigger translating  model
  const translateTxtHandler = async (e) => {
    e.preventDefault();
    if ("Translator" in self) {
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
        const translatorCapabilities = await Translator.availability({
          sourceLanguage,
          targetLanguage,
        });
        if (translatorCapabilities === "unavailable") {
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
            return;
          }

          setMessages((prevMessages) => {
            const prev = [...prevMessages];
            prev[prev.length - 1] = {
              sender: "ai",
              action: "displayError",
              msg: "This translation is currently not supported, please try another language pair.",
            };
            return prev;
          });
          return;
        }

        let translator;
        if (translatorCapabilities === "available") {
          translator = await Translator.create({
            sourceLanguage,
            targetLanguage,
          });
        } else {
          try {
            if (!navigator.onLine) {
              throw new Error("NetworkError");
            }
            //Attempt download of language pack.
            translator = await Translator.create({
              sourceLanguage,
              targetLanguage,
            });
          } catch (error) {
            if (error.message.includes("NetworkError")) {
              setMessages((prevMessages) => {
                const prev = [...prevMessages];
                prev[prev.length - 1] = {
                  sender: "ai",
                  action: "displayError",
                  msg: "Translation download interrupted. Check your internet connection and try again.",
                };
                return prev;
              });
            } else {
              throw error;
            }
            return;
          }
        }

        const translation = await translator.translate(inputTxt);
        setMessages((prevMessages) => {
          const prev = [...prevMessages];
          prev[prev.length - 1] = {
            sender: "ai",
            action: "translate",
            originalTxt: inputTxt,
            modifiedTxt: translation,
            sourceFullName,
            targetFullName,
          };
          return prev;
        });
      } catch (error) {
        setMessages((prevMessages) => {
          const prev = [...prevMessages];
          prev[prev.length - 1] = {
            sender: "ai",
            action: "displayError",
            msg: "Something went wrong during translation.",
          };
          return prev;
        });
      }
    } else {
      setMessages((prevMessages) => {
        return [
          ...prevMessages,
          {
            sender: "ai",
            action: "displayError",
            msg: "Sorry, this feature is not supported on your browser.",
          },
        ];
      });
    }
  };

  //Trigger summarizer model
  const summarizeTxtHandler = async (e) => {
    e.preventDefault();
    if ("Summarizer" in self) {
      setMessages((prevMessages) => {
        return [...prevMessages, { sender: "ai", action: "summarizerload" }];
      });

      try {
        const summarizer = await Summarizer.create({
          format: "plain-text",
        });
        const summary = await summarizer.summarize(inputTxt);

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
        if (error.message.includes("The GPU is blocked")) {
          setMessages((prevMessages) => {
            const prev = [...prevMessages];
            prev[prev.length - 1] = {
              sender: "ai",
              action: "displayError",
              msg: "Sorry, your device doesn't meet the requirements to run the summarize model.",
            };
            return prev;
          });
        } else {
          setMessages((prevMessages) => {
            const prev = [...prevMessages];
            prev[prev.length - 1] = {
              sender: "ai",
              action: "displayError",
              msg: "Something went wrong while creating the summary.",
            };
            return prev;
          });
        }
      }
    } else {
      setMessages((prevMessages) => {
        return [
          ...prevMessages,
          {
            sender: "ai",
            action: "displayError",
            msg: "Sorry, this feature is not supported on your browser.",
          },
        ];
      });
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
          {toTranslate && (
            <button
              tabIndex={0}
              aria-label="translate button"
              className="translate-btn"
              disabled={lastMsgAction === "load" ? true : false}
              aria-disabled={lastMsgAction === "load" ? true : false}
              title={`${
                lastMsgAction === "load"
                  ? "disabled"
                  : "translate your text to selected language"
              }`}
              onClick={translateTxtHandler}
            >
              Translate <i className="fa fa-exchange" aria-hidden="true"></i>
            </button>
          )}
          {toSummarize && (
            <button
              tabIndex={0}
              aria-label="summarize button"
              className="summarize-btn"
              disabled={lastMsgAction === "load" || "summarizerload"  ? true : false}
              aria-disabled={lastMsgAction === "load" || "summarizerload" ? true : false}
              title={`${
                lastMsgAction === "load" || "summarizerload" ? "disabled" : "summarize your text"
              }`}
              onClick={summarizeTxtHandler}
            >
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
