import React, { useState, useEffect, useContext } from 'react'
import wsContext from '../context/WsContext'
import { useNavigate } from 'react-router-dom'
import '../App.css'
import axios from 'axios'
const Home = () => {
    const navigate = useNavigate()
    
    const {ws} = useContext(wsContext)
    const [chats,setChats] = useState([])
    const [isLoading,setIsLoading] = useState(true)
    useEffect(()=>{
        
       if(ws)
        ws.onmessage = (message) => {
            console.log(message.data)
        }
        
    },[ws])
    useEffect(()=>{
        axios.get('http://localhost:3000/users/getAllFriends',{
            headers:{
                'Authorization':localStorage.getItem('token')
            }
        }).then(response=>{
            console.log(response)
            setChats(response.data.friends)
            setIsLoading(false)
        }).catch(err=>console.log(err))
    },[])
  return (
    <div className='h-screen w-full bg-slate-200 p-5'>
        {isLoading&&<>Loading....</>}
        <div className='h-[90%] w-full overflow-y-scroll rounded-md'>
        {chats.map((elem, index) => (
             <div 
             onClick={()=>{
                navigate(`/chat/${elem.id}`)
             }}
             key={index} className='h-[12%] w-[90%] md:w-[45%] bg-slate-500 my-2 mx-auto rounded-xl flex flex-row justify-between items-center p-4 cursor-pointer'>
                <img className='h-[60px] w-[60px] rounded-full' src={elem.profile}/>
                <div className='h-[70%] w-[70%] text-xl'>
                    {elem.username}
                </div>
            </div>
        ))}
</div>
    </div>  
  )
}

export default Home
