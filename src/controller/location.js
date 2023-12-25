import { PrismaClient } from "@prisma/client";
import { decodeToken } from "../config/jwt.js";
import { checkTokenExist } from "../middleware/handler.js";

const prisma = new PrismaClient();
//thêm chức năng phân quyền
const createLocal = async(req,res) => {
    try{
        const token = req.headers.token;
        if (!token || checkTokenExist(req)) {
            return res.status(401).send("Unauthorized: Token is required or not valid");
        }

        const user = decodeToken(token);
        if (!user) {
            return res.status(401).send("Unauthorized: Invalid token");
        }
        let {ten_vi_tri, tinh_thanh, quoc_gia, hinh_anh} = req.body;
        let newLocal = {ten_vi_tri, tinh_thanh, quoc_gia, hinh_anh};
        const existingLocal = await prisma.locations.findFirst({
            where: {
                ten_vi_tri,
            },
        });

        if (existingLocal) {
            return res.status(400).send("Location name already exists");
        }

        let local = await prisma.locations.create({ data:newLocal });
        res.send(local)
    }
    catch(e){
        console.log(e)
        res.status(500).send("errorororor")
    }
}

const listLocal = async(req,res) =>{
    try{
        const list = await prisma.locations.findMany();
        if(!list){
            res.status(404).send("Not Found!");
            return;
        }
        res.send(list);
    }
    catch(e){
        console.log(e);
        res.status(500).send("Not Allow");
    }
}
const getLocal = async(req, res) =>{
    try{
        let local_id = Number(req.params.id);
        const local = await prisma.locations.findFirst({
            where:{
                local_id
            },
            
        });
        if(!local){
            res.status(404).send("Not Found");
            return;
        }
        res.send(local);
    }
    catch(e){
        console.log(e);
        res.status(500).send("Not Aloow");
    }
}
const updateLocal = async(req,res)=>{
    try{
        const token = req.headers.token;
        if (!token || checkTokenExist(req)) {
            return res.status(401).send("Unauthorized: Token is required or not valid");
        }

        const user = decodeToken(token);
        if (!user) {
            return res.status(401).send("Unauthorized: Invalid token");
        }
        let local_id = Number(req.params.id)
        let {ten_vi_tri,tinh_thanh,quoc_gia,hinh_anh}= req.body;
        const existingLocal = await prisma.locations.findFirst({
            where: {
                ten_vi_tri,
            },
        });

        if (existingLocal) {
            return res.status(400).send("Location name already exists");
        }
       let updated = await prisma.locations.update({
            where:{
                local_id
            },data:{
                ten_vi_tri,tinh_thanh,quoc_gia,hinh_anh
            }
        })
        res.send(updated)
    }catch(e){
        console.log(e);
        res.status(500).send("Not allow")
    }
}
const deleteLocal = async(req,res)=>{
    try{
        const token = req.headers.token;
        if (!token || checkTokenExist(req)) {
            return res.status(401).send("Unauthorized: Token is required or not valid");
        }

        const user = decodeToken(token);
        if (!user) {
            return res.status(401).send("Unauthorized: Invalid token");
        }
        let local_id = Number(req.params.id);
        await prisma.locations.delete({
            where:{local_id}
        })
        res.send("Done")
    }catch(e){
        console.log(e);
        res.status(500).send('Not Fine')
    }
}
const localPage = async (req,res) =>{
    try{
        const {keyword, page, pageSize } = req.params;

        let index = (page - 1) * pageSize;
        if (isNaN(page) || isNaN(pageSize)) {
            return res.status(400).send('Invalid page or pageSize values.');
          } 
        const lo = await prisma.locations.findMany({
            where:{
                ten_vi_tri:{
                   contains:keyword
                }
            },
            skip: index,
            take: +pageSize,
        });
        res.send(lo);
    }catch(e){
        console.log(e);
        res.status(500).send("Can't catch");
    }

}

const localImg = async (req,res) => {
    try{
        let local_id = Number(req.params.id);
        const {token} = await req.headers;
        if(!token){
         return res.status(400).send("Token is required");
        }
        const local = await decodeToken(token).data;
        if(!local){
         return res.status(400).send("invalid token");
        }
        const file = await req.file;
        if(!file){
            return res.status(400).send("File cần thiết")
        }
     
        const newImg = {
            hinh_anh:file.path
        }
       const img = await prisma.locations.update({
        where:{
            local_id 
        },
            data:newImg
        });
        res.send(img);
    }catch(e){
        console.log(e)
        res.status(500).send("Không thể kết nối")
    }
}
export {createLocal,listLocal,getLocal,updateLocal,deleteLocal,localPage,localImg}


