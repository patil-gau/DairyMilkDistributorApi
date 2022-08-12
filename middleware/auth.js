const jwt = require('jsonwebtoken');

const SECRET = process.env.SECRET;

const authMiddleWare = async(req,res,next)=>{

    const response = {
        status : 0,
        msg : "",
    }

    //grab the token 
    const token = req.header('Authorization') && req.header('Authorization').replace("Bearer ","") || req.cookies && req.cookies.token;
    if(!token){
        response.msg = "Please provide a token";
        return res.status(403).json(response);
    }
    
    //check validaty of the token
    try {
        const decode = await jwt.verify(token,SECRET);
    } catch (error) {
        console.log(`[ERROR] ${String(error)}`);
        response.msg = "Invalid token provided";
        return res.status(401).json(response);
    }
    // pass the request forward
    next();
}

module.exports = authMiddleWare;