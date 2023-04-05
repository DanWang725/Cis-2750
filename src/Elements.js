import {useState, useEffect} from 'React'
export function ElementList(props){
    let [elements, setElement] = useState(null);
  
    const refresh = () => {
      fetch("../test.json")
        .then((response) => response.json())
        .then((data) => setElement(data))
        .then((data) => console.log(data))
        .catch((err) => console.error(err))
    }
  
    const FetchDeleteElement = (code) => {
      console.log(code)
      fetch("../element.json", {method:"DELETE", 
      headers: {"Content-type": "text"},
      body: code
      })
      .then((response) => {console.log(response);
        refresh();
      })
      .catch((err) => console.error(err))
    }
  
    useEffect(() =>{
      refresh()
    }, [])
  
    if(!elements){
      return (
      <div className='ContactList middle-margins content-page'>
        <p>Loading elements....</p>
      </div>)
    }
  
    return (
      <div className='ContactList middle-margins content-page'>
        <h1>Elements</h1>
        {elements.map((element, i) => (
          <Element {...element} key={i} testDataThing={FetchDeleteElement}/>
        ))}
        <button onClick={refresh}>Refresh</button>
        <ElementForm onDataAddition={refresh}></ElementForm>
      </div>
    )
  }


export function Element(props){
    return (
    <div className='Element' key={props.i}>
      <div className='ElementCode'>
        {props.code}
      </div>
      <div className='ElementTextBox'>
        <span className='ElementName'>
          {props.name}
        </span>
        <span className='ElementInfo'>
          Radius: {props.radius}
        </span>
        
      </div>
      <div className='Element-colour-list'>
        <div className='colour-symbol-pair'>
          <p>Colour 1: {props.colour1}</p>
          <span className='small-square' style={{backgroundColor: '#'+(props.colour1)}}></span>
        </div>
        <div className='colour-symbol-pair'>
          <p>Colour 2: {props.colour2}</p>
          <span className='small-square' style={{backgroundColor: '#'+(props.colour2)}}></span>
        </div>
        <div className='colour-symbol-pair'>
          <p>Colour 3: {props.colour3}</p>
          <span className='small-square' style={{backgroundColor: '#'+(props.colour3)}}></span>
        </div>
      </div>
      <button className='Element-actions' onClick={()=>props.testDataThing(props.code)}>X</button>
    </div>
    );
}


function ElementForm(props){
  const defaults = {code:'', name:'', colour1:'', colour2:'', colour3:'', radius:0}
  let [data, setData] = useState(defaults)
  let [errormessage, setErrormessage] = useState('');
    
  const validateAllData = () =>{
    if(validateCode(data.code) !== ''){
      return false;
    }
    if(validateName(data.name) !== ''){
      return false;
    }
    if(validateColour(data.colour1) !== ''){
      return false;
    }
    if(validateColour(data.colour2) !== ''){
      return false;
    }
    if(validateColour(data.colour3) !== ''){
      return false;
    }
    if(validateRadius(data.radius) !== ''){
      return false;
    }
    return true;
  }

  const SendData = () =>{
    console.log(data)
    if(!validateAllData()){
      return;
    }
    fetch("../upload/element.json", {method:"POST", 
    headers: {"Content-type": "application/json"},
    body: JSON.stringify(data)
    })
    .then((response) => props.onDataAddition())
    .then(()=>setData(defaults))
    .then(()=>print())
    .catch((err) => console.error(err))
  }

  useEffect(() => {
    let timeout = setTimeout(() => {
      if(!validateAllData()){
        setErrormessage("Form contains invalid data")
      } else {
        setErrormessage('')
      }
    }, 500)
    return () => {
      clearTimeout(timeout)
    }
  }, [data])
  
    // const DeleteData = () =>{
    //   console.log(data)
    //   fetch("../element.json", {method:"DELETE", 
    //   headers: {"Content-type": "text"},
    //   body: data.code
    //   })
    //   .then((response) => console.log(response))
    //   .catch((err) => console.error(err))
    // }
  
    let handleChange = (name, value)=> {
      setData((data)=> {
        return({
          ...data,
          [name]: value
        });
      });
    }

    const validateCode = (val) =>{
      if((! /^[a-zA-Z]+$/.test(val) && val.length > 0) || val.length > 2){
        return "Element code must be 2 alphabetical characters in length";
      }
      return ''
    }
    
    const validateName = (val) =>{
      if((! /^[a-zA-Z]+$/.test(val) && val.length > 0) || val.length > 20){
        return "Element name can only contain max 20 characters";
      }
      return ''
    }
    const validateColour = (val) =>{
      if((! /^[A-F0-9]+$/.test(val) && val.length > 0) || val.length > 6){
        return "Colour must be in hex form";
      }
      return ''
    }
    const validateRadius = (val) =>{
      if((! /^[0-9]+$/.test(val) && val.length > 0) || val.length > 6){
        return "Radius must be a number";
      }
      return ''
    }

    let elements = (<div>
      <div className='display-inline element-input-form-divs'>
      <ElementInputForm styling='input-form-small input-form element-input-form' type="text" name="code" inputValue={data} onInputValueChange={handleChange} validification={validateCode}/>
      <ElementInputForm styling='input-form element-input-form' type="text" name="name" inputValue={data} onInputValueChange={handleChange} validification={validateName}/>
      <ElementInputForm styling='input-form  element-input-form' type="number" name="radius" inputValue={data} onInputValueChange={handleChange} validification={validateRadius}/>
      </div>
      <div className='display-inline element-input-form-divs'>
        <ElementInputForm styling='input-form-stacked element-input-form' type="text" name="colour1" inputValue={data} onInputValueChange={handleChange} validification={validateColour}/>
        <ElementInputForm styling='input-form-stacked element-input-form'type="text" name="colour2" inputValue={data} onInputValueChange={handleChange} validification={validateColour}/>
        <ElementInputForm styling='input-form-stacked element-input-form' type="text" name="colour3" inputValue={data} onInputValueChange={handleChange} validification={validateColour}/>
      </div>
      </div>)
    return (<div>
        <h1>Add Element</h1>
        <form>
          {elements}
        </form>
        <button onClick={SendData} disabled={errormessage}>Add Element</button>
        <label>{errormessage}</label>
      </div>
    )
    
  }
  function ElementInputForm(props){
    //const [value, setValue] = useState({props.type==="number" ? 0 : ''});
    const [validationMessage, setValidationMessage] = useState('');


    useEffect(() => {
      let timeout = setTimeout(() => {
        let message = props.validification(props.inputValue[props.name])
        setValidationMessage(message)
      }, 500)
      return () => {
        clearTimeout(timeout)
      }
    }, [props.inputValue[props.name]])

    return (
      <div className={props.styling}>
        <label>{props.name}</label>
        <input type={props.type}
          name={props.name}
          value={props.inputValue[props.name]} 
          onChange={(e)=>{
          let val = props.type==="number" ? parseInt(e.target.value) : e.target.value;
          props.onInputValueChange(e.target.name, val)
        }}></input>
        <label className='input-error-message'>{validationMessage || ''}</label>

    </div>);
  }