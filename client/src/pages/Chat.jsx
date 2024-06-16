import axios from 'axios'
import React, { useContext, useEffect, useState, useRef } from 'react'
import WsContext from '../context/WsContext'
import { useParams } from 'react-router-dom'
import UserContext from '../context/UserContext'
const Chat = () => {
  const {user} = useContext(UserContext)
  const {ws} = useContext(WsContext)
  const chatContainerRef = useRef(null);
  const {friendId} = useParams()
  const [friend,setFriend] = useState('')
  const [messages,setMessages] = useState([])
  const [currentMessage,setCurrentMessage] = useState('')
  useEffect(()=>{
    if(user){
      if(ws){
        ws.send(JSON.stringify({username:user.username,type:"login"}))
        ws.onmessage = (message) => {
          console.log(message.data)
          const receivingMessage = message.data
          setMessages((prevMessages) => {
            return [...prevMessages, {message_text:receivingMessage,sender_id:0}];
          });
        }
        axios.get('http://localhost:3000/users/getChat?friend_id='+friendId,{
          headers:{
            Authorization:localStorage.getItem('token')
          }
        }).then(response=>{
          console.log(response.data)
          setMessages(response.data.messages)
          setFriend(response.data.friend)
        })
      }
    }
    
    
  },[user,ws])

  useEffect(() => {
    // Scroll to the last message when messages change
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault()
    if(currentMessage.trim('')==='')
      {
        alert("Message can't be empty")
        return console.log("Message can't be empty")
      }
    axios.post('http://localhost:3000/users/sendMessage',{
      friend_id:friendId,
      message:currentMessage
    },{
      headers:{
        Authorization:localStorage.getItem('token')
      }
    }).then(response=>{
      console.log(response.data)
      if(ws){
        ws.send(JSON.stringify({to_username:friend.username,message:currentMessage,type:"singleSend"}))
      }
      setMessages((prevMessages) => {
        return [...prevMessages, {message_text:currentMessage,sender_id:user.id}];
      });
    })
  }
  if(!user)return<>Loading....</>
  return (
    <div className='h-screen w-full flex justify-center mt-2'>
      <div className='container h-[90%] w-[90%] md:w-1/2 bg-slate-200'>
      <div className='h-[10%] w-full bg-red-300 flex'>
        <img className='h-[60px] w-[60px]' src={friend.profile}/>
        <div>
        {friend.username}
        </div>
      </div>
      <div ref={chatContainerRef} className='chat-container h-[80%] w-full bg-green-200 overflow-y-scroll'>
        {
          messages.map((elem,index)=>{
            if(elem.sender_id!==user.id)
            return <div key={index} className="chat chat-start my-5">
                    <div className="chat-bubble">{elem.message_text}</div>
                  </div>
            else return <div key={index} className="chat chat-end my-5">
                    <div className="chat-bubble">{elem.message_text}</div>
                  </div>
          })
        }
      </div>
      <div className='h-[10%] w-full bg-red-300 flex justify-center items-center gap-5'>
      <input
      onChange={(e)=>{setCurrentMessage(e.target.value)}}
      type="text" placeholder="Type here" className="input input-bordered input-accent w-full max-w-xs" />
      <button
      onClick={sendMessage}
      className="btn btn-accent">send</button>
      </div>
      </div>
    </div>
  )
}

export default Chat
