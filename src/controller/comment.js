import { PrismaClient } from "@prisma/client";
import { checkTokenExist } from "../middleware/handler.js";
import { decodeToken } from "../config/jwt.js";

const prisma = new PrismaClient();

const getComment = async (req,res) =>{
    try{
        let comment = await prisma.comments.findMany();
        res.send(comment)
    }catch(e){
        console.log(e)
        res.status(500).send("network err")
    }
}
const postComment = async (req,res) => {
    try{
        let {ma_phong,ma_nguoi_binh_luan,ngay_binh_luan,noi_dung,sao_binh_luan} = req.body;
        let newComment = {ma_phong,ma_nguoi_binh_luan,ngay_binh_luan,noi_dung,sao_binh_luan};
        const token = req.headers.token;
        if (!token || checkTokenExist(req)) {
            return res.status(401).send("Unauthorized: Token is required or not valid");
        }

        const user = decodeToken(token);
        if (!user) {
            return res.status(401).send("Unauthorized: Invalid token");
        }
        let comment = await prisma.comments.create({data:newComment});
        res.send(comment);

    }catch(e){
        console.log(e)
        res.status(500).send("false")
    }
}

//update Comment
const updateComment = async (req,res) => {
    try{
        let comment_id = Number(req.params.id);
        let {ma_phong,ma_nguoi_binh_luan,ngay_binh_luan,noi_dung,sao_binh_luan} = req.body;
        let newComment = {ma_phong,ma_nguoi_binh_luan,ngay_binh_luan,noi_dung,sao_binh_luan};
        const token = req.headers.token;
        if (!token || checkTokenExist(req)) {
            return res.status(401).send("Unauthorized: Token is required or not valid");
        }

        const user = decodeToken(token);
        if (!user) {
            return res.status(401).send("Unauthorized: Invalid token");
        }
        let updateComment = await prisma.comments.update({
           where:{ comment_id },
           data: newComment
        }
        )
        res.send(updateComment);
    }catch(e){
        console.log(e);
        res.send(500).send("erro")
    }
}
const deleteComment = async (req,res) =>{
    try{ 
        let comment_id = Number(req.params.id);
        const token = req.headers.token;
        if (!token || checkTokenExist(req)) {
            return res.status(401).send("Unauthorized: Token is required or not valid");
        }

        const user = decodeToken(token);
        if (!user) {
            return res.status(401).send("Unauthorized: Invalid token");
        }
    
        await prisma.comments.delete({
          where:  {comment_id}
        })
        res.send("Done")
    }catch(e){
        console.log(e)
        res.status(500).send("err")
    }
}

const getCommentByRoom = async (req,res) => {
    try{
        let room_id = Number(req.params.id);
        let room = await prisma.comments.findMany({
         where:{ma_phong: room_id}
        })
        if(!room || room == ""){
            res.status(400).send("Not found comment in that room");
        }

        res.send(room);
    }
    catch(e){
        console.log(e)
        res.status(500).send("err");
    }
}

export {postComment,getComment,updateComment,deleteComment,getCommentByRoom}