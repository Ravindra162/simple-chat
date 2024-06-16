const jwt = require('jsonwebtoken')
const authMiddleware = async (req,res,next) => {
    const token = req.headers['authorization']
    console.log("token "+token)
    if(token===undefined){
        return res.status(401).json("No token")
    }
    const verified = jwt.verify(token,"secret")
    console.log('verified - '+verified)
    if(!verified){
        return res.status(500).json({
            "message":"Authorisation failed"
        })
    }
    req.user = verified.user_id
    console.log(req.user)
    next();
}
module.exports = {authMiddleware}