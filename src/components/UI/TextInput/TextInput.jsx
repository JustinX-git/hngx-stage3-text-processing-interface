import { useRef } from "react";
import "./TextInput.css";

const TextInput = ({setMessages}) => {
  const inputRef = useRef(null);

  const submissionHandler = (e) => {
    e.preventDefault();
    const text = inputRef.current.value;
    inputRef.current.value = "";
    setMessages((prevMessages) => {
      return [...prevMessages, { sender: "user", text}];
    });
  };

  return (
    <>
      <form
        onSubmit={submissionHandler}
        name="user-input-wrapper"
        id="user-input-wrapper"
      >
        <textarea
          ref={inputRef}
          placeholder="Enter text to process"
          tabIndex={0}
          name="user-input"
          id="user-input"
          className="user-input"
        />
        <button type="submit" name="submit-btn" id="submit-btn">
          <i className="fa fa-paper-plane" aria-hidden="true"></i>
        </button>
      </form>
    </>
  );
};

export default TextInput;
