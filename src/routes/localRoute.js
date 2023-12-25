import  express  from "express";
import {createLocal,listLocal,getLocal, updateLocal, deleteLocal, localPage, localImg} from "../controller/location.js"
import { upload } from "../controller/uploadController.js";
const localRoute = express.Router();

localRoute.get("/get-list",listLocal);
localRoute.post("/create-local",createLocal);
localRoute.get("/get-local/:id",getLocal);
localRoute.put("/update-local/:id",updateLocal);
localRoute.delete("/delete-local/:id",deleteLocal);
localRoute.put("/local-img/:id",upload.single("image"),localImg)

localRoute.get("/local-page/:keyword/:page/:pageSize",localPage)


export default localRoute;