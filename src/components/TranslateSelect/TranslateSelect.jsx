import { useState } from "react";
import TranslateOption from "../TranslateOption/TranslateOption";
import "./TranslateSelect.css";

const TranslateSelect = ({lang,setLang}) => {
  const options = [
    ["English", "en"],
    ["Portuguese", "pt"],
    ["Spanish", "es"],
    ["Russian", "ru"],
    ["Turkish", "tr"],
    ["French", "fr"],
  ];
  const [selected, setSelected] = useState(true);


  return (
    <>
     <div className="select-container">
     <h5 id="select-label">Translate to:</h5>
      <div id="options-wrapper" className={`${selected ? "" : "reveal"}`}>
        <h3
          onClick={() => {
            setSelected(selected === true ? false : true);
          }}
          id="selected"
        >
          {lang.long}
        </h3>
        <ul id="translate-options" className={`${selected ? "" : "reveal"}`}>
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
