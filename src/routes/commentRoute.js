import  express  from "express";
import { deleteComment, getComment, getCommentByRoom, postComment, updateComment } from "../controller/comment.js";
import { checkAuth } from "../config/jwt.js";

const commentRoute = express.Router();
commentRoute.get("/get-comment",getComment)
commentRoute.post("/post-comment",checkAuth,postComment);
commentRoute.put("/put-comment/:id",checkAuth,updateComment);
commentRoute.delete("/delete-comment/:id",checkAuth,deleteComment);
commentRoute.get("/get-comment-by-room/:id",getCommentByRoom)
export default commentRoute;