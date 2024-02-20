import Homepage from "./components/screens/Homepage";
import {NavLink, HashRouter, Route, Routes} from 'react-router-dom'
import MoleculeList from "./components/Molecules/MoleculeList";
import ElementList from "./components/Elements/ElementList";
import MoleculeView from "./components/screens/MoleculeView";
const AppRoutes = (props) => {

    // let [view, setView] = useState('main');
    // const elementList = (<ElementList> </ElementList>);
    // const moleculeList = (<MoleculeList> </MoleculeList>);
    
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
      <HashRouter> 
      <div className='mol-background fill-space'>
        <ul className='Navbar'>
          <li>
            <NavLink to='/' exact={true} className='Navbar-link' activeClassName="Navbar-active">Home</NavLink>
          </li>
          <li>
            <NavLink to='/molecule'className='Navbar-link' activeClassName="Navbar-active">Molecule</NavLink>
          </li>
          <li>
            <NavLink to='/element'className='Navbar-link' activeClassName="Navbar-active">Element</NavLink>
          </li>
        </ul>
        <Routes>
          <Route path='/' exact element={<Homepage></Homepage>}></Route>  
          <Route path='/molecule' exact element={<MoleculeList/>}></Route>  
          <Route path='/molecule/view' element={<MoleculeView/>}></Route>  
          <Route path='/element' element={<ElementList/>}></Route>  
        </Routes>
        {/* <button onClick={()=>showMolecules()}>Molecules</button>
        <button onClick={()=>showElements()}>Elements</button>
        <button onClick={()=>showMain()}>Back</button> 
        {view === 'main' && mainMenu}
        {view === 'molecules' && moleculeList}
        {view === 'elements' && elementList} */}
  
      </div>
      </HashRouter>
    );
}

export default AppRoutes;