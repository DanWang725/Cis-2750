import { useState, useEffect } from 'react';

const InputField = ({
  name,
  validification,
  inputValue,
  displayName,
  type,
  onInputValueChange,
  styling,
}) => {
  // const [value, setValue] = useState({type==="number" ? 0 : ''});
  const [validationMessage, setValidationMessage] = useState('');

  useEffect(() => {
    const timeout = setTimeout(() => {
      const message = validification(inputValue[name]);
      setValidationMessage(message);
    }, 500);
    return () => {
      clearTimeout(timeout);
    };
  }, [inputValue[name]]);

  return (
    <div className={styling}>
      <label>{displayName}</label>
      <input
        type={type}
        name={name}
        value={inputValue[name]}
        onChange={(e) => {
          const val =
            type === 'number' ? parseInt(e.target.value) : e.target.value;
          onInputValueChange(e.target.name, val);
        }}
      />
      <label className="input-error-message">{validationMessage || ''}</label>
    </div>
  );
};

export default InputField;
