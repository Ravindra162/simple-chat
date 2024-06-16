import React, { useState } from 'react';
import axios from 'axios'
const AddFriend = ({closeFunction}) => {
    const [results,setResults] = useState([])
    const [friend,setFriend] = useState('')
    const search = () =>{
        axios.get(`http://localhost:3000/users/getUser?username=${friend}`,{
            headers:{
                Authorization:localStorage.getItem('token')
            }
        }).then(response=>{
            console.log(response.data)
            setResults(response.data.users)
        })
    }
  return (
    <div className='absolute inset-0 flex justify-center items-center'>
      <div className='h-[50vh] w-1/2 bg-red-100'>
        <div className='h-[10%] w-full bg-white'>
            <div onClick={()=>closeFunction(false)} className='float-right h-full flex items-center mx-4 cursor-pointer'>
            Close
            </div>
            </div>
            <div className='h-[90%] w-full bg-red-500 flex flex-col justify-center items-center gap-4'>
            <label className="input input-bordered flex items-center gap-2 w-1/2">
                <input onChange={(e)=>{
                    setFriend(e.target.value)
                    search()
                    }} type="text" className="grow" placeholder="Search" />
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" /></svg>
            </label>
            <div className='h-[80%] w-[75%] bg-white overflow-y-scroll'>
                {
                    results.map((elem,index)=>{
                        return <div key={index} className='h-[70px] w-full bg-slate-200 my-2 flex justify-between items-center'>
                                   <div> {elem.username} </div>
                                   <div>
                                   <button onClick={()=>{
                                    axios.post(`http://localhost:3000/users/addFriend`,{friendName:elem.username},{
                                        headers:{
                                            Authorization:localStorage.getItem('token')
                                        }
                                    }).then(response=>{
                                        console.log(response.data)
                                        alert(response.data.message)
                                    })
                                   }} className="btn btn-active btn-accent">Add friend</button>
                                   </div>
                               </div>
                               
                    })
                }
            </div>
            </div>
      </div>
    </div>
  );
}

export default AddFriend;
