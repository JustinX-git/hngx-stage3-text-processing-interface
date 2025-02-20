import { useState, useEffect } from "react";

const LangDetect = ({ inputText, index,messages,setToSummarize,setToTranslate }) => {
  const [detection, setDetection] = useState("");
  let output = "";

  //Retrieve name of language from its asociated BCP 47 format.
  function getLanguageName(langCode) {
    const languageNames = new Intl.DisplayNames(["en"], { type: "language" });

    return languageNames.of(langCode) || "unknown";
  }

  const detectLang = async (detectedLangs) => {
    const detector = await self.ai.languageDetector.create();
    const results = await detector.detect(inputText);
    const { confidence, detectedLanguage } = results[0];

    if (
      // (Confidence: ${Math.round(confidence * 100)}%) 
      confidence >= 0.4 &&
      getLanguageName(detectedLanguage) !== "unknown"
    ) {
      output = `Detected Language: ${getLanguageName(
        detectedLanguage
      )}`;
    } else {
      setToTranslate(false)
      output = "Couldn't reliably detect language.";
    }

    detectedLangs.push([output, detectedLanguage]);
    localStorage.setItem("detectedLangs", JSON.stringify(detectedLangs));

     
    if (inputText.trim().length > 150 && detectedLanguage === "en") {
      setToSummarize(true);
    }
    if(getLanguageName(detectedLanguage) === "uknown"){
      setToTranslate(false)
    }
    setDetection(output);
  };


  useEffect(() => {
    const detectedLangs = JSON.parse(localStorage.getItem("detectedLangs")) || [];
  
    if ((detectedLangs[index] === undefined)) {
      detectLang(detectedLangs);
    } else {
      if (inputText.trim().length > 150 && detectedLangs[index][1] === "en") {
        setToSummarize(true);
      }
      if(getLanguageName(detectedLangs[index][1]) === "unknown"){
        setToTranslate(false)
      }
      setDetection(detectedLangs[index][0]);
    }
  }, [inputText, index]);

  return (
    <>
      <h5>
        {detection === "" ? "Loading language detect..." : detection}
      </h5>
    </>
  );
};

export default LangDetect;
