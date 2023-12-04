// App.js
import React, { useState } from 'react';
import './App.css';

function App() {
  const [code, setCode] = useState('');
  const [testFilePath, setTestFilePath] = useState('');

  const parseCode = async () => {
    try {
      // Send the TypeScript code to the backend
      const response = await fetch('http://localhost:3001/generate-tests', {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: code,
      });

      const data = await response.json();
      const path = data.testFilePath;
      setTestFilePath(path);
    } catch (error) {
      console.error('Error parsing code:', error.message);
      setTestFilePath('');
    }
  };

  return (
    <div className="App">
      <h1>Code Coverage Tool</h1>
      <p>Paste Your Code Here!</p>
      <textarea
        rows={35}
        cols={100}
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      <br />
      <button onClick={parseCode}>Submit</button>

      {testFilePath && (
        <div>
          <h2>Generated Jest Test Cases</h2>
          <p>Test cases are generated. You can download them using the link below:</p>
          <a href={`http://localhost:3001/${testFilePath}`} download>
            Download Test Cases
          </a>
        </div>
      )}
    </div>
  );
}

export default App;
