import { useState, useEffect } from 'react';

const MoleculeImage = ({ name }) => {
  const [image, setImage] = useState('');

  useEffect(() => {
    setImage(`../molecule/${name}.svg`);
  }, []);

  if (image === '') {
    return (
      <span className="MoleculeCardPreview">
        <h1>Loading Preview....</h1>
      </span>
    );
  }

  return (
    <span className="MoleculeCardPreview">
      <img
        src={image}
        style={{ height: '200px', width: 'auto' }}
        alt="preview"
      />
    </span>
  );
};
export default MoleculeImage;
