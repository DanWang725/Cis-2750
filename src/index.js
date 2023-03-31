//import{ billionaires } from './billionaires'
import { useState, useEffect} from 'React';
import { Element, ElementList } from './Elements';
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

  return (<div>
    <p>Molecules in Database</p>
    {molecule.map((molecules, i) => (
      <MoleculeInformation {...molecules} key={i}></MoleculeInformation>
    ))}
    <button onClick={()=>FetchMolecules()}>Refresh</button>
  </div>)
}
function MoleculeInformation(props){
  console.log(props)
  return (<div key={props.i}>
    <p>{props.name}</p>
    <span>id: {props.id}</span>
    <span>Atoms No: {props.atom_count}</span>
    <span>Bond No: {props.bond_count}</span>
  </div>)
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