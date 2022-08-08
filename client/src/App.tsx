import React from 'react';

import 'antd/dist/antd.min.css';
import './App.css'

import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Home from "./pages/Home";
import Game from "./pages/Game";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
            <Route path='/' element={<Home />}/>
            <Route path='/:id' element={<Game />}/>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
