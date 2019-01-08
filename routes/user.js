import User from '../models/user'
import {responseJson, md5,notNull} from '../utils/utils'
import {MD5_SUFFIX,CODE} from "../config/app.config"

// 注册
export function register(req, res) {
    let {username, password, email} = req.body
    // 用户是否重复
    User.findOne({username})
        .then(data => {
            if(data) return responseJson(res,CODE.ERR,'用户已存在！')
            // 保存
            let user = new User({
                username,
                password:md5(password+MD5_SUFFIX),
                email
            })
            user.save()
                .then(data=>{
                    responseJson(res,CODE.OK,'注册成功',data)
                })
                .catch(err=>{
                    notNull(err,res)
                })
        })
}

// 登陆
export function login(req,res){
    let { username, password } = req.body
    User.findOne({
        username,
        password: md5(password + MD5_SUFFIX),
    }).then(userInfo => {
            if (userInfo) {
                //登录成功后设置session
                req.session.userInfo = userInfo
                responseJson(res,CODE.OK,'登录成功',userInfo)
            } else {
                responseJson(res,CODE.ERR,'用户名或者密码错误')
            }
        })
        .catch(err => {
            notNull(err,res)
        })
}

// 用户验证
export function userInfo(req, res){
    if (req.session.userInfo) {
        responseJson(res,CODE.OK, req.session.userInfo)
    } else {
        responseJson(res,CODE.ERR, '请重新登录', req.session.userInfo)
    }
}

// 退出
export function logout(req, res){
    if (req.session.userInfo) {
        req.session.userInfo = null // 删除session
        responseJson(res,CODE.OK, '登出成功')
    } else {
        responseJson(res,CODE.ERR,'您还没登录')
    }
}

// 删除用户
export function delUserById(req, res){
    let { id } = req.body
    User.deleteMany({ _id: id })
        .then(result => {
            if (result.n === 1) {
                responseJson(res,CODE.OK,'用户删除成功')
            } else {
                responseJson(res,CODE.ERR,'用户不存在')
            }
        })
        .catch(err => {
            responseJson(res)
        })
}

// 获取所有用户
export function getUserList(req, res){
    let keyword = req.query.keyword || ''
    // 分页逻辑
    let pageNum = parseInt(req.query.pageNum) || 1
    let pageSize = parseInt(req.query.pageSize) || 10
    let conditions = {}
    if (keyword) {
        const reg = new RegExp(keyword, 'i');
        conditions = { $or: [{ name: { $regex: reg } }, { email: { $regex: reg } }] }
    }
    let skip = pageNum - 1 < 0 ? 0 : (pageNum - 1) * pageSize
    let responseData = {
        count: 0,
        list: [],
        pageNum
    };
    User.countDocuments(conditions, (err, count) => {
        if (err) {
            console.error('Error:' + err)
        } else {
            responseData.count = count
            // 待返回的字段
            let fields = {
                _id: 1,
                email: 1,
                username: 1,
                type: 1,
                create_time: 1
            }
            let options = {
                skip: skip,
                limit: pageSize,
                sort: { create_time: -1 },
            }
            User.find(conditions, fields, options, (error, result) => {
                if (err) {
                    console.error('Error:' + error)
                    // throw error;
                } else {
                    responseData.list = result
                    responseJson(res,CODE.OK,'success', responseData)
                }
            })
        }
    })
}
