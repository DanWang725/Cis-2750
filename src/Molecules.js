import { useState, useEffect, createRef} from 'React';
import { BrowserRouter as Router, Routes, Route, useLocation} from 'react-router-dom';

export function MoleculeList(props){
    let [molecule, setMolecule] = useState([]);
    const FetchMolecules = () =>{
      fetch("../molecule.json")
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          setMolecule(data)})
        .catch((err) => console.error(err))
    }
  
    useEffect(()=> {
      FetchMolecules()
    },[])

    const DeleteMolecule = (code) => {
      console.log(code)
      fetch("../molecule.json", {method:"DELETE", 
      headers: {"Content-type": "text"},
      body: code
      })
      .then((response) => {console.log(response);
        FetchMolecules();
      })
      .catch((err) => console.error(err))
    }
  
    if(molecule.length === 0){
      return (<div className='Molecule Page-content '>
        <p>Loading Molecules...</p>
      </div>)
    }
  
    return (<div className='Molecule middle-margins content-page'>
      <p className='gradient-bottom'>Molecules in Database</p>
      <div className='MoleculeList'>
      {molecule.map((molecules, i) => (
        <MoleculeInformation {...molecules} key={i} deleteCallbackHandler={DeleteMolecule}></MoleculeInformation>
      ))}
      </div>
      <button onClick={()=>FetchMolecules()}>Refresh</button>
      <MoleculeUpload></MoleculeUpload>
    </div>)
  }
  function MoleculeInformation(props){
    const[show, setShow] = useState(false);
    const Link = ReactRouterDOM.Link;

    const clickyClicky = () =>{
      setShow(!show)
    }
    console.log(props)
    
    const display = (<MoleculeDisplay name={props.name}></MoleculeDisplay>)
  
    return (<div key={props.i} className='MoleculeCard MoleculeCard-Front'>
      <div className="MoleculeCard-Wrapper">
        {display}
        <p>{props.name}</p>
        <p>id: {props.id}</p>
        <p>Atoms No: {props.atom_count}</p>
        <p>Bond No: {props.bond_count}</p>
        <button onClick={()=>props.deleteCallbackHandler(props.name)}></button>
        <Link to={{
            pathname: '/molecule/view',
            state: { molecule : props.name } // you can pass svetsko here
        }}>
            <button className='MoleculeCard-action'>Show</button>
        </Link>
      </div>
    </div>)
  }
  
  
  function MoleculeDisplay(props){
    const [image, setImage] = useState('')
    
    useEffect(()=>{
      setImage("../molecule/"+ props.name +".svg")
    }, [])
  
    if(image === ''){
      return (<span className='MoleculeCardPreview'>
        <h1>Loading Preview....</h1>
      </span>)
    }
  
    return (<span className='MoleculeCardPreview'>
      <img src={image} style={{ height: '200px', width: 'auto'}} alt="preview"/>
      
    </span>)
  }
  
  export function MoleculeUpload(props){
    const [file, setFile] = useState();
    const [name, setName] = useState('');
    let fileReader;
  
    function handleSubmit(event) {
      event.preventDefault()
  
      fileReader = new FileReader();
      fileReader.onloadend = uploadFile
      fileReader.readAsText(file);
    }
  
    const uploadFile = (e)=>{
      let dataPackage = {data : fileReader.result, name:name}
      
      //console.log(dataPackage)
      fetch("../molecule/"+ name +".sdf", {method:"POST", 
          headers: {"Content-type": "application/json"},
          body: JSON.stringify(dataPackage)
        })
        .then((response) => console.log(response))
        .catch((err) => console.error(err))
        console.log(file)
        
    }
  
    const handleFileChange = (e) => {
      if (e.target.files) {
        setFile(e.target.files[0]);
      }
    };
    return (
      <div>
        <form onSubmit={handleSubmit}>
          <input type="text" value={name} onChange={(e)=>setName(e.target.value)}></input>
          <input type="file" onChange={handleFileChange}></input>
          <button type="submit">Upload</button> 
        </form>
      </div>
    )
  }

  export function MoleculeView(props){

    const Link = ReactRouterDOM.Link;

    const location = ReactRouterDOM.useLocation();
    const prop = {...location}
    console.log(prop.state)
    if(prop.state === undefined){
        return (<div className='middle-margins content-page'>
            <h1>Error - Attempted to access data without request</h1>
            <Link to={{
            pathname: '/molecule' // you can pass svetsko here
            }}>
            <button className='MoleculeCard-action'>Back</button>
        </Link>
        </div>)
    }
    return (<div className='middle-margins content-page Molecule-view'>
        <h1>{prop.state.molecule}</h1>
        <img src={"../molecule/"+ prop.state.molecule +".svg"} style={{ height: '100%', width: 'auto'}} alt="preview"/>
        <Link to={{
            pathname: '/molecule' // you can pass svetsko here
        }}>
            <button className='MoleculeCard-action'>Back</button>
        </Link>
    </div>)
  }