import {responseJson} from '../utils/utils'
import Comment from '../models/comment'
import User from '../models/user'
import Article from '../models/article'
import {CODE} from "../config/app.config";

// 获取全部评论
export function getCommentList(req, res) {
    let keyword = req.query.keyword || null
    let comment_id = req.query.comment_id || null
    let pageNum = parseInt(req.query.pageNum) || 1
    let pageSize = parseInt(req.query.pageSize) || 10
    let conditions = {}
    if (comment_id) {
        if (keyword) {
            const reg = new RegExp(keyword, 'i') //不区分大小写
            conditions = {
                _id: comment_id,
                content: {$regex: reg},
            }
        } else {
            conditions = {
                _id: comment_id,
            }
        }
    } else {
        if (keyword) {
            const reg = new RegExp(keyword, 'i') //不区分大小写
            conditions = {
                content: {$regex: reg},
            }
        }
    }

    let skip = pageNum - 1 < 0 ? 0 : (pageNum - 1) * pageSize
    let responseData = {
        count: 0,
        list: [],
    }
    Comment.countDocuments(conditions, (err, count) => {
        if (err) {
            console.error('Error:' + err)
        } else {
            responseData.count = count
            // 待返回的字段
            let fields = {
                article_id: 1,
                content: 1,
                is_top: 1,
                likes: 1,
                user_id: 1,
                user: 1,
                other_comments: 1,
                state: 1,
                create_time: 1,
                update_time: 1,
            }
            let options = {
                skip: skip,
                limit: pageSize,
                sort: {create_time: -1},
            }
            Comment.find(conditions, fields, options, (error, result) => {
                if (err) {
                    console.error('Error:' + error)
                    // throw error;
                } else {
                    responseData.list = result
                    responseJson(res, CODE.OK, '操作成功！', responseData)
                }
            });
        }
    });
}

// 添加一级评论
export function addComment(req, res) {
    if (!req.session.userInfo) {
        responseJson(res, CODE.ERR, '您还没登录,或者登录信息已过期，请重新登录！')
        return
    }
    let {article_id, user_id, content} = req.body
    User.findById({
        _id: user_id,
    }).then(result => {
        if (result) {
            let userInfo = {
                user_id: result._id,
                name: result.name,
                type: result.type,
                avatar: result.avatar,
            }
            let comment = new Comment({
                article_id: article_id,
                content: content,
                user_id: user_id,
                user: userInfo,
            })
            comment
                .save()
                .then(commentResult => {
                    Article.findOne({_id: article_id}, (errors, data) => {
                        if (errors) {
                            console.error('Error:' + errors);
                            // throw errors;
                        } else {
                            data.comments.push(commentResult._id);
                            data.meta.comments = data.meta.comments + 1;
                            Article.updateOne({_id: article_id}, {comments: data.comments, meta: data.meta})
                                .then(result => {
                                    responseJson(res, CODE.OK, '操作成功 ！', commentResult)
                                })
                                .catch(err => {
                                    console.error('err :', err)
                                    throw err
                                })
                        }
                    })
                })
                .catch(err2 => {
                    console.error('err :', err2)
                    throw err2
                });
        } else {
            responseJson(res, CODE.ERR, '用户不存在')
        }
    }).catch(error => {
        console.error('error :', error)
        responseJson(res)
    })
}

// 添加第三者评论
export function addThirdComment(req, res) {
    if (!req.session.userInfo) {
        responseJson(res, CODE.ERR, '您还没登录,或者登录信息已过期，请重新登录！')
        return
    }
    let {article_id, comment_id, user_id, content, to_user} = req.body
    Comment.findById({
        _id: comment_id,
    }).then(commentResult => {
        User.findById({
            _id: user_id,
        }).then(userResult => {
            if (userResult) {
                let userInfo = {
                    user_id: userResult._id,
                    name: userResult.name,
                    type: userResult.type,
                    avatar: userResult.avatar,
                }
                let item = {
                    user: userInfo,
                    content: content,
                    to_user: JSON.parse(to_user),
                }
                commentResult.other_comments.push(item)
                Comment.updateOne(
                    {_id: comment_id},
                    {
                        other_comments: commentResult.other_comments,
                    },
                ).then(result => {
                    Article.findOne({_id: article_id}, (errors, data) => {
                        if (errors) {
                            console.error('Error:' + errors);
                            // throw errors;
                        } else {
                            data.meta.comments = data.meta.comments + 1
                            Article.updateOne({_id: article_id}, {meta: data.meta})
                                .then(ArticleResult => {
                                    responseJson(res, CODE.OK, '操作成功 ！', ArticleResult)
                                })
                                .catch(err => {
                                    throw err
                                })
                        }
                    })
                }).catch(err1 => {
                    console.error('err1:', err1)
                    responseJson(res)
                });
            } else {
                responseJson(res, CODE.ERR, '用户不存在')
            }
        }).catch(error => {
            console.error('error :', error)
            responseJson(res)
        })
    }).catch(error2 => {
        console.error('error2 :', error2)
        responseJson(res)
    })
}

// 更新评论
export function changeComment(req, res) {
    if (!req.session.userInfo) {
        responseJson(res, CODE.ERR, '您还没登录,或者登录信息已过期，请重新登录！')
        return
    }
    let {id, state} = req.body
    Comment.updateOne(
        {_id: id},
        {
            state: Number(state),
        },
    ).then(result => {
        responseJson(res, CODE.OK, '操作成功', result)
    }).catch(err => {
        console.error('err:', err)
        responseJson(res)
    })
}

export function changeThirdComment(req, res) {
    if (!req.session.userInfo) {
        responseJson(res, CODE.ERR, '您还没登录,或者登录信息已过期，请重新登录！')
        return
    }
    let {comment_id, state, index} = req.body
    Comment.findById({
        _id: comment_id,
    }).then(commentResult => {
        let i = index ? Number(index) : 0
        if (commentResult.other_comments.length) {
            commentResult.other_comments[i].state = Number(state)
            Comment.updateOne(
                {_id: comment_id},
                {
                    other_comments: commentResult,
                },
            ).then(result => {
                responseJson(res, CODE.OK, '操作成功', result)
            }).catch(err1 => {
                console.error('err1:', err1)
                responseJson(res)
            })
        } else {
            responseJson(res, CODE.ERR, '第三方评论不存在！')
        }
    }).catch(error2 => {
        console.log('error2 :', error2)
        responseJson(res)
    })
}