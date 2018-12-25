import {responseJson} from '../utils/utils'
import TimeAxis from '../models/timeAxis'
import {CODE} from "../config/app.config";

// 获取全部时间轴内容
export function getTimeAxisList(req, res) {
    let keyword = req.query.keyword || null
    let state = req.query.state || ''
    let pageNum = parseInt(req.query.pageNum) || 1
    let pageSize = parseInt(req.query.pageSize) || 10
    let conditions = {}
    if (!state) {
        if (keyword) {
            const reg = new RegExp(keyword, 'i') //不区分大小写
            conditions = {
                $or: [{title: {$regex: reg}}, {content: {$regex: reg}}],
            }
        }
    } else if (state) {
        state = parseInt(state)
        if (keyword) {
            const reg = new RegExp(keyword, 'i')
            conditions = {
                $and: [
                    {$or: [{state: state}]},
                    {$or: [{title: {$regex: reg}}, {content: {$regex: reg}}]},
                ],
            }
        } else {
            conditions = {state}
        }
    }

    let skip = pageNum - 1 < 0 ? 0 : (pageNum - 1) * pageSize
    let responseData = {
        count: 0,
        list: [],
    };
    TimeAxis.countDocuments(conditions, (err, count) => {
        if (err) {
            console.error('Error:' + err)
        } else {
            responseData.count = count
            let fields = {title: 1, content: 1, state: 1, start_time: 1, end_time: 1, update_time: 1} // 待返回的字段
            let options = {
                skip: skip,
                limit: pageSize,
                sort: {end_time: -1},
            }
            TimeAxis.find(conditions, fields, options, (error, result) => {
                if (err) {
                    console.error('Error:' + error)
                    // throw error;
                } else {
                    responseData.list = result
                    responseJson(res, CODE.OK, '操作成功！', responseData)
                }
            })
        }
    })
}

// 添加时间轴
export function addTimeAxis(req, res) {
    let {title, state, content, start_time, end_time} = req.body
    TimeAxis.findOne({
        title,
    }).then(result => {
        if (!result) {
            let timeAxis = new TimeAxis({
                title,
                state,
                content,
                start_time,
                end_time,
            })
            timeAxis.save()
                .then(data => {
                    responseJson(res, CODE.OK, '操作成功！', data)
                }).catch(err => {
                console.error('err :', err)
                // throw err;
            })
        } else {
            responseJson(res, CODE.ERR, '该时间轴内容已存在')
        }
    }).catch(errro => {
        console.error('errro :', errro)
        responseJson(res)
    })
}

// 更新时间轴
export function updateTimeAxis(req, res) {
    let {id, title, state, content, start_time, end_time} = req.body
    TimeAxis.updateOne(
        {_id: id},
        {
            title,
            state: Number(state),
            content,
            start_time,
            end_time,
            update_time: new Date(),
        },
    ).then(result => {
        responseJson(res, CODE.OK, '操作成功', result)
    }).catch(err => {
        console.error('err:', err)
        responseJson(res)
    })
}

// 删除时间轴
export function delTimeAxis(req, res) {
    let {id} = req.body
    TimeAxis.deleteMany({_id: id})
        .then(result => {
            if (result.n === 1) {
                responseJson(res, CODE.OK, '操作成功!')
            } else {
                responseJson(res, CODE.ERR, '时间轴内容不存在')
            }
        }).catch(err => {
        console.error('err :', err)
        responseJson(res)
    })
}

// 获取详情
export function getTimeAxisDetail(req, res) {
    let {id} = req.body
    TimeAxis.findOne({_id: id})
        .then(data => {
            responseJson(res, CODE.OK, '操作成功！', data)
        }).catch(err => {
        console.error('err :', err)
        responseJson(res)
    })
}