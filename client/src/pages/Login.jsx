import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
const Login = () => {
    const navigate = useNavigate()
    const [username,setUsername] = useState('')
    const [password,setPassword] = useState('')
    const loginHandler = (e) =>{
        e.preventDefault()
        axios.post(`http://localhost:3000/users/login`,{username,password})
        .then(response=>{
            alert(response.data.message)
            if(response.data.token.length){
                localStorage.setItem('token',response.data.token)
                navigate('/home')
            }
        }).catch(err=>{
            console.log(err)
            alert(err.response.data.message)
        })
    }
  return (
    <div className='h-screen w-full bg-white flex flex-col justify-center items-center'>
        <div className='h-[520px] w-[80%] md:w-[50%] flex flex-col justify-center items-center gap-20'>
            <div className='h-[50px] w-full rounded-lg'>
            <label className='text-black text-2xl'>
                username
            </label>
            <input
            onChange={(e)=>setUsername(e.target.value)}
            className='h-[50px] w-full rounded-lg text-2xl border-2 border-black' type='text'/>
            
            </div>
            <div className='h-[50px] w-full rounded-lg'>
            <label className='text-black text-2xl'>
                Password
            </label>
            <input
            onChange={(e)=>setPassword(e.target.value)}
            className='h-[50px] w-full rounded-lg text-2xl border-2 border-black' type='password'/>
            
            </div> 
            <button
            onClick={loginHandler}
            className='h-[50px] w-[90px] bg-green-400 rounded-lg text-black hover:bg-green-500 ease-linear duration-700'>
                Login
            </button> 
            
         </div>
    </div>
  )
}

export default Login