import User from '../models/user'
import {responseJson, md5} from '../utils/utils'
import {MD5_SUFFIX,CODE} from "../config/app.config"

// 注册
export function register(req, res) {
    let {username, password, email, type} = req.body;
    // 用户是否重复
    User.findOne({username})
        .then(data => {
            if(data) return responseJson(res,CODE.ERR,'用户已存在！')
            // 保存
            let user = new User({
                username,
                password:md5(password+MD5_SUFFIX),
                email,
                type
            });
            user.save()
                .then(data=>{
                    console.log(data)
                    responseJson(res,CODE.OK,'注册成功',data)
                })
                .catch(err=>{
                    console.log(err)
                    return responseJson(res)
                })
        })
}