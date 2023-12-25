import multer, { diskStorage } from "multer";

export const upload = multer({
    storage: diskStorage({
        destination: process.cwd() + "/Images",
        filename: (req, file, callback)=> callback(null, new Date().getTime() + "_" + file.originalname),
    }),
    fileFilter(req,file, callback) {
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            file["error"] = " Please upload a JPG, JPEG or PND file!"
            callback(undefined,false,file.error);
            callback(new Error(" Please upload a JPG, JPEG or PND file!"));

        } else{
            callback(undefined, true);
        }
    }
})
