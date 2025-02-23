import { useRef, useState, useEffect } from "react";
import Intro from "../Intro/Intro";
import Navbvar from "../UI/Navbar/Navbar";
import TextInput from "../UI/TextInput/TextInput";
import UserOutputTxt from "../Outputs/UserOutputTxt/UserOutputTxt";
import AIOutputTxt from "../Outputs/AIOutputTxt/AIOutputTxt";
import "./ChatSpace.css";

const ChatSpace = () => {
  const outputEndRef = useRef(null);
  const [messages, setMessages] = useState( localStorage.getItem("messages") ? JSON.parse(localStorage.getItem("messages")) : []);
  let userMsgIndex = 0;

  // Scroll to bottom of messages on load.
  useEffect(() => {
    const onLoadHandler = () => {
        outputEndRef.current?.scrollIntoView({ behavior: "smooth" });
        if(messages.length !== 0 && (messages[messages.length -1].action === "load" || messages[messages.length -1].action === "summarizerload" )){
          setMessages((prevMessages)=>{
            const prev = prevMessages.slice(0,prevMessages.length - 1);
            return prev
          })
        }
    };
  
    window.addEventListener("load", onLoadHandler);
  
    return () => {
      window.removeEventListener("load", onLoadHandler); 
    };
  }, []);

//Scrolls to the bottom of the chats for every update in the chat messages.
  useEffect(()=>{ 
    const lastMsg = messages[messages.length - 1];
    if(lastMsg && (lastMsg.action !== "translate" && lastMsg.action !== "summarize" )){
      outputEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  
    localStorage.setItem("messages", JSON.stringify(messages));
  },[messages]);



  //Chat renders
  if(messages.length === 0) return <Intro messages={messages} setMessages={setMessages}/>
       
  return(
    <>
     <Navbvar messages={messages} setMessages={setMessages}/>
    <div className="chatbox">
      {messages.map((msg, index,array) => (msg.sender ==="user" ? <UserOutputTxt key={index} index={userMsgIndex++} inputTxt={msg.text} messages={array} setMessages={setMessages}/>:<AIOutputTxt  key={index} action={msg.action} originalTxt={msg.originalTxt} modifiedTxt={msg.modifiedTxt} sourceFullName={msg. sourceFullName} targetFullName={msg.targetFullName} msg={msg.msg} setMessages={setMessages}/>)
    )}
    <div style={{marginTop:"2rem"}} ref={outputEndRef}/>
    </div>
       <TextInput isIntro={false} messages={messages} setMessages={setMessages}/>
     </>
  )
};

export default ChatSpace;
