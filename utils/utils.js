import crypto from 'crypto'

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

