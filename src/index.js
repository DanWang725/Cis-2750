//import{ billionaires } from './billionaires'
import { useState, useEffect, createRef} from 'React';
import { Element, ElementList } from './Elements';
import { MoleculeList, MoleculeView} from './Molecules';
import {Route,NavLink, HashRouter} from 'react-router-dom';

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
function Homepage(props){
  return (<div className='Homepage'>
    <h1>Molecule Viewer</h1>
    <h2>by Daniel Wang</h2>
  </div>)
}

function App(props) {

  // let [view, setView] = useState('main');
  // const elementList = (<ElementList> </ElementList>);
  // const moleculeList = (<MoleculeList> </MoleculeList>);
  const NavLink = ReactRouterDOM.NavLink;
  const Route = ReactRouterDOM.Route;
  
  // const showMolecules = ()=>{
    //   setView('molecules')
    // }
    
    // const showElements = ()=>{setView('elements');}
    // const showMain = ()=>{setView('main');}
    const mainMenu =()=> (<Homepage></Homepage>)
  const molecule = () => (<MoleculeList></MoleculeList>)
  const element = () => (<ElementList></ElementList>)
  const moleculeView = ()=>( <MoleculeView></MoleculeView>)
  return (
    <ReactRouterDOM.HashRouter> 
    <div className='mol-background fill-space'>
      <ul className='Navbar'>
        <li>
          <NavLink to='/' exact={true} className='Navbar-link' activeClassName="Navbar-active">Home</NavLink>
        </li>
        <li>
          <NavLink to='/molecule'className='Navbar-link' activeClassName="Navbar-active">molecule</NavLink>
        </li>
        <li>
          <NavLink to='/element'className='Navbar-link' activeClassName="Navbar-active">element</NavLink>
        </li>
      </ul>
        <Route path='/' exact component={mainMenu}></Route>  
        <Route path='/molecule' exact component={molecule}></Route>  
        <Route path='/molecule/view' component={moleculeView}></Route>  
        <Route path='/element' component={element}></Route>  
      {/* <button onClick={()=>showMolecules()}>Molecules</button>
      <button onClick={()=>showElements()}>Elements</button>
      <button onClick={()=>showMain()}>Back</button> 
      {view === 'main' && mainMenu}
      {view === 'molecules' && moleculeList}
      {view === 'elements' && elementList} */}

    </div>
    </ReactRouterDOM.HashRouter>
  );
}


// Use a for loop or array.map to build the elements array
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <App/>
)