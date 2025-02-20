import { useRef,useState,useEffect } from "react"
import Navbvar from "../UI/Navbar/Navbar"
import TextInput from "../UI/TextInput/TextInput"
import "./Intro.css"

const Intro = ({messages, setMessages}) =>{
    const textRef = useRef(null);
    const [cursorState, setCursorState] = useState("");
    class TypeWriter{
         constructor(textElem, greetings, wait){
             this.txtElement = textElem
             this.greetings = greetings;
             this.txt = "";
             this.wait = parseInt(wait, 10);
             this.greetingsIndex = 0;
             this.isDeleting = false
         }
    }

    TypeWriter.prototype.type = function () {
        setCursorState("static-cursor")
        const current = this.greetingsIndex % this.greetings.length
        const fullTxt = this.greetings[current];
        
        if (this.isDeleting) {
          this.txt = fullTxt.substring(0, this.txt.length - 1)
        } else {
          this.txt = fullTxt.substring(0, this.txt.length + 1)
        }
      
        this.txtElement.textContent = this.txt;
      
        let typeSpeed = 100;
        if (this.isDeleting) {
        typeSpeed /= 2
        }
      
        if (!this.isDeleting && this.txt === fullTxt) {
          typeSpeed = this.wait;
          setCursorState("blinking-cursor");
          this.isDeleting = true
        } else if (this.isDeleting && this.txt === "") {
          typeSpeed = 500;
          setCursorState("blinking-cursor__xtra")
          this.isDeleting = false;
          this.greetingsIndex++
        }
      
        setTimeout(() => this.type(), typeSpeed)
      }
      
    const wait = 3000;
    const greetings = ["Welcome to Textify","Bem-vindo ao Textify","Bienvenido a Textificar","Добро пожаловать в Textify","Textify'a hoş geldiniz","Bienvenue sur Textify"];

     useEffect(()=>{
        const typeWriter = new TypeWriter(textRef.current,greetings,wait);
        typeWriter.type()
     },[])

   return(
    <div id="intro-container">
      <Navbvar messages={messages} setMessages={setMessages}/>
          <h2><span className="txt-type">
          <span className={`${cursorState}`}></span>
          <span ref={textRef} className="txt"></span>
        </span>
      </h2>
        <TextInput isIntro={true} setMessages={setMessages}/>
    </div>
   )
}
export default Intro