//import{ billionaires } from './billionaires'
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

//import SVG from 'React-inlinesvg';

//import ReactDOM from "https://cdn.skypack.dev/react-dom";
/*
function ContactList(props){
  return (
    <div className='ContactList'>
      <h1 className='ContactList-title'>Contacts</h1>
      {props.children}
    </div>
  );
}*/

// Use a for loop or array.map to build the elements array
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
reportWebVitals();
