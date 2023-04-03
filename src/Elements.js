import {useState, useEffect} from 'React'
export function ElementList(props){
    let [elements, setElement] = useState(null);
  
    const refresh = () => {
      fetch("../test.json")
        .then((response) => response.json())
        .then((data) => setElement(data))
        .catch((err) => console.error(err))
    }
    const refreshAddElement = () => {
      fetch("../addtest.json")
        .then((response) => response.json())
        .then((data) => setElement(data))
        .catch((err) => console.error(err))
    }
  
    const testMoleculeGet = () =>{
      fetch("../gettest.json", {method:"POST", 
      headers: {"Content-type": "application/json"},
      body: JSON.stringify({'id':'1', 'name':'Water'})
      })
      .then((response) => console.log(response))
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
      <div className='ContactList Page-content'>
        <p>Loading elements....</p>
      </div>)
    }
  
    return (
      <div className='ContactList Page-content'>
        <h1>Elements</h1>
        {elements.map((element, i) => (
          <Element {...element} key={i} testDataThing={FetchDeleteElement}/>
        ))}
        <button onClick={refresh}>Refresh</button>
        <button onClick={refreshAddElement}>Add Dez Nuts</button>
        <button onClick={testMoleculeGet}>Test Get Molecule</button>
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
          Color: {props.colour} Radius: {props.radius}
        </span>
      </div>
      <button className='Element-actions' onClick={()=>props.testDataThing(props.code)}>X</button>
    </div>
    );
}


function ElementForm(props){
    let [data, setData] = useState({code:'', name:'', colour:'', radius:0})
    
    const SendData = () =>{
      console.log(data)
      fetch("../upload/element.json", {method:"POST", 
      headers: {"Content-type": "application/json"},
      body: JSON.stringify(data)
      })
      .then((response) => props.onDataAddition())
      .then(()=>setData({code:'', name:'', colour:'', radius:0}))
      .catch((err) => console.error(err))
    }
  
    const DeleteData = () =>{
      console.log(data)
      fetch("../element.json", {method:"DELETE", 
      headers: {"Content-type": "text"},
      body: data.code
      })
      .then((response) => console.log(response))
      .catch((err) => console.error(err))
    }
  
    let handleChange = (name, value)=> {
      setData((data)=> {
        return({
          ...data,
          [name]: value
        });
      });
    }
  
  
    let elements = (<div>
      <ElementInputForm type="text" name="code" inputValue={data} onInputValueChange={handleChange}/>
      <ElementInputForm type="text" name="name" inputValue={data} onInputValueChange={handleChange}/>
      <ElementInputForm type="text" name="colour" inputValue={data} onInputValueChange={handleChange}/>
      <ElementInputForm type="number" name="radius" inputValue={data} onInputValueChange={handleChange}/>
      </div>)
    return (<div>
        <form>
          {elements}
        </form>
        <button onClick={SendData}>Add Element</button>
        <button onClick={DeleteData}>Delete Element</button>
      </div>
    )
    
  }
  function ElementInputForm(props){
    return (<label>{props.name}
      <input type={props.type}
        name={props.name}
        value={props.inputValue[props.name]} 
        onChange={(e)=>{
          let val = props.type==="number" ? parseInt(e.target.value, 10) : e.target.value;
          props.onInputValueChange(e.target.name, val)
        }}></input>
    </label>);
  }