import { checkToken } from "../config/jwt.js";
const handleUpload = (err,req,res,next) =>{
    return res.status(400).send({error:error.message});
}
const checkTokenExist = (req) =>{
    const {token} = req.headers;
    if(!token){
        return checkToken(token)
    }
    return false;
}
export {handleUpload, checkTokenExist}