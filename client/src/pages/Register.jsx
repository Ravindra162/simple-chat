import React, { useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
const Register = () => {
    const navigate = useNavigate()
    const [username,setUsername] = useState('')
    const [password,setPassword] = useState('')
    const [confPass,setConfpass] = useState('')
    const registerHandler = (e) =>{
        e.preventDefault()
        if(password!==confPass){
            alert("password and confirm password are not same")
            return console.log('P != C')
        }
        axios.post('http://localhost:3000/users/register',{username,password,confPass})
        .then((response)=>{
            console.log(response.data)
            alert(response.data.message)
        }).catch(err=>{
            console.log(err)
        })
    }
  return (
    <div className='h-screen w-full bg-white md:bg-slate-200 flex flex-col justify-center items-center'>
        <div className='h-[90px] w-2/3 text-2xl md:text-4xl font-extrabold flex flex-col justify-center items-center'>
            <h1 className='animate__animated animate__bounce animate__infinite text-slate-800'>Welcome !</h1>
            <p className='text-lg text-slate-800'>Sign up to get started</p>
        </div>
        <div className='h-[520px] w-[80%] md:w-[50%] flex flex-col justify-center items-center gap-[50px] md:gap-20 border-2 bg-slate-300 border-slate-500 p-5 rounded-lg hover:shadow-xl'>
            <div className='h-[50px] w-full rounded-lg'>
            <label className='text-black text-2xl'>
                username
            </label>
            <input
            onChange={(e)=>setUsername(e.target.value)}
            className='h-[50px] bg-white w-full rounded-lg text-2xl border-2 border-black' type='text'/>
            
            </div>
            <div className='h-[50px] w-full rounded-lg'>
            <label className='text-black text-2xl'>
                Password
            </label>
            <input
            onChange={(e)=>setPassword(e.target.value)}
            className='h-[50px] w-full bg-white rounded-lg text-2xl border-2 border-black' type='password'/>
            
            </div> 
            <div className='h-[50px] w-full rounded-lg'>
            <label className='text-black text-2xl'>
               Confirm Password
            </label>
            <input
            onChange={(e)=>setConfpass(e.target.value)}
            className='h-[50px] w-full bg-white rounded-lg text-2xl border-2 border-black' type='password'/>
            
            </div> 
            <button
            onClick={registerHandler}
            className='h-[50px] w-[90px] md:w-1/2 bg-slate-700 rounded-lg  hover:bg-slate-900 text-white ease-linear duration-700'>
                Register
            </button> 
         </div>
         <Link className='relative top-0' to='/login'>Already Registered?</Link>
    </div>
  )
}

export default Register