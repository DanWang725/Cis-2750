//import{ billionaires } from './billionaires'
import { useState, useEffect} from 'React';
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
    <p>Molecules in Database</p>
    <div className='MoleculeList'>
    {molecule.map((molecules, i) => (
      <MoleculeInformation {...molecules} key={i}></MoleculeInformation>
    ))}
    </div>
    <button onClick={()=>FetchMolecules()}>Refresh</button>
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
/*
const svgWrapper = (svg) => {
  const svgWrapperRef = React.useRef();
  React.useEffect(() => {
    svgWrapperRef.current.innerHTML = svg;
  }, [])
  return {
    svgWrapperRef
  }
}*/

function MoleculeDisplay(props){


  return (<div >
    <img src={"../molecule/"+ props.name +".svg"} style={{ height: 250, width: 250 }}/>
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