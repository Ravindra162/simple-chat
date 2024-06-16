import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import Layout from './components/Layout';
import WsContextProvider from './context/WsContextProvider';
import Chat from './pages/Chat';
import UserContextProvider from './context/UserContextProvider';
const App = () => {
  return (
    <WsContextProvider>
   
    <Router>
      <Routes>
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/register" element={<Register />} />
        <Route element={<Layout/>}>
          <Route path="/home" element={<UserContextProvider><Home/></UserContextProvider>} />
          <Route path='/chat/:friendId' element={<UserContextProvider><Chat/></UserContextProvider>}/>
        </Route>
      </Routes>
    </Router>
    </WsContextProvider>
  );
};

export default App;
