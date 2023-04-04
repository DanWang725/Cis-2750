import { useState, useEffect, createRef, useReducer} from 'React';
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
      if(file.size > 1000){
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
    const [rotationReady, setReady] = useState(false)
    const [isSpinning, setSpinning] = useState(false)
    const [spinIdx, setSpinIdx] = useState(0);
    const [x, setX] = useState([])
    const [y, setY] = useState([])
    const [z, setZ] = useState([])
    const Link = ReactRouterDOM.Link;

    const setIdx = ()=>{
      setSpinIdx(spinIdx + 1)
    }
    // const AnimationRotationX = ()=>{
    //   if(rotation[1] >= 72){
    //     setRotation([0, 0, 0])
    //     return
    //   }
    //   setRotation([0, rotation[1]+1, 0]);
    //   forceUpdate()
    // }

    const toggleSpin = () =>{
      // setSpinning(true)
      // console.log(spinIdx)
      // setSpinIdx(spinIdx + 1)

      if(isSpinning){
        setSpinning(false);
        clearInterval(interval)
      } else {
        console.log("spinning")
        setSpinning(true);
        makeInterval(setInterval(incrementRotation, 100));
      }
      
      
    }

    function incrementRotation(){

      // let newRotation = [0,0,0,rotation[3]];
      // let newVal = rotation[rotation[3]] + 1;
      
      // if(newVal >= 72){
      //   newVal = 0;
      //   newRotation[3] = rotation[3] === 3 ? 0 : rotation[3] + 1;
      // }
      //console.log(spinIdx)
      setSpinIdx(spinIdx => (spinIdx + 1) % 216)
      if(!isSpinning){
        clearInterval(interval)
      }
      
    }

    async function DownloadRotation(x,y,z) {
      return new Promise((resolve) =>{
        const img = new Image();
        img.onload = (resolve);
        img.src = '../molecule/rotation/'+ prop.state.molecule+'.'+ x+'.'+ y+'.'+ z+'.svg';
      })
    }

    async function DownloadSpin(){
      return (fetch("../molecule/all/rotation/" + prop.state.molecule + ".svg")
        .then((response) => response.json())
        .then((data) => {setX(data.x); setY(data.y); setZ(data.z)})
        .catch((err) => console.error(err))
      )
        
      // for(let i = 0; i < 72; i++){
      //   await DownloadRotation(i, 0, 0);
      // }
      // for(let i = 0; i < 72; i++){
      //   await DownloadRotation(0, i, 0);
      // }
      // for(let i = 0; i < 72; i++){
      //   await DownloadRotation(0, 0, i);
      // }
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
    //console.log(prop.state)
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
        <button className='MoleculeCard-action' onClick={()=>toggleSpin()}>SPIN</button>
        {isSpinning ? <span dangerouslySetInnerHTML={{ __html: getRotation(spinIdx)}} /> : ''}
        {/* <img src={('../molecule/rotation/'+ prop.state.molecule+ '.'+ rotation[0]+'.'+ rotation[1]+'.'+ rotation[2]+'.svg')} style={{ height: '100%', width: 'auto'}} alt="preview"/> */}
        <Link to={{
            pathname: '/molecule' // you can pass svetsko here
        }}>
          
            <button className='MoleculeCard-action'>Back</button>
        </Link>
    </div>)
  }