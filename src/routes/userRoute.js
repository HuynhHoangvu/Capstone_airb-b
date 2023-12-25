import express from 'express';
import {login, signup,listUser, deleteUser, getUserById, findUserByName, updateUser, getUserPage, uploadAvatar} from '../controller/userController.js'
import {  upload } from '../controller/uploadController.js';
const userRoute = express.Router();

userRoute.post("/signup",signup);
userRoute.post("/login",login)
userRoute.get("/list-user",listUser);
userRoute.delete("/delete-user/:id",deleteUser);
userRoute.get("/get-user-id/:id",getUserById);
userRoute.put("/update-user/:id",updateUser);
userRoute.get("/find-user",findUserByName);
userRoute.get("/phan-trang-tim-kiem/:keyword/:page/:pageSize",getUserPage);
userRoute.put("/upload/:id",upload.single("image"),uploadAvatar)
export default userRoute;