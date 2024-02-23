import { NavLink, HashRouter, Route, Routes } from 'react-router-dom';
import Homepage from './components/screens/Homepage';
import MoleculeList from './components/Molecules/MoleculeList';
import ElementList from './components/Elements/ElementList';
import MoleculeView from './components/screens/MoleculeView';

const AppRoutes = (props) => {
  return (
    <HashRouter>
      <div className="mol-background fill-space">
        <ul className="Navbar">
          <li>
            <NavLink
              to="/"
              exact
              className="Navbar-link"
              activeClassName="Navbar-active"
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/molecule"
              className="Navbar-link"
              activeClassName="Navbar-active"
            >
              Molecule
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/element"
              className="Navbar-link"
              activeClassName="Navbar-active"
            >
              Element
            </NavLink>
          </li>
        </ul>
        <Routes>
          <Route path="/" exact element={<Homepage />} />
          <Route path="/molecule" exact element={<MoleculeList />} />
          <Route path="/molecule/view" element={<MoleculeView />} />
          <Route path="/element" element={<ElementList />} />
        </Routes>
      </div>
    </HashRouter>
  );
};

export default AppRoutes;
