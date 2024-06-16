const { DataTypes } = require('sequelize')
const {sequelize} = require('../db')
const ChatMember = sequelize.define('ChatMember', {
    chat_member_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    chat_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Chats',
        key: 'chat_id'
      }
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id'
      }
    }
  },{
    timestamps:false
  })

  const createChatMember = async() => {
    await ChatMember.sync({alter:false})
    console.log('Chat Member table created or updated')
  }

  createChatMember()

  module.exports = {ChatMember}
  