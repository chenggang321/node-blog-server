import crypto from 'crypto'
import {CODE} from "../config/app.config";

// 返回为json数据
export function responseJson(res,code = 3, message = '服务器正忙！', data = {}) {
    let responseData = {
        code,
        message,
        data
    };
    res.json(responseData);
}

// 加密
export function md5(args) {
    let md5 = crypto.createHash('md5');
    return md5.update(args).digest('hex');
}

// 校验
export function notNull(err,res){
    if(err.name === 'ValidationError'){
        let errorKey = Object.keys(err.errors)[0];
        let message = err.errors[errorKey].message;
        const NOTNULL = 'Validator failed for path `'+errorKey+'` with value ``';
        if(message === NOTNULL) {
            return responseJson(res,CODE.ERR,errorKey+'不能为空！')
        }
    }
    return responseJson(res)
}


