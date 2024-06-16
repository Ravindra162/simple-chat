const { DataTypes } = require('sequelize')
const {sequelize} = require('../db')
const User = sequelize.define(
    'User',
    {
        username:{
            type:DataTypes.STRING,
            allowNull:false,
            unique:true
        },
        password:{
            type:DataTypes.STRING,
            allowNull:false
        },
        profile:{
            type:DataTypes.STRING,
            defaultValue:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAd5avdba8EiOZH8lmV3XshrXx7dKRZvhx-A&s'
        }
    },
    {
        timestamps:false
    }
)

async function createUser(){
    await User.sync({alter:false})
   console.log('User table created or updated')

}   
createUser()

module.exports = {User}