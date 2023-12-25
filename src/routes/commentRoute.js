import  express  from "express";
import { deleteComment, getComment, getCommentByRoom, postComment, updateComment } from "../controller/comment.js";

const commentRoute = express.Router();
commentRoute.get("/get-comment",getComment)
commentRoute.post("/post-comment",postComment);
commentRoute.put("/put-comment/:id",updateComment);
commentRoute.delete("/delete-comment/:id",deleteComment);
commentRoute.get("/get-comment-by-room/:id",getCommentByRoom)
export default commentRoute;