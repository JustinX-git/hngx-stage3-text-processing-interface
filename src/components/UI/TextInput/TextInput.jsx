import { useState, useRef } from "react";
import "./TextInput.css";

const TextInput = ({isIntro, setMessages}) => {
  const inputRef = useRef(null);
  const [disabledState, setDisabledState] = useState(true)

  //Events
  const onChangeHandler = (e) =>{
    if((e.target.value).trim() === "") setDisabledState(true)
      else setDisabledState(false)
  }

  const submissionHandler = (e) => {
    e.preventDefault();
    const text = (inputRef.current.value).trim();
    inputRef.current.value = "";
    setDisabledState(true)
    setMessages((prevMessages) => {
      return [...prevMessages, { sender: "user", text}];
    });
  };

  return (
    <>
      <form
        onSubmit={submissionHandler}
        name="user-input-wrapper"
        id={`${isIntro ? "intro-user-input-wrapper":"user-input-wrapper"}`}
      >
        <textarea
          ref={inputRef}
          placeholder="Enter text to process"
          tabIndex={0}
          name="user-input"
          id="user-input"
          className= "user-input"
          onChange={onChangeHandler}
        />
        <button disabled={disabledState} type="submit" name="submit-btn" id="submit-btn">
          <i className="fa fa-paper-plane" aria-hidden="true"></i>
        </button>
      </form>
    </>
  );
};

export default TextInput;
