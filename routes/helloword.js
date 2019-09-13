import {responseJson} from '../utils/utils'
import {CODE} from "../config/app.config";


export function helloWord(req,res) {
    responseJson(res, CODE.OK, '操作成功！', 'hello world!')
}