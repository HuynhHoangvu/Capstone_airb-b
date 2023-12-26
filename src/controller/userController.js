import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import {createToken,decodeToken} from "../config/jwt.js";
import { checkTokenExist } from "../middleware/handler.js";
const prisma = new PrismaClient();
const signup = async(req,res) => {
    try{
        let {name, email,pass_word,phone,birth_day,avatar,gender,role} = req.body
        const checkEmail = await prisma.users.findFirst({
            where:{
                email
            }
        });
        if(checkEmail){
              res.send("Email have already taken");
              return;
        }
        let newPassword = bcrypt.hashSync(pass_word,10);
        let newUser = {
            name,
            email,
            pass_word:newPassword,
            phone,
            birth_day,
            avatar,
            gender,
            role
        };
       let user = await prisma.users.create({ data : newUser });
        res.send(user);
    }
    catch(e){
        res.status(500).send("Can't conect")
        console.log(e)
    }
}

const login = async (req,res) => {
    try{
        let {email, pass_word} = await req.body;
        let user = await prisma.users.findFirst({
            where:{
                email
            }
        });
        //check email
        if(!user){
            res.send("Wrong email or email not exist");
            return;
        }
        const comparePass = bcrypt.compareSync(pass_word, user.pass_word);
        if(!comparePass){
            res.status(404).send("Wrong password!");
            return;
        }
        const token = createToken(user);

        res.send(token);
    }
    catch(e){
        res.status(400).send("Can't connect");
    }
}

const updateUser = async(req,res) =>{
    try{

       const {name,email,phone,birth_day,avatar, gender,role} = req.body;

       const userId = Number(req.params.id);
       const existingEmail = await prisma.users.findFirst({
        where: {
            email,
            user_id: {
                not: userId
            },
        },
    });
    if (existingEmail) {
        return res.status(400).send("Email is already in use by another user");
    }    
       const updateUser = await prisma.users.update({
        where:{
            user_id:userId
        },data:{name,email,phone,birth_day,avatar,gender,role},
        
            select: {
                name: true,
                email: true,
                phone: true,
                pass_word:false,
                birth_day: true,
                avatar: true,
                gender: true,
                role: true,
            },
        
       })
       
       res.status(200).send(updateUser);
    }catch(e){
        console.log(e);
        res.status(500).send("Can't catch");
    }
   
}
const listUser = async(req,res) => {
    try{ 

      let list =  await prisma.users.findMany();
      list = list.map(user => ({
        ...user,
        pass_word: null,
        phone:null
    }));
    res.send(list)
    }catch(e){
        console.log(e);
        res.status(500).send("err")
    }
}
const deleteUser =  async (req,res) => {
    try{
        
        let user_id = Number(req.params.id);
        await prisma.users.delete({
            where:{user_id}
        })
        res.send("done");
    }catch(e){
        console.log(e)
        res.send("err")
    }
}

const getUserById = async (req,res) => {
    try{
        const {token} = req.headers;
        if(!token){
         return res.status(400).send("Token is required");
        }
        const user = decodeToken(token);
        if(!user){
         return res.status(400).send("invalid token");
        }

        if(!user){
         return res.status(400).send("invalid token");
        }
    let user_id = Number(req.params.id);
       let users = await prisma.users.findFirst({
            where:{
                user_id
            }
        })
        delete users.pass_word;
        res.send(users)
    }catch(e){
        res.status(500).send("errr")
        console.log(e)
    }
}
const findUserByName = async (req,res) => {
    try{
        const {keyword} = await req.query;
        const user = await prisma.users.findMany({
            where:{
                name:{
                    contains:keyword,
                }
            }
        })
        if(!user.length){
            return res.status(404).send("Not Found!");
        }
        
        res.send(user);
    }catch(e){
        console.log(e);
        res.status(500).send("can't catch")
    }
}
const getUserPage = async (req,res) =>{
    try{
        const {keyword, page, pageSize } = req.params;

        let index = (page - 1) * pageSize;
        if (isNaN(page) || isNaN(pageSize)) {
            return res.status(400).send('Invalid page or pageSize values.');
          } 
        const user = await prisma.users.findMany({
            where:{
                name:{
                   contains:keyword
                }
            },
            skip: index,
            take: +pageSize,
            select: {
                name: true,
                email: true,
                phone: true,
                birth_day:true,
                gender:true,
                role:true

            }
        });
        res.send(user);
    }catch(e){
        console.log(e);
        res.status(500).send("Can't catch");
    }
}
const uploadAvatar = async (req,res) => {
    try{
        let user_id = Number(req.params.id);
        const {token} = await req.headers;
        if(!token){
         return res.status(400).send("Token is required");
        }
        const user = await decodeToken(token).data;
        if(!user){
         return res.status(400).send("invalid token");
        }
        const file = await req.file;
        if(!file){
            return res.status(400).send("File cần thiết")
        }
        console.log(file);
        const newAvatar = {
            avatar:file.path
        }
       const ava = await prisma.users.update({
        where:{
            user_id 
        },
            data:newAvatar
        });
        delete ava.pass_word
        res.send(ava);
    }catch(e){
        console.log(e)
        res.status(500).send("Không thể kết nối")
    }
}
export {
    signup, login,listUser,deleteUser,getUserById,findUserByName,updateUser,getUserPage,uploadAvatar
}
