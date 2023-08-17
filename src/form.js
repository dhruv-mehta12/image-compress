import React, { useState } from 'react';
import * as imageConversion from 'image-conversion';
import { url } from "./backend"

const FileUploadForm = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [compressed, setCompressed] = useState(null); 
  const [status, setStatus] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (selectedFile) {
      const res = await imageConversion.compressAccurately(selectedFile, {
        size: 65,    
        accuracy: 0.9,
        type: "image/jpeg",
        scale: 0.3,
      })
      setCompressed(res)
      var fd = new FormData();
      fd.append('file', res, selectedFile.name);

      const response = await fetch(`/upload`, {method:"POST", body: fd})
      setStatus(response.status)
    } else {
      alert('Please select a file before uploading.');
    }
  };

  return (
    <div>
      <h1>File Upload Form</h1>
      <input type="file" name='file' onChange={handleFileChange} />
      <button onClick={handleFileUpload}>compress</button>
      {
        status === 200 ? <div><p>original: {selectedFile.size}B</p><br /><p>compressed: {compressed.size}B</p><br/><a href={`/get/${selectedFile.name}-compressed.jpg`}>download</a></div> : null
      }
    </div>
  );
};

export default FileUploadForm;
