import React from 'react';
import logo from './logo.svg';
import './App.css';
import WebGLMain from "./Controllers/WebGLController/WebGLMain";

function App() {
  return (
    <WebGLMain red={0.5} green={0.5} blue={0.5}/>
  );
}

export default App;
