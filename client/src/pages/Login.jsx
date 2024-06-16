import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
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
    <div className='h-screen w-full bg-white md:bg-slate-200 flex flex-col justify-center items-center'>
        <div className='h-[90px] w-2/3 text-2xl md:text-4xl font-extrabold flex flex-col justify-center items-center'>
            <h1 className='animate__animated animate__bounce animate__infinite text-slate-800'>Good to See you !</h1>
            <p className='text-lg text-slate-800'>Login now</p>
        </div>
        <div className='h-[420px] w-[80%] md:w-[50%] flex flex-col justify-center items-center gap-[50px] md:gap-20 border-2 bg-slate-300 border-slate-500 p-5 rounded-lg hover:shadow-lg'>
            <div className='h-[50px] w-full rounded-lg'>
            <label className='text-black text-2xl'>
                Username
            </label>
            <input
            onChange={(e)=>setUsername(e.target.value)}
            className='h-[50px] p-2 w-full bg-white rounded-lg text-2xl border-2 border-slate-600' type='text'/>
            
            </div>
            <div className='h-[50px] w-full rounded-lg'>
            <label className='text-black text-2xl'>
                Password
            </label>
            <input
            onChange={(e)=>setPassword(e.target.value)}
            className='h-[50px] p-2 w-full bg-white rounded-lg text-2xl border-2 border-black' type='password'/>
            
            </div> 
            <button
            onClick={loginHandler}
            className='h-[60px] md:h-[50px] w-[90px] md:w-1/2 bg-slate-700 rounded-lg hover:bg-slate-900 text-white ease-linear duration-700'>
                Login
            </button> 
         </div>
         <Link to={'/register'}>
            New User
         </Link>
    </div>
  )
}

export default Login