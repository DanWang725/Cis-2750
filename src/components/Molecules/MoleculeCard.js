import { useState } from 'react';
import { Link } from 'react-router-dom';
import MoleculeImage from './MoleculeImage';

const MoleculeCard = ({
  i,
  name,
  id,
  atom_count,
  bond_count,
  deleteCallbackHandler,
}) => {
  const [show, setShow] = useState(false);

  const clickyClicky = () => {
    setShow(!show);
  };

  const display = <MoleculeImage name={name} />;

  return (
    <div key={i} className="MoleculeCard MoleculeCard-Front">
      <div className="MoleculeCard-Wrapper">
        {display}
        <p className="molecule-info-title">{name}</p>
        <p>
          id:
          {id}
        </p>
        <p>
          Atoms No:
          {atom_count}
        </p>
        <p>
          Bond No:
          {bond_count}
        </p>
        <Link
          to="/molecule/view"
          state={{ molecule: name }} // you can pass svetsko here
        >
          <button className="MoleculeCard-action">Show</button>
        </Link>
        <button
          className="MoleculeCard-action"
          onClick={() => deleteCallbackHandler(name)}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default MoleculeCard;
