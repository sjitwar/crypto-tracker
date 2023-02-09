import React from 'react';
import { Routes, Route } from 'react-router-dom';

import App from '/App';
import Signup from '../pages/Signup';

const Main = () => {
  return (
    <Routes>
      <Route path='/' element={App}></Route>
      <Route path='/signup' element={Signup}></Route>
    </Routes>
  );
}

export default Main;