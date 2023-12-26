import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const findUser = user_id =>{
    return prisma.users.findFirst({
        where:{
            user_id
        }
    })

}
const authPage = permission =>{
    return (req,res,next) =>{
        const {user_id,role} = req.body;
        if(!user_id){
            return res.status(403).send('You need to sign in!')
        }
        const user = findUser(user_id);
        if(!user){
            return res.status(403).send('User not found')
        }
        
        if(!permission.includes(role)){
            return res.status(403).send("You don't have permission")
        }
        next();
    }
}

export default authPage