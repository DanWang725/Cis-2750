import{ billionaires } from './billionaires'
// import React, { useRef } from "https://cdn.skypack.dev/react";
// import ReactDOM from "https://cdn.skypack.dev/react-dom";

function ContactList(props){
  return (
    <div className='ContactList'>
      <h1 className='ContactList-title'>Contacts</h1>
      {props.children}
    </div>
  );
}

function ElementList(props){
  return (
    <div className='ContactList'>
      <h1>Elements</h1>
      {props.children}
    </div>
  )
}
let ListOfElements = [
  { code: 'C',
    name: 'Carbon',
    radius: '40',
    colour: '#f19283',
  },
  { code: 'H',
    name: 'Hydrogen',
    radius: '25',
    colour: '#amogus',
  }
]
function Element(props){
  return (
  <div className='Element' key={props.i}>
    <div className='ElementCode'>
      {props.code}
    </div>
    <span className='ElementName'>
      {props.name}
    </span>
    <p>Color: {props.colour} Radius: {props.radius}</p>
  </div>
  );
}

/*function Molecule(props){
  return ()
}*/

function Contact(props){
  let names = props.name.split(' ')
  let initials = names.map(name => name[0].toUpperCase()).join('')
  let photo
  if("photoURL" in props){
    photo = <img src={props.photoURL}/>
  }
  return (
    <div className='Contact' key={props.i}>
      <div className='Contact-avatar'>
        {initials}
        {photo}
      </div>
      <span className='Contact-name'>
        {props.name}
      </span>
      <a href={props.email}>
        {props.email}
      </a>
    </div>
  );
}

function App(props) {
  return (
   /* <ContactList>
      {props.contacts.map((contact, i) => 
        <Contact {...contact} key={i}/>
      )}
      <button onClick={update}>
        Add
      </button>
    </ContactList>*/
    <ElementList>
      {props.elements.map((element, i) => 
        <Element {...element} key={i}/>
      )}
    </ElementList>
  );
}


billionaires.forEach(element => {
  console.log(element)
});
// Your React elements will go here.
let elements = []
billionaires.forEach((element, i) => {
  let photo
  if("photoURL" in element){
    photo = <img src={element.photoURL}/>
  }
  let contact = <div className='Contact' key={i}>
      <div className='Contact-avatar'>
        {element.name.split(' ').map(s => s[0]).join('')}
        {photo}
      </div>
      <span className='Contact-name'>{element.name}</span>
      <a href={element.email}>
        {element.email}
      </a>
    </div>
  elements.push(contact)
})

function update(){
  updatedContacts = updatedContacts.concat({
    name: 'Myron Cringenko',
    email: 'mladyjen@uoguelph.ca',
  });
  ReactDOM.render(
    <App contacts={updatedContacts}/>,
    document.getElementById('root')
  )
}

// Use a for loop or array.map to build the elements array
let updatedContacts = billionaires;
ReactDOM.render(
  <App elements={ListOfElements}/>,
  document.getElementById('root')
)