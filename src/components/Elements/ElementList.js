import {useState, useEffect} from 'react'
import Element from './Elements';
import ElementForm from './ElementForm';
const ElementList = (props) => {
    let [elements, setElement] = useState(null);
  
    const refresh = () => {
      fetch("../test.json")
        .then((response) => response.json())
        .then((data) => setElement(data))
        .then((data) => console.log(data))
        .catch((err) => console.error(err))
    }
  
    const FetchDeleteElement = (code) => {
      console.log(code)
      fetch("../element.json", {method:"DELETE", 
      headers: {"Content-type": "text"},
      body: code
      })
      .then((response) => {console.log(response);
        refresh();
      })
      .catch((err) => console.error(err))
    }
  
    useEffect(() =>{
      refresh()
    }, [])
  
    if(!elements){
      return (
      <div className='Molecule middle-margins content-page'>
        <p>Loading elements....</p>
      </div>)
    }
  
    return (
      <div className='Molecule middle-margins content-page'>
        <p className='gradient-bottom'>Elements</p>
        {elements.map((element, i) => (
          <Element {...element} key={i} testDataThing={FetchDeleteElement}/>
        ))}
        <button onClick={refresh}>Refresh</button>
        <ElementForm onDataAddition={refresh}></ElementForm>
      </div>
    )
  }
export default ElementList;


