import React, { useState } from 'react';
import Spinner from './Spinner';
import './App.css';
import './Button.css';

function App() {
  
  const [code, setCode] = useState('');
  const [zipFile, setZipFile] = useState(null);
  const [spinner, setSpinner] = useState(false);

  const parseCode = async () => {

    setSpinner(true);

    try {
      const response = await fetch('http://localhost:3001/generate-tests', {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: code,
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch coverage data: ${response.status} ${response.statusText}`);
      }

      const data = await response.blob();
      console.log('Received ZIP file:', data);

      setZipFile(data);

      setSpinner(false);

    } catch (error) {
      console.error('Error parsing code:', error.message);
    }
  };

  const downloadReport = () => {

    if (zipFile) {
      
      const blob = new Blob([zipFile], { type: 'application/zip' });

      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;

      link.download = 'coverage-report.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="App">

      <h1>Code Coverage Tool</h1>

      {zipFile && (
        <div>
          <h2>Your Code Coverage Report is Ready!</h2>
          <p>Download the coverage report:</p>
          <button class="btn" onClick={downloadReport}>Download Report</button>
        </div>
      )}

      <p>Paste Your Code Here!</p>

      {
        spinner && (

          <Spinner/>
        )
      }

      <textarea className='text-box' required = {true}
        rows={35}
        cols={100}
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      <br /> <br />

      <button class="btn" onClick={parseCode}> Submit Code </button>
      
    </div>
  );
}

export default App;
