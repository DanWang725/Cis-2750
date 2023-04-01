//import{ billionaires } from './billionaires'
import { useState, useEffect, createRef} from 'React';
import { Element, ElementList } from './Elements';
//import SVG from 'React-inlinesvg';

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
  root.render(
    <App/>
  );
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

function MoleculeList(props){
  let [molecule, setMolecule] = useState([]);
  const FetchMolecules = () =>{
    fetch("../molecule.json")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setMolecule(data)})
      .catch((err) => console.error(err))
  }

  useEffect(()=> {
    FetchMolecules()
  },[])

  return (<div className='Molecule'>
    <p className='gradient-bottom'>Molecules in Database</p>
    <div className='MoleculeList'>
    {molecule.map((molecules, i) => (
      <MoleculeInformation {...molecules} key={i}></MoleculeInformation>
    ))}
    </div>
    <button onClick={()=>FetchMolecules()}>Refresh</button>
    <MoleculeUpload></MoleculeUpload>
  </div>)
}
function MoleculeInformation(props){
  const[show, setShow] = useState(false);
  const clickyClicky = () =>{
    setShow(!show)
  }
  console.log(props)
  const display = (<MoleculeDisplay name={props.name}></MoleculeDisplay>)

  return (<div key={props.i} className='MoleculeCard'>
    <p>{props.name}</p>
    <p>id: {props.id}</p>
    <p>Atoms No: {props.atom_count}</p>
    <p>Bond No: {props.bond_count}</p>

    <button onClick={clickyClicky}>
      {show ? "Hide" : "Show"}
    </button>
    {show ? display : null}

  </div>)
}


function MoleculeDisplay(props){
  return (<div >
    <img src={"../molecule/"+ props.name +".svg"} style={{ height: 250, width: 250 }}/>
  </div>)
}

function MoleculeUpload(props){
  const [file, setFile] = useState();
  const [name, setName] = useState('');
  let fileReader;

  function handleSubmit(event) {
    event.preventDefault()

    fileReader = new FileReader();
    fileReader.onloadend = uploadFile
    fileReader.readAsText(file);
  }

  const uploadFile = (e)=>{
    let dataPackage = {data : fileReader.result, name:name}
    
    //console.log(dataPackage)
    fetch("../molecule/"+ name +".sdf", {method:"POST", 
        headers: {"Content-type": "application/json"},
        body: JSON.stringify(dataPackage)
      })
      .then((response) => console.log(response))
      .catch((err) => console.error(err))
      console.log(file)
      
  }

  
/*
  function handleSubmit(event) {
    if (name === '' || !file){
      return;
    }
    const form = event.target;

    const name1 = form.querySelector('input[name="name"]').value;
    const fileInput = form.querySelector('input[type="file"]');
    const file1 = fileInput.files[0];
    let formData = new FormData();
    formData.append('file', file)

    console.log(formData)
    
  }*/
  const handleFileChange = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="text" value={name} onChange={(e)=>setName(e.target.value)}></input>
        <input type="file" onChange={handleFileChange}></input>
        <button type="submit">Upload</button> 
      </form>
    </div>
  )
}

function App(props) {
  return ( 
    <div>
    <ElementList> </ElementList>
    <MoleculeList></MoleculeList>
    </div>
  );
}


// Use a for loop or array.map to build the elements array
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <App/>
)