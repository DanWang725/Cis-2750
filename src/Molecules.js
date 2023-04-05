import { useState, useEffect, createRef, useReducer} from 'React';
import { BrowserRouter as Router, Routes, Route, useLocation} from 'react-router-dom';
import ReactSlider from 'react-slider'

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

    const handleTextInput = (val)=>{
      if(! /^[a-zA-Z0-9]+$/.test(val) && val.length > 0){
        console.log("failed");
        return;
      }
      setName(val);
    }
  
    function handleSubmit(event) {
      event.preventDefault()
  
      fileReader = new FileReader();
      fileReader.onloadend = uploadFile
      fileReader.readAsText(file);
    }
  
    const uploadFile = (e)=>{
      if(file.size > 100000){
        console.log(file.size)
        return
      }
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
          <input type="text" value={name} onChange={(e)=>handleTextInput(e.target.value)}></input>
          <input type="file" onChange={handleFileChange} accept=".sdf"></input>
          <button type="submit">Upload</button> 
        </form>
      </div>
    )
  }

  export function MoleculeView(props){
    const [interval, makeInterval] = useState('')
    const [isLoaded, setReady] = useState(false)
    const [isSpinning, setSpinning] = useState(false)
    const [spinIdx, setSpinIdx] = useState(0);
    const [axis, setAxis] = useState(0);
    const [x, setX] = useState([])
    const [y, setY] = useState([])
    const [z, setZ] = useState([])
    const Link = ReactRouterDOM.Link;

    const setIdx = ()=>{
      setSpinIdx(spinIdx + 1)
    }

    const sliderHandleChange = (event)=>{
      // console.log("spinidx: "+spinIdx)
      // console.log("slider: "+event.target.value + " axis: " + axis)
      setSpinIdx((axis * 72) + Number(event.target.value))
    }

    const toggleSpin = () =>{
      if(isSpinning){
        setSpinning(false);
        clearInterval(interval)
      } else {
        // console.log("spinning")
        setSpinning(true);
        makeInterval(setInterval(incrementRotation, 1));
      }
    }

    function incrementRotation(){
      setSpinIdx(spinIdx => (spinIdx + 1) % 216)
      if(!isSpinning){
        clearInterval(interval)
      }
      
    }

    async function DownloadSpin(){
      return (fetch("../molecule/all/rotation/" + prop.state.molecule + ".svg")
        .then((response) => response.json())
        .then((data) => {setX(data.x); setY(data.y); setZ(data.z)})
        .catch((err) => console.error(err))
      )
    }

    function updateAxisButton(val){
      // console.log("before:" + axis)
      setSpinIdx((spinIdx % 72) + val*72)
      setAxis(val)
      // console.log("after:" + axis)
    }

    const getRotation = (idx) =>{
      console.log(idx/72)
      switch(Math.floor(idx / 72)){
        case 0:
          return(x[idx % 72])
        case 1:
          return(y[idx % 72])
        case 2:
          return(z[idx % 72])
        default:
          console.log("error")
          break;
      }
    }

    useEffect(()=>{
      if(prop.state !== undefined){
        DownloadSpin()
        .then(()=>setReady(true))
      }
    },[]
    )

    const location = ReactRouterDOM.useLocation();
    const prop = {...location}
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
        <h1 className='gradient-bottom'>{prop.state.molecule}</h1>
        <Link className='display-block' to={{
            pathname: '/molecule' // you can pass svetsko here
        }}>
            <button className='MoleculeCard-action'>Back</button>
        </Link>
        <div className='Molecule-view-side'>
          <button className='MoleculeCard-action' onClick={()=>toggleSpin()} disabled={!isLoaded}>{isSpinning ? "Stop Spinning" : "Spin Molecule"}</button>
          
          <div className='molecule-rotate-suite'>
            <h1>Rotate Molecule</h1>
            <input className='MoleculeCard-action' type="range" value={(spinIdx % 72)} min={0} max={71} onChange={sliderHandleChange}></input>
            <div>
              <label>Axis of Rotation</label>
              <button className={"molecule-button"+ (Math.floor(spinIdx / 72)===0 ? 'molecule-button-active ': '')} onClick={()=>updateAxisButton(0)}>X</button>
              <button className={"molecule-button"+ (Math.floor(spinIdx / 72)===1 ? 'molecule-button-active': '')} onClick={()=>updateAxisButton(1)}>Y</button>
              <button className={"molecule-button"+ (Math.floor(spinIdx / 72)===2 ? 'molecule-button-active': '')} onClick={()=>updateAxisButton(2)}>Z</button>
            </div>
          </div>
        </div>
        {isLoaded ? <span className='Molecule-full-image' dangerouslySetInnerHTML={{ __html: getRotation(spinIdx)}} /> : <h1>Loading Image</h1>}
    </div>)
  }