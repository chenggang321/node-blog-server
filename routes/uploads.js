import {responseJson, md5,notNull} from '../utils/utils'
import {CODE} from "../config/app.config";
import path from 'path'
import File from '../models/file'

export const uploads = (req,res)=>{
    let file = req.file;
    const {
        destination,
        filename,
        mimetype,
        originalname,
        path
    } = file;
    let fileDoc = new File({
        destination,
        filename,
        path,
        mime_type:mimetype,
        original_name:originalname
    })
    fileDoc.save()
        .then(data => {
            responseJson(res,CODE.OK,'上传成功',data)
        })
        .catch(err => {
            throw err
        })
}

export const loadImg = (req,res)=>{
    let file = path.join(__dirname,'../uploads/' + 'c8e615ce9eddb011d890b07fea557c77');
    console.log(file);
    res.download(file);
}

