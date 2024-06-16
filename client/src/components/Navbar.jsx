import React, {useContext, useEffect, useState} from 'react'
import UserContext from '../context/UserContext'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import AddFriend from './AddFriend'
import Notification from './Notification'
const Navbar = () => {
  const navigate = useNavigate()
  const [user,setUser] = useState('')
  const [addFriend,setAddFriend] = useState(false)
  const [seeNotification,setSeeNotification] = useState(false)
  const [notifications,setNotifications] = useState([])
  useEffect(()=>{
      axios.get('http://localhost:3000/users/get',{
        headers:{
          'Authorization':localStorage.getItem('token')
        }
      }).then(response=>{
        setUser(response.data.user)
      })
      axios.get('http://localhost:3000/users/getNotifications',{
        headers:{
          Authorization:localStorage.getItem('token')
        }
      }).then(response=>{
        console.log(response.data)
        setNotifications(response.data)
      })
    
  },[])
  return (
    <div className="navbar bg-base-100">
      {addFriend&&<AddFriend closeFunction={setAddFriend}/>}
      {seeNotification&&<Notification closeFunction={setSeeNotification} notifications={notifications}/>}
  <div className="flex-1">
    <Link className="btn btn-ghost text-xl" to={'/home'}>Chat</Link>
  </div>
  <div className="flex-none gap-2">
    <div className="form-control">
      <input type="text" placeholder="Search" className="input input-bordered w-24 md:w-auto" />
    </div>
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
        <div className="w-10 rounded-full">
          <img alt="Tailwind CSS Navbar component" src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
        </div>
      </div>
      <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
        <li>
          <a className="justify-between">
            {user!=null?user.username:'profile'}
            
          </a>
        </li>
        <li
        onClick={()=>{setSeeNotification(true)
                      setAddFriend(false)
        }}
        ><a>Notifications{notifications.length&&<span className="badge bg-red-500 animate-pulse">.</span>}</a></li>
        <li onClick={()=>{setAddFriend(true)
          setSeeNotification(false)
        }}><a>Add a friend</a></li>
        <li onClick={()=>{
          localStorage.removeItem('token')
          navigate('/login')
        }}><a>Logout</a></li>
      </ul>
    </div>
  </div>
</div>
  )
}

export default Navbar
