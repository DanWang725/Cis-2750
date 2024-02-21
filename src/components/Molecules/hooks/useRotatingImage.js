import { useState, useEffect } from 'react';
import useFetchHandler from '../../../shared-components/hooks/useFetchHandler';
const useRotatingImage = (moleculeName) => {
  const [x, setX] = useState([]);
  const [y, setY] = useState([]);
  const [z, setZ] = useState([]);
  const setData = (data) => {
    setX(data.x);
    setY(data.y);
    setZ(data.z);
  };
  const { isLoaded } = useFetchHandler(
    `../molecule/all/rotation/${moleculeName}.svg`,
    setData,
  );

  const getRotationImage = (idx) => {
    console.log(idx / 72);
    switch (Math.floor(idx / 72)) {
      case 0:
        return x[idx % 72];
      case 1:
        return y[idx % 72];
      case 2:
        return z[idx % 72];
      default:
        console.log('error');
        break;
    }
  };

  return { isLoaded, getRotationImage };
};
export default useRotatingImage;
