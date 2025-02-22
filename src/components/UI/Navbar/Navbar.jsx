import "./Navbvar.css";

const Navbvar = ({messages, setMessages}) =>{
    const createNewChatHandler = () =>{
        if(localStorage.getItem("timeOutsAndIntervals")){
            const timeOutsAndIntervals = JSON.parse(localStorage.getItem("timeOutsAndIntervals"));
            timeOutsAndIntervals.forEach(each => {
                clearInterval(each);
                clearTimeout(each)
            })
        }
        localStorage.removeItem("detectedLangs");
        localStorage.removeItem("messages");
        setMessages([]);
    }

    return(
        <>
        <div id="nav-container">
            <div id="navtools">
                <button tabIndex={0} aria-label="Create new chat" disabled={messages.length === 0 ? true : false} title="new chat" id="new-chat-btn" onClick={createNewChatHandler}><i className="fa fa-pencil-square-o" aria-hidden="true"></i></button>
                <h2 id="app-logo">Textify</h2>
            </div>
        </div>
        </>
    )
}

export default Navbvar