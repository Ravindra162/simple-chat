import React, { useState } from 'react';
import axios from 'axios'
const Notification = ({closeFunction,notifications}) => {
    const acceptFriend = (friend_id) => {
        console.log(friend_id)
        axios.post('http://localhost:3000/users/acceptFriendRequest',{friend_id:friend_id},{
            headers:{
                
            Authorization:localStorage.getItem('token')
            }
        }).then(response=>{
            console.log(response.data)
            alert(response.data.message)
        }).catch(err=>{
            console.log(err)
            alert(err.response.data.message)
        })
    }   
  return (
    <div className='absolute inset-0 flex justify-center items-center'>
      <div className='h-[50vh] w-3/4 bg-red-100'>
        <div className='h-[10%] w-full bg-white'>
            <div onClick={()=>closeFunction(false)} className='float-right h-full flex items-center mx-4 cursor-pointer'>
            Close
            </div>
            </div>
            <div className='h-[90%] w-full bg-red-500 flex flex-col justify-center items-center gap-4'>
            <div className='h-[80%] w-[75%] bg-white overflow-y-scroll'>
                {
                    notifications.map((elem,index)=>{
                        return <div key={index} className='h-[70px] w-full bg-slate-200 my-2 flex justify-between items-center px-2'>
                                   <div> {elem.message}</div>
                                   <div>
                                    {elem.type==='friend_request'?<div className='flex'>
                                   <button onClick={()=>acceptFriend(elem.sender_id)} className="btn btn-active btn-accent">Accept</button>
                                   
                                   </div>:<button onClick={()=>{
                                    axios.post('http://localhost:3000/users/markAsRead',{notification_id:elem.id},{
                                        headers:{
                                            Authorization:localStorage.getItem('token')
                                        }
                                    }).then(response=>{
                                        console.log(response.data)
                                        alert(response.data.message)
                                    })
                                   }} className="btn btn-active btn-accent">Mark as read</button>}
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

export default Notification;
