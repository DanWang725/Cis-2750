import { useState, useEffect } from "react"
import {Link, useLocation} from 'react-router-dom'
const MoleculeView = (props) => {
    const [interval, makeInterval] = useState('')
    const [isLoaded, setReady] = useState(false)
    const [isSpinning, setSpinning] = useState(false)
    const [spinIdx, setSpinIdx] = useState(0);
    const [axis, setAxis] = useState(0);
    const [x, setX] = useState([])
    const [y, setY] = useState([])
    const [z, setZ] = useState([])

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
        makeInterval(setInterval(incrementRotation, 20));
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

    const location = useLocation();
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
  export default MoleculeView