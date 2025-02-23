import platform from "platform";
import {useEffect,useRef } from "react";
import "./TextInput.css";

//Check platform and disable submission by enter key on mobile.
const isMobile = platform.os ? /Android|iOS/i.test(platform.os.family) : false;
const TextInput = ({isIntro,messages,setMessages}) => {
  const inputRef = useRef(null);
  const disabledState =  messages.length > 0 && (messages[messages.length-1].action === "load" || messages[messages.length-1].action === "summarizerload") ? true : false;


  const submissionHandler = (e) => {
    if(e) e.preventDefault()


    if(disabledState) return;

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
            setMessages((prevMessages) => {
              return [...prevMessages, { sender: "user", text}];
            });
    } 
  };


  // Allow submission with Enter key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isMobile && e.key === "Enter" && e.shiftKey !== true) {
        e.preventDefault(); 
        submissionHandler();
      }
    };
  
    window.addEventListener("keyup", handleKeyDown);
  
    return () => {
      window.removeEventListener("keyup", handleKeyDown); 
    };
  }, [disabledState]);
  

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
        />
        <button  tabIndex={0} disabled={disabledState} aria-disabled={disabledState} aria-label="Submit text" type="submit" name="submit-btn" id="submit-btn">
          <i className="fa fa-paper-plane" aria-hidden="true"></i>
        </button>
      </form>
    </>
  );
};

export default TextInput;
