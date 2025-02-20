import "./Navbvar.css";

const Navbvar = ({messages, setMessages}) =>{
    const createNewChatHandler = () =>{
        localStorage.removeItem("detectedLangs");
        setMessages([])
    }

    return(
        <>
        <div id="nav-container">
            <div id="navtools">
                {/* <button title="view menu" id="side-panel-btn"><i className="fa fa-bars" aria-hidden="true"></i></button> */}
                <button disabled={messages.length === 0 ? true : false} title="new chat" id="new-chat-btn" onClick={createNewChatHandler}><i className="fa fa-pencil-square-o" aria-hidden="true"></i></button>
                <h2 id="app-logo">Textify</h2>
            </div>
        </div>
        </>
    )
}

export default Navbvar