import {responseJson} from '../utils/utils'
import Tag from '../models/tag'
import {CODE} from '../config/app.config'

//获取全部标签
export function getTagList(req, res) {
    let keyword = req.query.keyword || null
    let pageNum = parseInt(req.query.pageNum) || 1
    let pageSize = parseInt(req.query.pageSize) || 10
    let conditions = {}
    if (keyword) {
        const reg = new RegExp(keyword, 'i');
        conditions = {$or: [{name: {$regex: reg}}, {desc: {$regex: reg}}]}
    }
    let skip = pageNum - 1 < 0 ? 0 : (pageNum - 1) * pageSize
    let responseData = {
        count: 0,
        list: [],
    }
    Tag.countDocuments(conditions, (err, count) => {
        if (err) {
            console.error('Error:' + err)
        } else {
            responseData.count = count;
            let fields = {name: 1, desc: 1, icon: 1, create_time: 1, update_time: 1} // 待返回的字段
            let options = {
                skip: skip,
                limit: pageSize,
                sort: {create_time: -1},
            }
            Tag.find(conditions, fields, options, (error, result) => {
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

// 添加标签
export function addTag(req, res) {
    let {name, desc} = req.body
    Tag.findOne({
        name,
    }).then(result => {
        if (!result) {
            let tag = new Tag({
                name,
                desc,
            })
            tag.save()
                .then(data => {
                    responseJson(res,CODE.OK,'添加成功', data)
                })
                .catch(err => {
                    throw err
                })
        } else {
            responseJson(res,CODE.ERR,'该标签已存在')
        }
    }).catch(err => {
        responseJson(res)
    })
}

// 删除标签
export function delTag(req, res) {
    let { id } = req.body
    Tag.deleteMany({ _id: id })
        .then(result => {
            if (result.n === 1) {
                responseJson(res,CODE.OK,'删除成功')
            } else {
                responseJson(res,CODE.ERR,'标签不存在')
            }
        })
        .catch(err => {
            responseJson(res)
        })
}