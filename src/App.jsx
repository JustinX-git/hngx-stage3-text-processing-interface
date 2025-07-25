import platform from "platform";
import { useState, useEffect } from "react";
import ChatSpace from "./components/ChatSpace/ChatSpace";
import "./App.css";

const App = () => {
  const isMobile = platform.os
    ? /Android|iOS/i.test(platform.os.family)
    : false;
  const [errorState, setErrorState] = useState({ isErr: false, msg: "" });
  const [detectorState, setDetectorState] = useState({
    modelState: "unavailable",
    downloaded: 0,
  });
  const [summarizerState, setSummarizerState] = useState({
    modelState: "unavailable",
    downloaded: 0,
  });

  // Check and download the language detector model.
  const downloadLangDetectModel = async () => {
    const availability = await LanguageDetector.availability();

    if (availability === "unavailable") {
      setErrorState({
        isErr: true,
        msg: "Your device doesn't meet the requirements to run this application.",
      });
    } else if (availability === "available") {
      setDetectorState({ modelState: "available", downloaded: 100 });
    } else {
      const detector = await LanguageDetector.create({
        monitor(m) {
          m.addEventListener("downloadprogress", (e) => {
            setDetectorState({
              modelState: "downloading",
              downloaded: (e.loaded / e.total) * 100,
            });
          });
        },
      });
      await detector.ready;
      setDetectorState({ modelState: "available", downloaded: 100 });
    }
  };

  // Check and download the summarizer model.
  const downloadSummarizerModel = async () => {
    const availability = await Summarizer.availability();

    if (availability === "available") {
      setSummarizerState({ modelState: "available", downloaded: 100 });
    } else if (canSummarize === "after-download") {
      const summarizer = await Summarizer.create(options);
      summarizer.addEventListener("downloadprogress", (e) => {
        setSummarizerState({
          modelState: "downloading",
          downloaded: (e.loaded / e.total) * 100,
        });
      });
      await summarizer.ready;
      setSummarizerState({ modelState: "available", downloaded: 100 });
    }
  };

  // The app would halt on failing to download the language detector model as this requires the least resources of the three, so a failure on this end almost certainly implies a failure on the other models. The reliance of the translator model on this API is another reason for this halting.
  useEffect(() => {
    if (isMobile) {
      setErrorState({
        isErr: true,
        msg: "Your browser does not support this application",
      });
      return;
    }

    if ("LanguageDetector" in self) {
      downloadLangDetectModel().catch(() =>
        setErrorState({
          isErr: true,
          msg: "Something went wrong while loading models.",
        })
      );
    } else {
      setErrorState({
        isErr: true,
        msg: "Your browser does not support this application",
      });
    }
  }, []);

  //Unlike the language detector model, the app would not halt on failing to download the summarize model due to how resource intensive it is.
  useEffect(() => {
    if (isMobile) {
      setErrorState({
        isErr: true,
        msg: "Your browser does not support this application",
      });
      return;
    }
    downloadSummarizerModel().catch(() =>
      setSummarizerState((prevState) => {
        return {
          ...prevState,
          modelState: "unavailable",
        };
      })
    );
  }, []);

  // Display Model load errors
  if (errorState.isErr) {
    return (
      <div className="compatibility-error-container">
        <div className="background">
          <i className="fa fa-frown-o" aria-hidden="true"></i>
        </div>
        <h2 aria-label="error message" aria-live="assertive">
          {errorState.msg}
        </h2>
      </div>
    );
  }

  // Display Model download progress.
  if (
    detectorState.modelState === "downloading" ||
    summarizerState.modelState === "downloading"
  ) {
    return (
      <div className="download-content-container">
        <h4>
          {detectorState.downloaded === 100
            ? "Loaded detector model!"
            : `Downloading detector model: ${detectorState.downloaded}%`}
        </h4>
        <h4>
          {summarizerState.downloaded === 100
            ? "Loaded summarizer model!"
            : `Downloading summarizer model: ${summarizerState.downloaded}%`}
        </h4>
      </div>
    );
  }

  // Load Chat Interface
  return detectorState.modelState === "available" ? <ChatSpace /> : null;
};

export default App;
