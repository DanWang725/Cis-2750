import { useState } from 'react';
import Element from './Elements';
import ElementForm from './ElementForm';
import useFetchHandler from '../../shared-components/hooks/useFetchHandler';

const ElementList = () => {
  const [elements, setElement] = useState(null);
  const { isLoaded, forceFetch } = useFetchHandler('../test.json', setElement);

  const FetchDeleteElement = (code) => {
    console.log(code);
    fetch('../element.json', {
      method: 'DELETE',
      headers: { 'Content-type': 'text' },
      body: code,
    })
      .then((response) => {
        console.log(response);
        forceFetch();
      })
      .catch((err) => console.error(err));
  };

  if (!isLoaded) {
    return (
      <div className="Molecule middle-margins content-page">
        <p>Loading elements....</p>
      </div>
    );
  }

  return (
    <div className="Molecule middle-margins content-page">
      <p className="gradient-bottom">Elements</p>
      {elements?.map((element, i) => (
        <Element {...element} key={i} testDataThing={FetchDeleteElement} />
      ))}
      <button onClick={forceFetch}>Refresh</button>
      <ElementForm onDataAddition={forceFetch} />
    </div>
  );
};
export default ElementList;
