//import{ billionaires } from './billionaires'
import { useState, useEffect, createRef} from 'React';
import { Element, ElementList } from './Elements';
import { MoleculeList } from './Molecules';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

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
}*/

function Refresh(){
  root.render(
    <App/>
  );
}


function Navbar(props){

}

function App(props) {
  let [view, setView] = useState('main');
  const elementList = (<ElementList> </ElementList>);
  const moleculeList = (<MoleculeList> </MoleculeList>);
  const mainMenu = (<div className='Homepage'>
    <p>Molecule Viewer</p>
    
  </div>)

  const showMolecules = ()=>{
    setView('molecules')
  }

  const showElements = ()=>{setView('elements');}
  const showMain = ()=>{setView('main');}

  return ( 
    <div className='mol-background fill-space'>
      <button onClick={()=>showMolecules()}>Molecules</button>
      <button onClick={()=>showElements()}>Elements</button>
      <button onClick={()=>showMain()}>Back</button> 
      {view === 'main' && mainMenu}
      {view === 'molecules' && moleculeList}
      {view === 'elements' && elementList}

    </div>
  );
}


// Use a for loop or array.map to build the elements array
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <App/>
)