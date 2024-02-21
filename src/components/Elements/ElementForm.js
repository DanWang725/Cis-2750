import { useState, useEffect } from 'react';
import InputField from './ElementInputForm';
import PropTypes from 'prop-types';

const ElementForm = ({ onDataAddition }) => {
  const defaults = {
    code: '',
    name: '',
    colour1: '',
    colour2: '',
    colour3: '',
    radius: 0,
  };
  const [data, setData] = useState(defaults);
  const [errormessage, setErrormessage] = useState('');

  const validateAllData = () => {
    if (validateCode(data.code) !== '') {
      return false;
    }
    if (validateName(data.name) !== '') {
      return false;
    }
    if (validateColour(data.colour1) !== '') {
      return false;
    }
    if (validateColour(data.colour2) !== '') {
      return false;
    }
    if (validateColour(data.colour3) !== '') {
      return false;
    }
    if (validateRadius(data.radius) !== '') {
      return false;
    }
    return true;
  };

  const validateAllDataEmpties = () => {
    if (
      data.code === '' ||
      data.name === '' ||
      data.radius < Number(0) ||
      data.colour1.length !== 6 ||
      data.colour2.length !== 6 ||
      data.colour3.length !== 6
    ) {
      return false;
    }
    return true;
  };

  const SendData = () => {
    console.log(data);
    if (!validateAllData() || !validateAllDataEmpties()) {
      return;
    }
    fetch('../upload/element.json', {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify(data),
    })
      .then((response) => onDataAddition())
      .then(() => setData(defaults))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!validateAllDataEmpties()) {
        setErrormessage('Some fields are not filled in correctly');
      } else if (!validateAllData()) {
        setErrormessage('Form contains invalid data');
      } else {
        setErrormessage('');
      }
    }, 500);
    return () => {
      clearTimeout(timeout);
    };
  }, [data]);

  // const DeleteData = () =>{
  //   console.log(data)
  //   fetch("../element.json", {method:"DELETE",
  //   headers: {"Content-type": "text"},
  //   body: data.code
  //   })
  //   .then((response) => console.log(response))
  //   .catch((err) => console.error(err))
  // }

  const handleChange = (name, value) => {
    setData((data) => ({
      ...data,
      [name]: value,
    }));
  };

  const validateCode = (val) => {
    if ((!/^[a-zA-Z]+$/.test(val) && val.length > 0) || val.length > 2) {
      return 'Element code must be 2 alphabetical characters in length';
    }
    return '';
  };

  const validateName = (val) => {
    if ((!/^[a-zA-Z]+$/.test(val) && val.length > 0) || val.length > 20) {
      return 'Element name can only contain max 20 characters';
    }
    return '';
  };
  const validateColour = (val) => {
    if ((!/^[A-F0-9]+$/.test(val) && val.length > 0) || val.length > 6) {
      return 'Colour must be in hex form';
    }
    return '';
  };
  const validateRadius = (val) => {
    if ((!/^[0-9]+$/.test(val) && val.length > 0) || val.length > 6) {
      return 'Radius must be a number';
    }
    return '';
  };

  const elements = (
    <div>
      <div className="display-inline element-input-form-divs">
        <InputField
          styling="input-form-small input-form element-input-form"
          type="text"
          name="code"
          displayName="Element Code"
          inputValue={data}
          onInputValueChange={handleChange}
          validification={validateCode}
        />
        <InputField
          styling="input-form element-input-form"
          type="text"
          name="name"
          displayName="Element Name"
          inputValue={data}
          onInputValueChange={handleChange}
          validification={validateName}
        />
        <InputField
          styling="input-form  element-input-form"
          type="number"
          name="radius"
          displayName="Element Radius"
          inputValue={data}
          onInputValueChange={handleChange}
          validification={validateRadius}
        />
      </div>
      <div className="display-inline element-input-form-divs">
        <InputField
          styling="input-form-stacked element-input-form"
          type="text"
          name="colour1"
          displayName="Colour 1"
          inputValue={data}
          onInputValueChange={handleChange}
          validification={validateColour}
        />
        <InputField
          styling="input-form-stacked element-input-form"
          type="text"
          name="colour2"
          displayName="Colour 2"
          inputValue={data}
          onInputValueChange={handleChange}
          validification={validateColour}
        />
        <InputField
          styling="input-form-stacked element-input-form"
          type="text"
          name="colour3"
          displayName="Colour 3"
          inputValue={data}
          onInputValueChange={handleChange}
          validification={validateColour}
        />
      </div>
    </div>
  );
  return (
    <div>
      <p className="molecule-info-title">Add Element</p>
      <form>{elements}</form>
      <button
        className="MoleculeCard-action"
        onClick={SendData}
        disabled={errormessage}
      >
        Add Element
      </button>
      <label className="input-error-message">{errormessage}</label>
    </div>
  );
};
ElementForm.propTypes = {
  onDataAddition: PropTypes.func,
};

export default ElementForm;
