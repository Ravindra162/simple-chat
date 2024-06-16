var express = require('express');
var router = express.Router();
const {User} = require('../db/models/User')
const {Chat} = require('../db/models/Chat')
const {ChatMember} = require('../db/models/ChatMember')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { Op, json, where } = require('sequelize');
const {authMiddleware} = require('../middleware/authMiddleware')
const {Notification} = require('../db/models/Notification');
const { Message } = require('../db/models/Message');
/* GET users listing. */
router.post('/register',async(req,res)=>{
  const {username,password} = req.body
  
  const user = await User.findOne({where:{username:username}})
  if(user!==null){
    return res.json({
      message:"User already exists"
    })
    
   
  }
  const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password,salt)
    console.log(hashedPassword)
    await User.create(
    {
      username:username,
      password:hashedPassword

    }
    )
    res.json({
      message:"User created successfully"
    })
})


router.post('/login',async(req,res)=>{
  const {username,password} = req.body
  const user = await User.findOne({where:{username:username}})
  if(!user){
    return res.json({
      message:"User does n't exists"
    })
  }
  const result = await bcrypt.compareSync(password,user.dataValues.password); 
  if(result){
    const token = jwt.sign({user_id:user.dataValues.id},'secret')
    return res.json({
      message:"Logged in successfully",
      token:token
    })
  }
  return res.json({
    message:"Incorrect password",
    token:""
  })
})


router.get('/get',authMiddleware,async(req,res)=>{
  const user_id = req.user
  const user = await User.findOne({
    where:{
     id:user_id
    }
  })
  if(!user){
    res.json({
      message:"details not found"
    })
  }
  res.json({
      message:"details found",
      user:{
        id:user.dataValues.id,
        username:user.dataValues.username,
        profile:user.dataValues.profile
      }
  })
})


router.get('/getUser',authMiddleware,async(req,res)=>{
  const {username} = req.query
  const user = await User.findAll({
    where:{
      username:{
        [Op.like]: `%${username}%`
      }
    }
  })
  const users = []
  for(var i=0;i<user.length;i++){
    users.push({id:user[i].dataValues.id,username:user[i].dataValues.username})
  }
  res.json({
    users
  })
})

router.get('/getAllFriends',authMiddleware,async(req,res)=>{
  const user_id = req.user
  console.log(req.user)
  const friends = []
  let chats = []
  const response = await ChatMember.findAll({where:{
    user_id:user_id
  }})
  chats = response
  for(var i=0;i<chats.length;i++){
    const newResponse = await ChatMember.findAll({
      where:{
        chat_id:chats[i].dataValues.chat_id,
        user_id:{[Op.ne]: user_id}
      }
    })
    for(var j=0;j<newResponse.length;j++){
      const friend = await User.findOne({where:{id:newResponse[j].dataValues.user_id}})
      friends.push(
        {
          id:newResponse[j].dataValues.user_id,
          username:friend.dataValues.username,
          profile:friend.dataValues.profile
        }
      )
    }

  }
  console.log(friends)
  res.json({friends})
  

  
})


router.post('/addFriend', authMiddleware, async (req, res) => {
  try {
    const { friendName } = req.body;
    const currentUser = await User.findOne({
      where:{
        id:req.user
      }
    })
      const user = await User.findOne({
      where: {
        username: friendName
      }
    });
    
    if (!user) {
      return res.json({
        message: "User doesn't exist"
      });
    }

    const user_id = req.user; // Assuming req.user contains user information including ID
    const friend_id = user.id;
    console.log(user)

    const existingChat = await Chat.findOne({
      where: {
        [Op.or]: [
          { chat_name: { [Op.like]: user_id+'-'+friend_id } },
          { chat_name: { [Op.like]: friend_id+'-'+user_id } }
        ]
      }
    });
    console.log("existing one ")
    console.log(existingChat)

    if (existingChat) {
      return res.json({
        message: "Already in friend list"
      });
    }

    const notification = await Notification.findOne({
      where:{
        recipient_id: friend_id,
      sender_id: user_id,
      type: 'friend_request'
      }
      
    })
    console.log(notification)
    if(notification){
      return res.json({
        message:"You have already sent this notifcation"
      })
    }

    // Create notifications
    await Notification.create({
      recipient_id: friend_id,
      sender_id: user_id,
      type: 'friend_request',
      message: `You have received a friend request from ${currentUser.dataValues.username}`
    });

    res.json({
      message: "Friend request sent successfully"
    });
  } catch (error) {
    console.error("Error adding friend:", error);
    res.status(500).json({ message: "You already sent request ot error occurred" });
  }
});


router.post('/acceptFriendRequest', authMiddleware, async (req, res) => {
  try {
    const { friend_id } = req.body; // Assuming friend_id is provided in the request body
    const user_id = req.user; // Assuming req.user contains user information including ID
    const user = await User.findOne({where:{id:user_id}})
    // Find the friend request notification
    const notification = await Notification.findOne({
      where: {
        recipient_id: user_id,
        sender_id: friend_id,
        type: 'friend_request'
      }
    });

    
    if (!notification || notification.is_read) {
      return res.status(404).json({ message: "Friend request not found or already accepted" });
    }
    await Notification.destroy(
  {
    where:{
      recipient_id: user_id,
      sender_id: friend_id,
      type: 'friend_request'
    }
  })
    const chat = await Chat.create({
      chat_name:user_id+"-"+friend_id,
      is_group:false
    })
    await ChatMember.bulkCreate([
      {
        chat_id:chat.chat_id,
        user_id:user_id
      },
      {
        chat_id:chat.chat_id,
        user_id:friend_id
      }
    ])
    await Notification.create({
      recipient_id:friend_id,
      sender_id:user_id,
      type:'friend_request_accept',
      message:`You are now friend of ${user.dataValues.username} `
    })


    res.json({
      message: "Friend request accepted successfully"
    });
  } catch (error) {
    console.error("Error accepting friend request:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get('/getChat',authMiddleware,async(req,res)=>{
  const user_id = req.user
  const {friend_id} = req.query 
  const friend = await User.findOne({
    where:{
      id:friend_id
    }
  })
  const chat = await Chat.findOne({
    where:{
      [Op.or]:[{
        chat_name:user_id+'-'+friend_id
      },{
        chat_name:friend_id+'-'+user_id
      }]
      
    }
  })
  const messages = await Message.findAll({
    where:{
      chat_id:chat.dataValues.chat_id
    }
  })
  res.json({
    messages:messages,
    friend:friend
  })
})

router.post('/sendMessage',authMiddleware,async function(req, res){
  const {friend_id,message} = req.body
  const user_id = req.user
  const chat = await Chat.findOne({
    where:{
      [Op.or]:[
        {chat_name:user_id+'-'+friend_id},
        {chat_name:friend_id+'-'+user_id}
      ]
    }
  })
  if(!chat){
    return res.json({
      message:"Chat not found"
    })
  }
  const chat_id = chat.dataValues.chat_id
  await Message.create({
    chat_id,
    message_text:message,
    sender_id:user_id,
    receiver_id : friend_id
  })

  res.json({
    message:"Message sent successfully"
  })
  
})

router.post('/markAsRead',authMiddleware,async(req,res)=>{
  const {notification_id} = req.body
  const notification = await Notification.findOne({
    where:{
      id:notification_id
    }
  })
  if(!notification){
    return res.json({
      message:"notification does n't exists or already read"
    })
  }
  await notification.destroy({
    where:{
      id:notification_id
    }
  })
  res.json({
    message:"Notification read successfully"
  })
})

router.get('/getNotifications',authMiddleware,async function(req,res){
  const user_id = req.user
  const notifications = await Notification.findAll({where:{recipient_id:user_id}})
  console.log(notifications)
  res.json(notifications)
})



module.exports = router;
