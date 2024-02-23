import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import useRotatingImage from '../Molecules/hooks/useRotatingImage';

const MoleculeView = (props) => {
  const prop = useLocation();
  const { isLoaded, getRotationImage } = useRotatingImage(
    prop?.state?.molecule,
  );

  const [interval, makeInterval] = useState('');
  const [isSpinning, setSpinning] = useState(false);
  const [spinIdx, setSpinIdx] = useState(0);
  const [axis, setAxis] = useState(0);

  const onSpinChange = (event) => {
    setSpinIdx(axis * 72 + Number(event.target.value));
  };

  const toggleSpin = () => {
    if (isSpinning) {
      setSpinning(false);
      clearInterval(interval);
    } else {
      setSpinning(true);
      makeInterval(setInterval(incrementRotation, 20));
    }
  };

  function incrementRotation() {
    setSpinIdx((spinIdx) => (spinIdx + 1) % 216);
    if (!isSpinning) {
      clearInterval(interval);
    }
  }

  function updateAxisButton(val) {
    // console.log("before:" + axis)
    setSpinIdx((spinIdx % 72) + val * 72);
    setAxis(val);
    // console.log("after:" + axis)
  }

  if (!prop?.state) {
    return (
      <div className="middle-margins content-page">
        <h1>Error - Attempted to access data without request</h1>
        <Link
          to={{
            pathname: '/molecule', // you can pass svetsko here
          }}
        >
          <button className="MoleculeCard-action">Back</button>
        </Link>
      </div>
    );
  }
  return (
    <div className="middle-margins content-page Molecule-view">
      <h1 className="gradient-bottom">{prop?.state?.molecule}</h1>
      <Link
        className="display-block"
        to={{
          pathname: '/molecule', // you can pass svetsko here
        }}
      >
        <button className="MoleculeCard-action">Back</button>
      </Link>
      <div className="Molecule-view-side">
        <button
          className="MoleculeCard-action"
          onClick={() => toggleSpin()}
          disabled={!isLoaded}
        >
          {isSpinning ? 'Stop Spinning' : 'Spin Molecule'}
        </button>

        <div className="molecule-rotate-suite">
          <h1>Rotate Molecule</h1>
          <input
            className="MoleculeCard-action"
            type="range"
            value={spinIdx % 72}
            min={0}
            max={71}
            onChange={onSpinChange}
          />
          <div>
            <label>Axis of Rotation</label>
            <button
              className={`molecule-button${
                Math.floor(spinIdx / 72) === 0 ? 'molecule-button-active ' : ''
              }`}
              onClick={() => updateAxisButton(0)}
            >
              X
            </button>
            <button
              className={`molecule-button${Math.floor(spinIdx / 72) === 1 ? 'molecule-button-active' : ''}`}
              onClick={() => updateAxisButton(1)}
            >
              Y
            </button>
            <button
              className={`molecule-button${Math.floor(spinIdx / 72) === 2 ? 'molecule-button-active' : ''}`}
              onClick={() => updateAxisButton(2)}
            >
              Z
            </button>
          </div>
        </div>
      </div>
      {isLoaded ? (
        <span
          className="Molecule-full-image"
          dangerouslySetInnerHTML={{ __html: getRotationImage(spinIdx) }}
        />
      ) : (
        <h1>Loading Image</h1>
      )}
    </div>
  );
};
export default MoleculeView;
