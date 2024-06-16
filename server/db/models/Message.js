const { DataTypes } = require('sequelize')
const {sequelize} = require('../db')
const Message = sequelize.define('Message', {
    message_id: {
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
    sender_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    receiver_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    message_text: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    sent_at: {
      type: DataTypes.DATE,
      defaultValue:  () => new Date()
    }
  }, {
    timestamps: false
  });
  const createMessage = async() => {
    await Message.sync({alter:false})
    console.log('Message table created or updated')
  }

  createMessage()
  
  module.exports = {Message}