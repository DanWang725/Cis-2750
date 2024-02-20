import { useState } from "react";
import {Link} from 'react-router-dom'
import MoleculeImage from "./MoleculeImage";
const MoleculeCard = (props) => {
    const[show, setShow] = useState(false);

    const clickyClicky = () =>{
      setShow(!show)
    }
    console.log(props)
    
    const display = (<MoleculeImage name={props.name}></MoleculeImage>)
  
    return (<div key={props.i} className='MoleculeCard MoleculeCard-Front'>
      <div className="MoleculeCard-Wrapper">
        {display}
        <p className='molecule-info-title'>{props.name}</p>
        <p>id: {props.id}</p>
        <p>Atoms No: {props.atom_count}</p>
        <p>Bond No: {props.bond_count}</p>
        <Link to={{
          pathname: '/molecule/view',
          state: { molecule : props.name } // you can pass svetsko here
        }}>
            <button className='MoleculeCard-action'>Show</button>
        </Link>
          <button className='MoleculeCard-action' onClick={()=>props.deleteCallbackHandler(props.name)}>Delete</button>
      </div>
    </div>)
  }

export default MoleculeCard;