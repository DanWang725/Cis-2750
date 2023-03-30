import{ billionaires } from './billionaires'
import { useState, useEffect} from 'React';
//import ReactDOM from "https://cdn.skypack.dev/react-dom";
/*
function ContactList(props){
  return (
    <div className='ContactList'>
      <h1 className='ContactList-title'>Contacts</h1>
      {props.children}
    </div>
  );
}
function FetchTest(){
  
}*/

function Refresh(){
  ReactDOM.render(
    <App/>,
    document.getElementById('root')
  );
}


function ElementForm(props){
  let [data, setData] = useState({code:0, name:'', colour:'', radius:0})
  
  const SendData = () =>{
    console.log(data)
  }

  let handleChange = (evt)=> {
    const value = evt.target.value;
    setData((data)=> {
      return({
        ...data,
        [evt.target.name]: value
      });
    });
  }


  let elements = (<div>
    <ElementInputForm type="number" name="code" inputValue={data.code} onInputValueChange={handleChange}/>
    <ElementInputForm type="text" name="name" inputValue={data.name} onInputValueChange={handleChange}/>
    <ElementInputForm type="text" name="colour" inputValue={data.colour} onInputValueChange={handleChange}/>
    <ElementInputForm type="number" name="radius" inputValue={data.radius} onInputValueChange={handleChange}/>
    </div>)
  return (<div>
      <form>
        {elements}
      </form>
      <button onClick={SendData}>Add Element</button>
    </div>)
  
  
}
function ElementInputForm(props){
  return (<label>{props.name}
    <input type={props.type} name={props.name} value={props.inputValue} onChange={(e)=>{props.onInputValueChange(e)}}></input>
  </label>);
}

function ElementList(props){
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

  useEffect(() =>{
    refresh()
  }, [])

  if(!elements){
    return (
    <div className='ContactList'>
      <p>Loading elements....</p>
    </div>)
  }

  return (
    <div className='ContactList'>
      <h1>Elements</h1>
      {elements.map((element, i) => (
        <Element {...element} key={i}/>
      ))}
      <button onClick={refresh}>Refresh</button>
      <button onClick={refreshAddElement}>Add Dez Nuts</button>
      <button onClick={testMoleculeGet}>Test Get Molecule</button>
    </div>
  )
}
let ListOfElements = [
  { code: 'C',
    name: 'Carbon',
    radius: '40',
    colour: '#f19283',
  },
  { code: 'H',
    name: 'Hydrogen',
    radius: '25',
    colour: '#amogus',
  }
]
function Element(props){
  return (
  <div className='Element' key={props.i}>
    <div className='ElementCode'>
      {props.code}
    </div>
    <span className='ElementName'>
      {props.name}
    </span>
    <span className='ElementInfo'>
      Color: {props.colour} Radius: {props.radius}
      </span>
  </div>
  );
}

/*function Molecule(props){
  return ()
}*/
/*
function Contact(props){
  let names = props.name.split(' ')
  let initials = names.map(name => name[0].toUpperCase()).join('')
  let photo
  if("photoURL" in props){
    photo = <img src={props.photoURL}/>
  }
  return (
    <div className='Contact' key={props.i}>
      <div className='Contact-avatar'>
        {initials}
        {photo}
      </div>
      <span className='Contact-name'>
        {props.name}
      </span>
      <a href={props.email}>
        {props.email}
      </a>
    </div>
  );
}*/

function App(props) {
  return ( 
    <div>
    <ElementList> </ElementList>
    <ElementForm></ElementForm>
    </div>
  );
}


// Use a for loop or array.map to build the elements array
let updatedContacts = billionaires;
ReactDOM.render(
  <App/>,
  document.getElementById('root')
)