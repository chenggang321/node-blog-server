import {responseJson} from '../utils/utils'
import Message from '../models/message'
import User from '../models/user'
import {CODE} from "../config/app.config"

// 获取全部留言
export function getMessageList(req, res) {
    let keyword = req.query.keyword || null
    let state = req.query.state || ''
    let pageNum = parseInt(req.query.pageNum) || 1
    let pageSize = parseInt(req.query.pageSize) || 10
    let conditions = {}
    if (state === '') {
        if (keyword) {
            const reg = new RegExp(keyword, 'i') //不区分大小写
            conditions = {
                content: {$regex: reg},
            }
        }
    } else if (state) {
        state = parseInt(state)
        if (keyword) {
            const reg = new RegExp(keyword, 'i')
            conditions = {$and: [{$or: [{state: state}]}, {$or: [{content: {$regex: reg}}]}]}
        } else {
            conditions = {state}
        }
    } else {
        state = 0
        if (keyword) {
            const reg = new RegExp(keyword, 'i')
            conditions = {$and: [{$or: [{state: state}]}, {$or: [{content: {$regex: reg}}]}]}
        } else {
            conditions = {state}
        }
    }

    let skip = pageNum - 1 < 0 ? 0 : (pageNum - 1) * pageSize
    let responseData = {
        count: 0,
        list: [],
    }
    Message.countDocuments(conditions, (err, count) => {
        if (err) {
            console.error('Error:' + err)
        } else {
            responseData.count = count
            // 待返回的字段
            let fields = {
                user_id: 1,
                name: 1,
                avatar: 1,
                phone: 1,
                introduce: 1,
                content: 1,
                email: 1,
                state: 1,
                reply_list: 1,
                create_time: 1,
                update_time: 1,
            }
            let options = {
                skip: skip,
                limit: pageSize,
                sort: {create_time: -1},
            }
            Message.find(conditions, fields, options, (error, result) => {
                if (err) {
                    console.error('Error:' + error)
                    // throw error;
                } else {
                    responseData.list = result
                    responseJson(res, CODE.OK, 'success', responseData)
                }
            })
        }
    })
}

// 添加留言
export function addMessage(req, res) {
    let {user_id, content, email, phone, name} = req.body
    // 如果用户已经注册的，保存用户的信息，再保存留言内容
    if (user_id) {
        User.findById({
            _id: user_id,
        }).then(result => {
            if (result) {
                let message = new Message({
                    user_id: result._id,
                    name: name ? name : result.name,
                    avatar: result.avatar,
                    phone: result.phone,
                    introduce: result.introduce,
                    content: content,
                    email: email ? email : result.email,
                })
                message.save()
                    .then(data => {
                        responseJson(res, CODE.OK, '添加成功', data)
                    }).catch(err => {
                    console.error('err :', err)
                    throw err
                })
            } else {
            }
        })
            .catch(error => {
                console.error('error :', error)
                responseJson(res);
            })
    } else {
        // 直接保存留言内容
        let message = new Message({
            name: name,
            phone: phone,
            content: content,
            email: email,
        })
        message.save()
            .then(data => {
                responseJson(res, CODE.OK, '添加成功', data)
            }).catch(err2 => {
            console.error('err 2:', err2);
            throw err2;
        })
    }
}

// 删除留言
export function delMessage(req, res) {
    let {id} = req.body
    Message.deleteMany({_id: id})
        .then(result => {
            if (result.n === 1) {
                responseJson(res, CODE.OK, '删除成功!')
            } else {
                responseJson(res, CODE.ERR, '留言不存在或者已经删除！')
            }
        }).catch(err => {
        console.error('err :', err);
        responseJson(res)
    });
}

// 获取留言详情
export function getMessageDetail(req, res) {
    if (!req.session.userInfo) {
        responseJson(res, CODE.ERR, '您还没登录,或者登录信息已过期，请重新登录！')
        return;
    }
    let {id} = req.body
    Message.findOne({_id: id})
        .then(data => {
            responseJson(res, CODE.OK, '操作成功！', data)
        }).catch(err => {
        console.error('err :', err)
        responseJson(res)
    })
}

// 回复留言
export function addReplyMessage(req, res) {
    if (!req.session.userInfo) {
        responseJson(res, CODE.ERR, '您还没登录,或者登录信息已过期，请重新登录！')
        return
    }
    let {id, state, content} = req.body

    Message.findById({
        _id: id,
    }).then(result => {
        let list = result.reply_list
        let item = {
            content: content,
        }
        list.push(item)
        Message.update(
            {_id: id},
            {
                state: parseInt(state),
                reply_list: list,
            },
        ).then(data => {
            responseJson(res, CODE.OK, '操作成功', data)
        }).catch(err1 => {
            console.error('err1:', err1)
            responseJson(res)
        })
    }).catch(error2 => {
        console.error('error2 :', error2)
        responseJson(res)
    })
}
