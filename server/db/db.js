const {Sequelize} = require('sequelize')
require('dotenv').config()
const connectionString = process.env.DB_CONNECTION_STRING
const sequelize = new Sequelize(connectionString,{dialect:'postgres',logging:false})
async function connectToDb(){
    try{
        await sequelize.authenticate()
        console.log("Connected to Db")
    }
    catch(err){
        console.log(err)
    }
}
module.exports = {connectToDb, sequelize}