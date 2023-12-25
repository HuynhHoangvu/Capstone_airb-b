import { PrismaClient } from "@prisma/client";
import {decodeToken} from "../config/jwt.js";
import { checkTokenExist } from "../middleware/handler.js";

const prisma = new PrismaClient();

const createRoom = async(req,res) =>{
    try{
        let { ten_phong, khach, phong_ngu, giuong, phong_tam, mo_ta, gia_tien, may_giat, ban_la, tivi, dieu_hoa, wifi, bep, do_xe, ho_boi, ban_ui, ma_vi_tri, hinh_anh} = req.body;
        let newRoom = {ten_phong, khach, phong_ngu, giuong, phong_tam, mo_ta, gia_tien, may_giat, ban_la, tivi, dieu_hoa, wifi, bep, do_xe, ho_boi, ban_ui, ma_vi_tri, hinh_anh};
        const token = req.headers.token;
        if (!token || checkTokenExist(req)) {
            return res.status(401).send("Unauthorized: Token is required or not valid");
        }

        const user = decodeToken(token);
        if (!user) {
            return res.status(401).send("Unauthorized: Invalid token");
        }
        await prisma.rooms.create({ data : newRoom })
        res.send("Create oke")
    }
    catch(e){
        console.log(e);
        res.status(500).send("ERRO CONNECT");
    }
}
const getListRoom = async (req,res) =>{
    try{
      let list = await prisma.rooms.findMany();
        res.send(list);
    } catch(e){
        console.log(e);
        res.status(500).send("ERRO CONNECT");
    }
}
const getRoomByLocal = async (req,res) =>{
    try{
        let local_id = Number(req.params.id);
        let rooms = await prisma.rooms.findMany({
            where:{
                ma_vi_tri : local_id
            }
        });
        if(rooms == ""){
            res.send("Do not have this place");
            return;
        }
        res.send(rooms);
    }catch(e){
        console.log(e);
        res.status(500).send("ERRO CONNECT");
    }
}
//phan trang tim kiem

const RoomPage = async (req,res) =>{
        try{
            const {keyword, page, pageSize } = req.params;
    
            let index = (page - 1) * pageSize;
            if (isNaN(page) || isNaN(pageSize)) {
                return res.status(400).send('Invalid page or pageSize values.');
              } 
            const user = await prisma.rooms.findMany({
                where:{
                    ten_phong:{
                       contains:keyword
                    }
                },
                skip: index,
                take: +pageSize,
            });
            res.send(user);
        }catch(e){
            console.log(e);
            res.status(500).send("Can't catch");
        }
    
}


const getRoomById = async (req,res) =>{
    try{
        let roomId = Number(req.params.id);
        let rooms = await prisma.rooms.findMany({
            where:{
                room_id : roomId
            }
        });
        if(rooms == ""){
            res.send("Do not have this place");
            return;
        }
        res.send(rooms);
    }catch(e){
        console.log(e);
        res.status(500).send("ERRO CONNECT");
    }
}

const updateRoom = async(req,res) =>{
    try{
        let roomId = Number(req.params.id)
        let { ten_phong, khach, phong_ngu, giuong, phong_tam, mo_ta, gia_tien, may_giat, ban_la, tivi, dieu_hoa, wifi, bep, do_xe, ho_boi, ban_ui, ma_vi_tri, hinh_anh} = req.body;
        let update =  { ten_phong, khach, phong_ngu, giuong, phong_tam, mo_ta, gia_tien, may_giat, ban_la, tivi, dieu_hoa, wifi, bep, do_xe, ho_boi, ban_ui, ma_vi_tri, hinh_anh};
        const token = req.headers.token;
        if (!token || checkTokenExist(req)) {
            return res.status(401).send("Unauthorized: Token is required or not valid");
        }

        const user = decodeToken(token);
        if (!user) {
            return res.status(401).send("Unauthorized: Invalid token");
        }
        let room =  await prisma.rooms.update({ 
            where:{
                room_id : roomId
            },
            data: update
         })
        if(!room == ""){
            res.send("Nothing to update")
            return;
        }
        res.send(room)
        
    }
    catch(e){
        console.log(e);
        res.status(500).send("ERRO CONNECT");
    }
}
const deleteRoom = async(req,res)=>{
    try{
        let room_id = Number(req.params.id);
        await prisma.rooms.delete({
            where:{room_id}
        })
        res.send("Done")
    }catch(e){
        console.log(e);
        res.status(500).send('Not Fine')
    }
}

const roomImg = async (req,res) => {
    try{
        let room_id = Number(req.params.id);
        const {token} = await req.headers;
        if(!token){
         return res.status(400).send("Token is required");
        }
        const room = await decodeToken(token).data;
        if(!room){
         return res.status(400).send("invalid token");
        }
        const file = await req.file;
        if(!file){
            return res.status(400).send("File cần thiết")
        }
     
        const newImg = {
            hinh_anh:file.path
        }
       const img = await prisma.rooms.update({
        where:{
            room_id 
        },
            data:newImg
        });
        res.send(img);
    }catch(e){
        console.log(e)
        res.status(500).send("Không thể kết nối")
    }
}

const createBookRoom = async(req,res) =>{
    try{
        let {ma_phong,ngay_den,ngay_di,so_luong_khach,ma_nguoi_dat} = req.body;
        let newbook = {ma_phong,ngay_den,ngay_di,so_luong_khach,ma_nguoi_dat};
        if(newbook.so_luong_khach <= 0){
            return res.status(400).send("So luong khach phai lon hon 0")
        }
        const token = req.headers.token;
        if (!token || checkTokenExist(req)) {
            return res.status(401).send("Unauthorized: Token is required or not valid");
        }

        const user = decodeToken(token);
        if (!user) {
            return res.status(401).send("Unauthorized: Invalid token");
        }
        let bookRoom = await prisma.book_room.create({data: newbook});
        res.send(bookRoom);
    }catch(e){
        console.log(e)
        res.status(500).send("cant connect")
    }
}

const getListBookRoom = async(req,res) => {
    try{
        let booking = await prisma.book_room.findMany();
        if(!booking || booking == ""){
            return res.status(404).send("Not found any book room!");
        }
        res.send(booking);
    }catch(e){
        console.log(e)
        res.status(500).send("cant connect")
    }
}
const getBookingRoomById = async(req,res) => {
    try{
        let booking_id = Number(req.params.id);
    
        
        let booking = await prisma.book_room.findFirst({
            where:{
                book_id: booking_id
            }
        })
        if(!booking){
            return res.status(400).send("không tìm thấy tài nguyên");
        }
        res.send(booking);
    }
    catch(e){
        console.log(e)
        res.status(500).send("cant connect") 
    }
}
const deleteBookRoom = async (req, res) =>{
    try{
        let booking_id = Number(req.params.id);
          await prisma.book_room.delete({
            where:{
                book_id: booking_id
            }
        })
        
        res.send("xoá thành công");
    }
    catch(e){
        console.log(e)
        res.status(500).send("Record to delete does not exist.") 
    }
}

const updateBookRoom = async (req,res) =>{
    try{
        let book_id =Number(req.params.id);
        let {ma_phong,ngay_den,ngay_di,so_luong_khach,ma_nguoi_dat} = req.body;
        let update = {ma_phong,ngay_den,ngay_di,so_luong_khach,ma_nguoi_dat};
        let updated = await prisma.book_room.update({
            where:{book_id},
            data:update
        })
       
        res.send(updated);
    }catch(e){
        console.log(e)
        res.status(500).send("erro")
    }
}

const bookingByUserId = async (req, res) =>{
    try{
        let ma_nguoi_dat = Number(req.params.id);
      let users =  await prisma.book_room.findMany({where:{ma_nguoi_dat}})
        res.send(users)
    }
    catch(e){
        console.log(e)
        res.send("erro")
    }
}




export {createRoom,getListRoom,getRoomByLocal,roomImg,RoomPage,getRoomById,updateRoom,deleteRoom,createBookRoom,getListBookRoom,getBookingRoomById,deleteBookRoom,updateBookRoom,bookingByUserId}