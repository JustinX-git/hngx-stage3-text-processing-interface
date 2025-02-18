import "./AIOutputTxt.css";

const AIOutputTxt = ({inputTxt}) =>{
    return(
        <>
        <div id="AI-output">
            <h3>Original</h3>
            <p>{inputTxt}</p>
            <h3>Translation/Summary</h3>
        </div>
        </>
    )
}

export default AIOutputTxt