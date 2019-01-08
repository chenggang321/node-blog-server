import {responseJson} from '../utils/utils'
import Category from '../models/category'
import {CODE} from "../config/app.config";
import Article from "../models/article";

// 获取全部分类
export function getCategoryList(req, res){
    let keyword = req.query.keyword || null
    let pageNum = parseInt(req.query.pageNum) || 1
    let pageSize = parseInt(req.query.pageSize) || 10
    let conditions = {}
    if (keyword) {
        const reg = new RegExp(keyword, 'i')
        conditions = { $or: [{ name: { $regex: reg } }, { desc: { $regex: reg } }] }
    }
    let skip = pageNum - 1 < 0 ? 0 : (pageNum - 1) * pageSize
    let responseData = {
        count: 0,
        list: [],
        pageNum
    };
    Category.countDocuments(conditions, (err, count) => {
        if (err) {
            console.error('Error:' + err)
        } else {
            responseData.count = count
            let fields = { name: 1, desc: 1, create_time: 1, update_time: 1,_id:1 } // 待返回的字段
            let options = {
                skip: skip,
                limit: pageSize,
                sort: { create_time: -1 },
            }
            Category.find(conditions, fields, options, (error, result) => {
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
// 获取分类详情
export function getCategoryDetail(req,res){
    let {id} = req.body
    Category.findOne({_id: id}, (Error, data) => {
        if (Error) {
            console.error('Error:' + Error)
            // throw error;
        }
        console.log(data)
    }).then(data=>{
        responseJson(res,CODE.OK,'操作成功',data)
    })
}

// 添加分类
export function addCategory(req, res){
    let { name, desc } = req.body
    Category.findOne({
        name,
    }).then(result => {
            if (!result) {
                let category = new Category({
                    name,
                    desc,
                })
                category
                    .save()
                    .then(data => {
                        responseJson(res,CODE.OK,'添加成功', data)
                    })
                    .catch(err => {
                        throw err
                    })
            } else {
                responseJson(res,CODE.OK,'该分类已存在')
            }
        })
        .catch(err => {
            console.error('err :', err)
            responseJson(res)
        })
}

// 修改分类
export function updateCategory(req,res){
    const {name, desc, id} = req.body;
    Category.updateOne(
        {_id: id},
        {
            name,
            desc
        }
    ).then(result => {
        responseJson(res, CODE.OK, '操作成功', result)
    }).catch(err => {
        console.error(err)
        responseJson(res)
    });
}

// 删除分类
export function delCategory(req, res){
    let { id } = req.body;
    Category.deleteMany({ _id: id })
        .then(result => {
            if (result.n === 1) {
                responseJson(res,CODE.OK,'操作成功');
            } else {
                responseJson(res,CODE.ERR,'分类不存在');
            }
        })
        .catch(err => {
            console.error('err :', err);
            responseJson(res);
        });
}