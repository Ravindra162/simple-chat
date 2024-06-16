import React, { useEffect } from 'react'

const Landing = () => {
    useEffect(()=>{
        if(localStorage.getItem('token')){
            window.location.href='/home'
        }
        else{
            window.location.href='/login'
        }
    })
  return (
    <div>
    </div>
  )
}

export default Landing
