import { useState, useRef } from "react";
import "./TextInput.css";

const TextInput = ({isIntro, setMessages}) => {
  const inputRef = useRef(null);
  const [disabledState, setDisabledState] = useState(false)

  //Events
  // const onChangeHandler = (e) =>{
  //   if((e.target.value).trim() === ""){
  //     setMessages((prevMessages)=>{
  //       return [...prevMessages,{
  //        sender: "ai",
  //        action: "displayError",
  //        msg: "Please enter text to be processed."
  //      }]
  //    });
  //   } 
  //     // setDisabledState(true)
  //     // else setDisabledState(false)
  // }

  const submissionHandler = (e) => {
    e.preventDefault();
    if((inputRef.current.value).trim() === ""){
      setMessages((prevMessages)=>{
        return [...prevMessages,{
         sender: "ai",
         action: "displayError",
         msg: "Please enter text to be processed."
       }]
     });
    }else{
      const text = (inputRef.current.value).trim();
          inputRef.current.value = "";
          // setDisabledState(true)
          setMessages((prevMessages) => {
            return [...prevMessages, { sender: "user", text}];
          });
    } 
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
          name="user-input"
          id="user-input"
          className= "user-input"
          tabIndex={0}
          aria-placeholder="Enter text to process"
          aria-label="Enter text input"
          // onChange={onChangeHandler}
        />
        <button disabled={disabledState} aria-disabled={disabledState} tabIndex={0} aria-label="Submit text" type="submit" name="submit-btn" id="submit-btn">
          <i className="fa fa-paper-plane" aria-hidden="true"></i>
        </button>
      </form>
    </>
  );
};

export default TextInput;
