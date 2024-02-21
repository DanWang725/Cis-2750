import { useState, useEffect } from 'react';
import MoleculeCard from './MoleculeCard';
import MoleculeUploadTab from './MoleculeUploadTab';
import useFetchHandler from '../../shared-components/hooks/useFetchHandler';
const MoleculeList = () => {
  const [molecule, setMolecule] = useState([]);
  const { isLoaded, forceFetch } = useFetchHandler(
    '../molecule.json',
    setMolecule,
  );

  const DeleteMolecule = (code) => {
    console.log(code);
    fetch('../molecule.json', {
      method: 'DELETE',
      headers: { 'Content-type': 'text' },
      body: code,
    })
      .then((response) => {
        console.log(response);
        forceFetch();
      })
      .catch((err) => console.error('lol'));
  };

  if (molecule.length === 0 && !isLoaded) {
    return (
      <div className="Molecule middle-margins content-page">
        <p>Loading Molecules...</p>
      </div>
    );
  }

  return (
    <div className="Molecule middle-margins content-page">
      <p className="gradient-bottom">Molecules in Database</p>
      {molecule.length !== 0 ? (
        <div className="MoleculeList">
          {molecule.map((molecules, i) => (
            <MoleculeCard
              {...molecules}
              key={i}
              deleteCallbackHandler={DeleteMolecule}
            />
          ))}
        </div>
      ) : (
        <div>There are no molecules in the database... Upload one</div>
      )}

      <button onClick={() => forceFetch()}>Refresh</button>
      <MoleculeUploadTab refreshHandler={forceFetch} />
    </div>
  );
};

export default MoleculeList;
