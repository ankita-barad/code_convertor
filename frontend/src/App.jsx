import { useState } from "react";

import "./App.css";

const API_URL = import.meta.env.API_URL || "http://localhost:3300";

function App() {
  const [language, setLanguage] = useState("python");
  const [sourceCode, setSourceCode] = useState("");
  const [output, setOutput] = useState(null);
  const [explanation, setExplanation] = useState(null);
  const [quality, setQuality] = useState(null);

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  const handleSourceCodeChange = (event) => {
    setSourceCode(event.target.value);
  };

  const handleCheckQuality = async () => {
    setOutput(null);
    setQuality(null);
    setExplanation(null);

    try {
      const response = await fetch(`${API_URL}/api/code-quality`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sourceCode: sourceCode,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setExplanation(data.explanation);
      }
    } catch (error) {
      console.error("Error occurred during conversion:", error);
    }
  };

  const handleDebugCode = async () => {
    setOutput(null);
    setQuality(null);
    setExplanation(null);
    try {
      const response = await fetch(`${API_URL}/api/debug`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sourceCode: sourceCode,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setOutput(data.code);
        setExplanation(data.explanation);
      }
    } catch (error) {
      console.error("Error occurred during conversion:", error);
    }
  };
  const handleConvert = async () => {
    setOutput(null);
    setQuality(null);
    setExplanation(null);
    try {
      const response = await fetch(`${API_URL}/api/convert`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          targetLanguage: language,
          code: sourceCode,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setOutput(data.code);
      }
    } catch (error) {
      console.error("Error occurred during conversion:", error);
    }
  };

  return (
    <div>
      <h1 id="heading">Code Convertor</h1>
      <div className="App">
        <div className="left-panel">
          <h1>Code Editor</h1>
          <label htmlFor="languageSelect">Select a Language:</label>
          <select
            id="languageSelect"
            value={language}
            onChange={handleLanguageChange}
          >
            <option value="python">Python</option>
            <option value="javascript">JavaScript</option>
            <option value="java">Java</option>
          </select>
          <textarea
            id="sourceCode"
            placeholder={`Enter ${language} code here...`}
            value={sourceCode}
            onChange={handleSourceCodeChange}
          />
          <button onClick={handleConvert}>Convert</button>
          <button onClick={handleCheckQuality}>Check Code Quality</button>
          <button onClick={handleDebugCode}>Debug Code</button>
        </div>
        <div className="right-panel">
          <h1>Output</h1>
          <div id="outputDiv">
            {explanation && (
              <div className="explanation-code">
                {explanation.split("\n").map((sentence, index) => {
                  return <p key={index}>{sentence}</p>;
                })}
              </div>
            )}
            {quality && (
              <div
                dangerouslySetInnerHTML={{ __html: quality }}
                className="quality-code"
              />
            )}
            {output && <pre className="output-code">{output}</pre>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
