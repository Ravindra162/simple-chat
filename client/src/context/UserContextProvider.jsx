import React, { useEffect, useState } from "react";
import UserContext from "./UserContext";
import axios from "axios";
const UserContextProvider = ({children}) => {
    const [user,setUser] = useState(null)
    useEffect(()=>{
        axios.get('http://localhost:3000/users/get',{
            headers:{
                'Authorization':localStorage.getItem('token')
            }
        }).then(response=>{
            setUser(response.data.user)

        }).catch(err=>console.log(err))
    },[])
    
    return (
        <UserContext.Provider value={{user,setUser}}>
            {children}
        </UserContext.Provider>
    )
}

export default UserContextProvider