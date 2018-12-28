import {responseJson} from '../utils/utils'
import Article from '../models/article'
import User from '../models/user'
import {CODE} from "../config/app.config"

// 添加文章
export function addArticle(req, res) {
    const {title, author, keyword, content, desc, img_url, tags, category, state, type, origin} = req.body;
    const tempArticle = new Article({
        title,
        author,
        keyword: keyword ? keyword.split(',') : [],
        content,
        numbers: content.length,
        desc,
        img_url,
        tags: tags ? tags.split(',') : [],
        category: category ? category.split(',') : [],
        state,
        type,
        origin,
    });

    tempArticle
        .save()
        .then(data => {
            responseJson(res, CODE.OK, '保存成功', data);
        })
        .catch(err => {
            console.log(err);
            responseJson(res);
        });
}

// 更新文章
export function updateArticle(req, res) {
    const {title, author, keyword, content, desc, img_url, tags, category, state, type, origin, id} = req.body;
    Article.update(
        {_id: id},
        {
            title,
            author,
            keyword: keyword ? keyword.split(',') : [],
            content,
            desc,
            img_url,
            tags: tags ? tags.split(',') : [],
            category: category ? category.split(',') : [],
            state,
            type,
            origin,
        }
    ).then(result => {
        responseJson(res, CODE.OK, '操作成功', result)
    }).catch(err => {
        console.error(err)
        responseJson(res)
    });
}

// 删除文章
export function delArticle(req, res) {
    let {id} = req.body
    Article.deleteMany({_id: id})
        .then(result => {
            if (result.n === 1) {
                responseJson(res, CODE.OK, '删除成功!');
            } else {
                responseJson(res, CODE.ERR, '文章不存在');
            }
        })
        .catch(err => {
            console.error('err :', err)
            responseJson(res)
        })
}

// 文章列表
export function getArticleList(req, res) {
    let keyword = req.query.keyword || null
    let state = req.query.state || ''
    let likes = req.query.likes || ''
    let tag_id = req.query.tag_id || ''
    let category_id = req.query.category_id || ''
    let pageNum = parseInt(req.query.pageNum) || 1
    let pageSize = parseInt(req.query.pageSize) || 10
    let conditions = {}
    if (!state) {
        if (keyword) {
            const reg = new RegExp(keyword, 'i'); //不区分大小写
            conditions = {
                $or: [{title: {$regex: reg}}, {desc: {$regex: reg}}]
            }
        }
    } else if (state) {
        state = parseInt(state);
        if (keyword) {
            const reg = new RegExp(keyword, 'i');
            conditions = {
                $and: [
                    {$or: [{state: state}]},
                    {$or: [{title: {$regex: reg}}, {desc: {$regex: reg}}, {keyword: {$regex: reg}}]},
                ]
            }
        } else {
            conditions = {state}
        }
    }

    let skip = pageNum - 1 < 0 ? 0 : (pageNum - 1) * pageSize
    let responseData = {
        count: 0,
        list: [],
    }
    Article.countDocuments(conditions, (err, count) => {
        if (err) {
            console.log('Error:' + err)
        } else {
            responseData.count = count;
            // 待返回的字段
            let fields = {
                title: 1,
                author: 1,
                keyword: 1,
                desc: 1,
                img_url: 1,
                tags: 1,
                category: 1,
                state: 1,
                type: 1,
                origin: 1,
                comments: 1,
                like_User_id: 1,
                meta: 1,
                create_time: 1,
                update_time: 1,
            };
            let options = {
                skip: skip,
                limit: pageSize,
                sort: {create_time: -1},
            };
            Article.find(conditions, fields, options, (error, result) => {
                if (err) {
                    console.error('Error:' + error);
                    // throw error;
                } else {
                    let newList = []
                    if (likes) {
                        // 根据热度 likes 返回数据
                        result.sort((a, b) => {
                            return b.meta.likes - a.meta.likes
                        })
                        responseData.list = result
                    } else if (category_id) {
                        // 根据 分类 id 返回数据
                        result.forEach(item => {
                            if (item.category.indexOf(category_id) > -1) {
                                newList.push(item)
                            }
                        })
                        let len = newList.length
                        responseData.count = len
                        responseData.list = newList
                    } else if (tag_id) {
                        // 根据标签 id 返回数据
                        result.forEach(item => {
                            if (item.tags.indexOf(tag_id) > -1) {
                                newList.push(item)
                            }
                        })
                        let len = newList.length
                        responseData.count = len
                        responseData.list = newList
                    } else {
                        responseData.list = result
                    }
                    responseJson(res, CODE.OK, '操作成功！', responseData)
                }
            })
        }
    })
}

// 文章点赞
export function likeAricle(req, res) {
    if (!req.session.userInfo) {
        responseJson(res, CODE.OK, '您还没登录,或者登录信息已过期，请重新登录！')
        return
    }
    let {id, user_id} = req.body
    Article.findOne({_id: id})
        .then(data => {
            let fields = {}
            data.meta.likes = data.meta.likes + 1
            fields.meta = data.meta
            let like_users_arr = data.like_users.length ? data.like_users : []
            User.findOne({_id: user_id})
                .then(user => {
                    let new_like_user = {
                        id: user._id,
                        name: user.name,
                        avatar: user.avatar,
                        create_time: user.create_time,
                        type: user.type,
                        introduce: user.introduce
                    }
                    like_users_arr.push(new_like_user)
                    fields.like_users = like_users_arr
                    Article.update({_id: id}, fields)
                        .then(result => {
                            responseJson(res, CODE.OK, '操作成功！', result)
                        })
                        .catch(err => {
                            console.error('err :', err)
                            throw err
                        })
                })
                .catch(err => {
                    responseJson(res)
                    console.error('err 1:', err)
                })
        })
        .catch(err => {
            responseJson(res)
            console.error('err 2:', err)
        })
}

// 通过type获取文章详情
export function getArticleDetailByType(req, res) {
    let {type} = req.body
    if (!type) {
        responseJson(res, CODE.ERR, '文章不存在')
        return;
    }
    Article.findOne({type: type}, (Error, data) => {
        if (Error) {
            console.error('Error:' + Error)
            // throw error;
        } else {
            data.meta.views = data.meta.views + 1
            Article.updateOne({type: type}, {meta: data.meta})
                .then(result => {
                    responseJson(res, CODE.OK, '操作成功 ！', data)
                })
                .catch(err => {
                    console.error('err :', err)
                    throw err
                })
        }
    })
        .populate([
            {path: 'tags', select: '-_id'},
            {path: 'category', select: '-_id'},
            {path: 'comments', select: '-_id'},
        ])
        .exec((err, doc) => {
            // console.log("doc:");          // aikin
            // console.log("doc.tags:",doc.tags);          // aikin
            // console.log("doc.category:",doc.category);           // undefined
        })
}

// 通过id获取文章详情
export function getArticleDetail(req, res) {
    let {id} = req.body
    let type = Number(req.body.type) || 1 //文章类型 => 1: 普通文章，2: 简历，3: 管理员介绍
    if (type === 1) {
        if (!id) {
            responseJson(res, CODE.ERR, '文章不存在 ！')
            return
        }
        Article.findOne({_id: id}, (Error, data) => {
            if (Error) {
                console.error('Error:' + Error)
                // throw error;
            } else {
                data.meta.views = data.meta.views + 1
                Article.updateOne({_id: id}, {meta: data.meta})
                    .then(result => {
                        responseJson(res, CODE.OK, '操作成功 ！', data);
                    })
                    .catch(err => {
                        console.error('err :', err);
                        throw err;
                    });
            }
        })
            .populate([
                {path: 'tags',},
                {path: 'category',},
                {path: 'comments',},
            ])
            .exec((err, doc) => {
                // console.log("doc:");          // aikin
                // console.log("doc.tags:",doc.tags);          // aikin
                // console.log("doc.category:",doc.category);           // undefined
            })
    } else {
        Article.findOne({type: type}, (Error, data) => {
            if (Error) {
                console.log('Error:' + Error)
                // throw error;
            } else {
                if (data) {
                    data.meta.views = data.meta.views + 1
                    Article.updateOne({type: type}, {meta: data.meta})
                        .then(result => {
                            responseJson(res, CODE.OK, '操作成功 ！', data)
                        })
                        .catch(err => {
                            console.error('err :', err)
                            throw err
                        })
                } else {
                    responseJson(res, CODE.ERR, '文章不存在 ！')
                    return false
                }
            }
        })
            .populate([
                {path: 'tags',},
                {path: 'category',},
                {path: 'comments',},
            ])
            .exec((err, doc) => {
                // console.log("doc:");          // aikin
                // console.log("doc.tags:",doc.tags);          // aikin
                // console.log("doc.category:",doc.category);           // undefined
            })
    }
}