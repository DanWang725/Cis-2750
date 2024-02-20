
const Element = ({name, code, radius, colour1, colour2, colour3,i, ...otherProps}) => {
    return (
    <div className='Element' key={i}>
      <div className='ElementCode'>
        {code}
      </div>
      <div className='ElementTextBox'>
        <span className='ElementName'>
          {name}
        </span>
        <span className='ElementInfo'>
          Radius: {radius}
        </span>
        
      </div>
      <div className='Element-colour-list'>
        <div className='colour-symbol-pair'>
          <p>Colour 1: {colour1}</p>
          <span className='small-square' style={{backgroundColor: '#'+(colour1)}}></span>
        </div>
        <div className='colour-symbol-pair'>
          <p>Colour 2: {colour2}</p>
          <span className='small-square' style={{backgroundColor: '#'+(colour2)}}></span>
        </div>
        <div className='colour-symbol-pair'>
          <p>Colour 3: {colour3}</p>
          <span className='small-square' style={{backgroundColor: '#'+(colour3)}}></span>
        </div>
      </div>
      <button className='Element-actions' onClick={()=>otherProps.testDataThing(code)}>X</button>
    </div>
    );
}

export default Element;
