import  express  from "express";
import {RoomPage, bookingByUserId, createBookRoom, createRoom, deleteBookRoom, deleteRoom, getBookingRoomById, getListBookRoom, getListRoom, getRoomById, getRoomByLocal, roomImg, updateBookRoom, updateRoom} from "../controller/roomController.js"
import { upload } from "../controller/uploadController.js";
import { checkAuth } from "../config/jwt.js";
const roomRoute = express.Router();

roomRoute.post("/create-room",createRoom);
roomRoute.get("/list-room",getListRoom);
roomRoute.get("/get-room-id/:id",getRoomByLocal);
roomRoute.get("/roomByid/:id",getRoomById);
roomRoute.put("/update-room/:id",checkAuth,updateRoom);
roomRoute.delete("/delete-room/:id",deleteRoom);
roomRoute.get("/room-page/:keyword/:page/:pageSize",RoomPage)
roomRoute.put("/room-img/:id",upload.single("image"),roomImg)

roomRoute.post("/booking",createBookRoom);
roomRoute.get("/booking",getListBookRoom);
roomRoute.get("/booking/:id",getBookingRoomById);
roomRoute.delete("/booking/:id",deleteBookRoom);
roomRoute.put("/booking/:id",updateBookRoom);
roomRoute.get("/booking-by-user/:id",bookingByUserId);  
export default roomRoute;
