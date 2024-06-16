const {WebSocket} = require('ws')
var {server} = require('../bin/www')
const wss = new WebSocket.Server({
    server
})
const users = new Map()

wss.on('connection',(ws)=>{
    console.log('hello from server')
    
    ws.on('message',(data,isBinary)=>{
            const {username,type} = JSON.parse(data.toString())
            switch(type){
                case "login":
                    users.set(username,{WebSocket:ws,username:username})
                    console.log(users)
                    break
                case "singleSend":
                     const {message,to_username} = JSON.parse(data.toString())
                     console.log(to_username+" "+message)
                     const recipient = users.get(to_username);
                     if(recipient){
                        const rws = recipient.WebSocket
                        rws.send(message,{binary:isBinary})
                     }
                     

            }
    })





        
        ws.on('close', () => {
            // Iterate through each room and clear timers
            
        });
})
