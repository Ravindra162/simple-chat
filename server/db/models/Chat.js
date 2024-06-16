const { DataTypes } = require('sequelize')
const {sequelize} = require('../db')
const Chat = sequelize.define('Chat', {
    chat_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    chat_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique:true
    },
    is_group: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    timestamps: false
  });
  async function createChat(){
    const response =  await Chat.sync({alter:false})
    console.log('Chat table created or updated')
 }   
 createChat()  

 module.exports = {Chat}