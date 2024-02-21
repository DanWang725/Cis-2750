import { useState } from 'react';

const MoleculeUploadTab = ({ refreshHandler }) => {
  const [file, setFile] = useState();
  const [name, setName] = useState('');
  const [response, setResponse] = useState('');
  let fileReader;

  const handleTextInput = (val) => {
    if (!/^[a-zA-Z0-9]+$/.test(val) && val.length > 0) {
      console.log('failed');
      return;
    }
    setName(val);
  };

  function handleSubmit(event) {
    event.preventDefault();

    fileReader = new FileReader();
    fileReader.onloadend = uploadFile;
    fileReader.readAsText(file);
  }

  const uploadFile = (e) => {
    if (!file.name.endsWith('.sdf')) {
      setUploadResponse('Invalid file type selected.');
      return;
    }
    if (file.size > 100000) {
      console.log(file.size);
      setUploadResponse('File size is too large.');
      return;
    }

    const dataPackage = { data: fileReader.result, name };

    // console.log(dataPackage)
    fetch(`../molecule/${name}.sdf`, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify(dataPackage),
    })
      .then((response) => {
        if (!response.ok) {
          setUploadResponse('File was unable to be uploaded.');
        } else {
          setUploadResponse('File uploaded successfully');
          refreshHandler();
        }
      })
      .catch((err) => console.error(err));
    console.log(file);
  };

  const setUploadResponse = (val) => {
    setResponse(val);
    setTimeout(clearUploadResponse, 5000);
  };

  const clearUploadResponse = () => {
    setResponse('');
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <div>
      <p className="molecule-info-title">Upload a molecule</p>
      <form
        onSubmit={handleSubmit}
        className="input-form element-input-form inline"
      >
        <label>Molecule Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => handleTextInput(e.target.value)}
        />
        <input
          className="display-inline"
          type="file"
          onChange={handleFileChange}
          accept=".sdf"
        />
        <button
          className="MoleculeCard-action large-button"
          type="submit"
          disabled={!file || !name}
        >
          Upload
        </button>
      </form>
      <label>{!file || !name ? 'A name and file is required' : ' '}</label>
      <p>{response}</p>
    </div>
  );
};
export default MoleculeUploadTab;
