import { useState,useRef,useEffect } from "react";
import TranslateOption from "../TranslateOption/TranslateOption";
import "./TranslateSelect.css";

const TranslateSelect = ({toSummarize, lang,setLang}) => {
  const options = [
    ["English", "en"],
    ["Portuguese", "pt"],
    ["Spanish", "es"],
    ["Russian", "ru"],
    ["Turkish", "tr"],
    ["French", "fr"],
  ];
  const [selected, setSelected] = useState(true);
  const dropdownRef = useRef(null);

      // Closes dropdown when the user clicked outside of it.
      function outsideClickHandler(event) {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setSelected(true);
        }
      }
  useEffect(() => {
    outsideClickHandler
    document.addEventListener("mousedown", outsideClickHandler);

    return () => {
      document.removeEventListener("mousedown", outsideClickHandler);
    };
  }, []);
  


  return (
    <>
     <div  aria-label={"Select translation"} className= {`select-container${selected ? "" : " reveal"}`} tabIndex={0}>
      <div id="options-wrapper" className={`${selected ? "" : "reveal"}${toSummarize ? " shift":""}`} tabIndex={0}>
        <h3
          onClick={() => {
            setSelected(selected === true ? false : true);
          }}
          id="selected"
        >
          {lang.long}
          <i className="fa fa-chevron-down" aria-hidden="true"></i>
        </h3>
        <ul id="translate-options" className={`${selected ? "" : "reveal"}`} onClick={outsideClickHandler} ref={dropdownRef}>
          {options.map((option, index) => (
            <TranslateOption
              key={index}
              lang={option[0]}
              shortLang={option[1]}
              index={index}
              selected={selected}
              setSelected={setSelected}
              setLang={setLang}
            />
          ))}
        </ul>
      </div>
     </div>
    </>
  );
};

export default TranslateSelect;
