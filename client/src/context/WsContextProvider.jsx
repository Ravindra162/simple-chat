import React, { useEffect, useState } from "react";
import WsContext from "./WsContext";
const WsContextProvider = ({children}) => {
    const [ws,setWs] = useState(null)
    useEffect(()=>{
    
    const server = new WebSocket('http://localhost:3000/')
    setWs(server)
    server.onopen=()=>{
        console.log('WS connected')
    }
    },[])
    
    return (
        <WsContext.Provider value={{ws}}>
            {children}
        </WsContext.Provider>
    )
}

export default WsContextProvider