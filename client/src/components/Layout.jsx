// Layout.js
import React, { useEffect } from 'react';
import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';

const Layout = ({ children }) => {
  useEffect(()=>{
    if(!localStorage.getItem('token')){
      window.location.href='/login'
    }
  })
  return (
    <>
      <Navbar />
      <hr/>
      <Outlet/>
      </>
  );
};

export default Layout;
