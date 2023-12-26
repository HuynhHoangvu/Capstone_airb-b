import config from './config.js';
import jwt from 'jsonwebtoken';

const createToken = (data) => {
    let token = jwt.sign({ data }, "ABCD", { algorithm: "HS256",expiresIn:"5y" })

    return token;
}

const checkToken = (data) =>{
    return jwt.verify(data,config.secret_string, function (err,decode){
        if(err){
            return 401;
        }
    })
}

const decodeToken = (token) =>{
    return jwt.decode(token);
}
const checkAuth = (req,res,next) =>{
    try{
        let {token} = req.headers;
        checkToken(token);
       if(!token){
        return res.status(400).send("Token is required or not valid");
       }
       const user = decodeToken(token);
       if(!user){
        return res.status(400).send("invalid token");
       }
        next();
    }catch(e){
        res.status(401).send("Không có quyền")
    }
}
export {
    createToken,
    checkToken,
    decodeToken,
    checkAuth
}