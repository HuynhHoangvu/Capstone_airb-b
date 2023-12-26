import  express  from "express";
import {createLocal,listLocal,getLocal, updateLocal, deleteLocal, localPage, localImg} from "../controller/location.js"
import { upload } from "../controller/uploadController.js";
import { checkAuth } from "../config/jwt.js";
const localRoute = express.Router();

localRoute.get("/get-list",listLocal);
localRoute.post("/create-local",checkAuth,createLocal);
localRoute.get("/get-local/:id",getLocal);
localRoute.put("/update-local/:id",checkAuth,updateLocal);
localRoute.delete("/delete-local/:id",checkAuth,deleteLocal);
localRoute.put("/local-img/:id",upload.single("image"),localImg)

localRoute.get("/local-page/:keyword/:page/:pageSize",localPage)


export default localRoute;